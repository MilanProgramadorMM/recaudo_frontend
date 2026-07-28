import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';
import { ZonaService, ZonaResponseDto } from '@core/services/zona.service';
import { PersonZonaService } from '@core/services/person-zona.service';
import { SharedFilterService } from '@core/services/shared-filter.service';
import { AuthenticationService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { switchMap } from 'rxjs';
import { CarteraEstadoComponent } from './rango-cartera/cartera-estado/cartera-estado.component';
import { CarteraEvolucionComponent } from './rango-cartera/cartera-evolucion/cartera-evolucion.component';

/**
 * Componente contenedor de la sección de Cartera.
 *
 * Sigue exactamente el mismo patrón que SalesComponent:
 *  - Filtro de zona + rango de fechas (Flatpickr) en un FormGroup reactivo.
 *  - Carga las zonas según el rol del usuario (asesor vs admin/backoffice).
 *  - Publica los filtros seleccionados vía SharedFilterService.
 *  - Los componentes hijos (cartera-estado, cartera-evolucion) se suscriben
 *    a SharedFilterService.filters$ y cargan sus propios datos de forma
 *    independiente — este componente NO les pasa datos por @Input().
 */
@Component({
  selector: 'app-cartera-components',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlatpickrDirective,
    CarteraEstadoComponent,
    CarteraEvolucionComponent,
  ],
  templateUrl: './cartera-components.component.html',
  styleUrl: './cartera-components.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarteraComponentsComponent implements OnInit, AfterViewInit {

  filterForm: FormGroup;
  zonas: ZonaResponseDto[] = [];
  loading = false;
  flatpickrOptions: any;

  currentUserRole: string | null = null;
  currentUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private zonaService: ZonaService,
    private personZonaService: PersonZonaService,
    private authService: AuthenticationService,
    private sharedFilterService: SharedFilterService,
    private userService: UserService
  ) {
    const today = new Date();

    this.flatpickrOptions = {
      mode: 'range',
      dateFormat: 'd M',
      defaultDate: [today, today],
      locale: {
        firstDayOfWeek: 1,
        weekdays: {
          shorthand: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
          longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        },
        months: {
          shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        },
      },
      onChange: (selectedDates: Date[]) => {
        if (selectedDates.length === 2) {
          this.onDateRangeChange(selectedDates);
        }
      }
    };

    const todayStr = this.formatDate(today);

    this.filterForm = this.fb.group({
      zona: [''],
      dateRange: [todayStr]
    });
  }

  ngOnInit(): void {
    this.getUserDataFromToken();
    this.loadZonasByRole();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupFilterListeners();
    }, 100);
  }

  getUserDataFromToken(): void {
    this.currentUserRole = this.authService.getUserRole();
    this.currentUserId = this.authService.getUserId();
  }

  loadZonasByRole(): void {
    this.loading = true;

    if (this.currentUserRole?.toLowerCase() === 'asesor') {
      this.loadZonasForAsesor();
    } else {
      this.loadAllActiveZonas();
    }
  }

  private loadZonasForAsesor(): void {
    if (!this.currentUserId) {
      console.error('No se pudo obtener el ID del asesor');
      this.loading = false;
      return;
    }

    this.userService.getUserById(this.currentUserId).pipe(
      switchMap(response => {
        const user = response.data;

        if (!user?.person_id) {
          throw new Error('El usuario no tiene person_id');
        }

        return this.personZonaService.getZonasByAsesor(user.person_id);
      })
    ).subscribe({
      next: (response) => {
        this.zonas = response.data.map(az => ({
          id: az.zonaId,
          value: az.zonaName,
          description: '',
          status: true
        }));

        this.initializeFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar zonas del asesor:', err);
        this.zonas = [];
        this.loading = false;
      }
    });
  }

  private loadAllActiveZonas(): void {
    this.zonaService.getByStatus().subscribe({
      next: (response) => {
        this.zonas = response.data;
        this.initializeFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar zonas:', err);
        this.zonas = [];
        this.loading = false;
      }
    });
  }

  private initializeFilters(): void {
    this.sharedFilterService.setZonas(this.zonas);

    if (this.zonas.length > 0) {
      const primeraZona = this.zonas[0];
      this.filterForm.patchValue({
        zona: primeraZona.value
      });

      const today = this.formatDate(new Date());
      this.sharedFilterService.setFilters({
        zona: primeraZona.value,
        zonaId: primeraZona.id!,
        fechaInicio: today,
        fechaFin: today
      });
    }
  }

  setupFilterListeners(): void {
    this.filterForm.get('zona')?.valueChanges.subscribe(zonaValue => {
      if (!zonaValue) return;

      const zonaId = this.sharedFilterService.getZonaIdByValue(zonaValue);
      const filters = this.sharedFilterService.getFilters();

      this.sharedFilterService.setFilters({
        ...filters,
        zona: zonaValue,
        zonaId: zonaId
      });
    });
  }

  onDateRangeChange(selectedDates: Date[]): void {
    if (selectedDates && selectedDates.length === 2) {
      const fechaInicio = this.formatDate(selectedDates[0]);
      const fechaFin = this.formatDate(selectedDates[1]);

      const filters = this.sharedFilterService.getFilters();
      this.sharedFilterService.setFilters({
        ...filters,
        fechaInicio,
        fechaFin
      });
    }
  }

  private formatDate(date: Date | string): string {
    if (typeof date === 'string') return date;
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  }
}
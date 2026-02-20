import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StatsComponent } from "./components/stats/stats.component";
import { OverviewChartComponent } from "./components/overview-chart/overview-chart.component";
import { RecentOrdersComponent } from "./components/recent-orders/recent-orders.component";
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';
import { ZonaService, ZonaResponseDto } from '@core/services/zona.service';
import { PersonZonaService } from '@core/services/person-zona.service';
import { SharedFilterService } from '@core/services/shared-filter.service';
import { AuthenticationService } from '@core/services/auth.service';
import { PersonService } from '@core/services/person.service';
import { UserService } from '@core/services/user.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StatsComponent,
    OverviewChartComponent,
    FlatpickrDirective,
    RecentOrdersComponent,
  ],
  templateUrl: './sales.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SalesComponent implements OnInit, AfterViewInit {

  @ViewChild('dateRangeInput') dateRangeInput!: ElementRef;

  filterForm: FormGroup;
  zonas: ZonaResponseDto[] = [];
  loading = false;
  flatpickrOptions: any;

  // Variables para manejo de roles
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
    console.log('Local:', today.toString());
    console.log('UTC:', today.toISOString());
    console.log('Timezone offset:', today.getTimezoneOffset());


    // Configurar opciones de Flatpickr con fecha de hoy por defecto
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

    const todayStr = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');

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

  /**
   * Obtener datos del usuario desde el token
   */
  getUserDataFromToken(): void {
    this.currentUserRole = this.authService.getUserRole();
    this.currentUserId = this.authService.getUserId();

    console.log('Usuario logueado:', {
      role: this.currentUserRole,
      userId: this.currentUserId
    });
  }

  /**
   * Cargar zonas según el rol del usuario
   */
  loadZonasByRole(): void {
    this.loading = true;

    // Verificar si el rol es 'asesor'
    if (this.currentUserRole?.toLowerCase() === 'asesor') {
      this.loadZonasForAsesor();
    } else {
      // Para 'admin', 'backoffice' o cualquier otro rol
      this.loadAllActiveZonas();
    }
  }

  /**
   * Cargar zonas asignadas a un asesor específico
   */
  private loadZonasForAsesor(): void {
    if (!this.currentUserId) {
      console.error('No se pudo obtener el ID del asesor');
      this.loading = false;
      return;
    }

    this.loading = true;

    this.userService.getUserById(this.currentUserId).pipe(
      switchMap(response => {
        const user = response.data;

        if (!user?.person_id) {
          throw new Error('El usuario no tiene person_id');
        }

        console.log('User obtenido:', user);

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

        console.log('Zonas del asesor cargadas:', this.zonas);
      },
      error: (err) => {
        console.error('Error al cargar zonas del asesor:', err);
        this.zonas = [];
        this.loading = false;
      }
    });
  }


  /**
   * Cargar todas las zonas activas (para admin/backoffice)
   */
  private loadAllActiveZonas(): void {
    this.zonaService.getByStatus().subscribe({
      next: (response) => {
        this.zonas = response.data;
        this.initializeFilters();
        this.loading = false;
        console.log('Zonas activas cargadas:', this.zonas);
      },
      error: (err) => {
        console.error('Error al cargar zonas:', err);
        this.zonas = [];
        this.loading = false;
      }
    });
  }

  /**
   * Inicializar filtros con la primera zona disponible
   */
  private initializeFilters(): void {
    this.sharedFilterService.setZonas(this.zonas);

    if (this.zonas.length > 0) {
      const primeraZona = this.zonas[0];
      this.filterForm.patchValue({
        zona: primeraZona.value
      });

      // Emitir filtros iniciales con la primera zona y fecha de hoy
      const today = new Intl.DateTimeFormat('sv-SE').format(new Date());
      this.sharedFilterService.setFilters({
        zona: primeraZona.value,
        zonaId: primeraZona.id!,
        fechaInicio: today,
        fechaFin: today
      });
    }
  }

  setupFilterListeners(): void {
    // Escuchar cambios en zona
    this.filterForm.get('zona')?.valueChanges.subscribe(zonaValue => {
      if (!zonaValue) return;

      const zonaId = this.sharedFilterService.getZonaIdByValue(zonaValue);
      const filters = this.sharedFilterService.getFilters();

      this.sharedFilterService.setFilters({
        ...filters,
        zona: zonaValue,
        zonaId: zonaId
      });
      console.log('Filtro zona aplicado:', { zonaValue, zonaId });
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
      console.log('Filtro fecha aplicado:', { fechaInicio, fechaFin });
    }
  }

  private formatDate(date: Date | string): string {
    if (typeof date === 'string') return date;
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  }
}
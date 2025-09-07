import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactInfoService } from '@core/services/contactInfo.service';
import { GlotypesService } from '@core/services/glotypes.service';
import { UbicacionService } from '@core/services/ubicacion.service';
import { of, Subject, switchMap, tap, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-update-contact-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './update-contact-info.component.html',
  styleUrls: ['./update-contact-info.component.scss']
})
export class UpdateContactInfoComponent implements OnInit, OnDestroy {
  @Input() contactInfo: any;
  @Input() person: any;

  form!: FormGroup;
  parametersGlotypes: any[] = [];
  paises: any[] = [];
  departamentos: any[] = [];
  ciudades: any[] = [];
  barrios: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private contactInfoService: ContactInfoService,
    private glotypesService: GlotypesService,
    private ubicacionService: UbicacionService
  ) { }

  ngOnInit() {
    // 1) Crear UNA SOLA VEZ el form (no volver a reasignarlo)
    this.form = this.fb.group({
      typeInfo: ['', Validators.required],
      direccion: [''],
      pais: [null],
      ciudad: [null],
      barrio: [null],
      departamento: [null],
      telefono: [''],
      correo: [''],
      descripcion: ['']
    });

    // 2) Cargar tipos y setear valores iniciales SIN reconstruir el form
    this.loadTypesAndPatchInitial();

    // 3) Cargar ubicación y preseleccionar valores iniciales SIN disparar valueChanges
    this.loadUbicacionInicial();

    // 4) Registrar listeners (sobre la instancia actual del form)
    this.setupListeners();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---------- Carga de tipos y patch inicial ----------
  private loadTypesAndPatchInitial() {
    this.glotypesService.getGlotypesByKey('TIPUBI').subscribe(types => {
      this.parametersGlotypes = types.map(d => {
        if (d.name.toUpperCase().includes('DIRECCIÓN')) return { ...d, key: 'DIR' };
        if (d.name.toUpperCase().includes('TELÉFONO')) return { ...d, key: 'TEL' };
        if (d.name.toUpperCase().includes('CELULAR')) return { ...d, key: 'CEL' };
        if (d.name.toUpperCase().includes('CORREO')) return { ...d, key: 'COR' };
        return d;
      });

      // Parchear valores base (NO reconstruir form)
      this.form.patchValue({
        typeInfo: this.contactInfo?.typeCode || '',
        direccion: this.contactInfo?.typeCode === 'DIR' ? this.contactInfo?.value : '',
        telefono: (this.contactInfo?.typeCode === 'TEL' || this.contactInfo?.typeCode === 'CEL') ? this.contactInfo?.value : '',
        correo: this.contactInfo?.typeCode === 'COR' ? this.contactInfo?.value : '',
        descripcion: this.contactInfo?.description || ''
      }, { emitEvent: false });
    });
  }

  getTypeLabel(code: string): string {
    switch (code) {
      case 'DIR': return 'Dirección';
      case 'TEL': return 'Teléfono';
      case 'CEL': return 'Celular';
      case 'COR': return 'Correo';
      default: return '';
    }
  }

  private findIdByLabel(list: any[], label: string): number | null {
    if (!label) return null;
    const match = list.find(item => item.label?.toLowerCase() === label.toLowerCase());
    return match ? match.id : null;
    // Si tu backend expone también 'code' o 'value', ajusta aquí.
  }

  // ---------- Carga inicial en cascada (sin disparar listeners) ----------
  private loadUbicacionInicial() {
    this.ubicacionService.getPaises().pipe(
      tap(paises => this.paises = paises),
      switchMap((paises) => {
        const paisId = this.findIdByLabel(paises, this.contactInfo?.country);
        if (paisId) this.form.patchValue({ pais: paisId }, { emitEvent: false });
        return paisId ? this.ubicacionService.getDepartamentos(paisId) : of([]);
      }),
      tap(deps => this.departamentos = deps),
      switchMap((deps) => {
        const depId = this.findIdByLabel(deps, this.contactInfo?.department);
        if (depId) this.form.patchValue({ departamento: depId }, { emitEvent: false });
        return depId ? this.ubicacionService.getMunicipios(depId) : of([]);
      }),
      tap(muns => this.ciudades = muns),
      switchMap((muns) => {
        const munId = this.findIdByLabel(muns, this.contactInfo?.city);
        if (munId) this.form.patchValue({ ciudad: munId }, { emitEvent: false });
        return munId ? this.ubicacionService.getBarrios(munId) : of([]);
      }),
      tap(bars => this.barrios = bars),
      tap((bars) => {
        const barId = this.findIdByLabel(bars || [], this.contactInfo?.neighborhood);
        if (barId) this.form.patchValue({ barrio: barId }, { emitEvent: false });
      })
    ).subscribe();
  }

  // ---------- Listeners en cascada ----------
  private setupListeners() {
    // País → Departamentos
    this.form.get('pais')?.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroy$),
      switchMap((paisId: number | null) => {
        if (!paisId) {
          this.departamentos = [];
          this.ciudades = [];
          this.barrios = [];
          this.form.patchValue({ departamento: null, ciudad: null, barrio: null }, { emitEvent: false });
          return of([]);
        }
        return this.ubicacionService.getDepartamentos(paisId);
      })
    ).subscribe(deps => {
      this.departamentos = deps;
      this.ciudades = [];
      this.barrios = [];
      // Limpiar hijos sin disparar más eventos
      this.form.patchValue({ departamento: null, ciudad: null, barrio: null }, { emitEvent: false });
    });

    // Departamento → Municipios/Ciudades
    this.form.get('departamento')?.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroy$),
      switchMap((depId: number | null) => {
        if (!depId) {
          this.ciudades = [];
          this.barrios = [];
          this.form.patchValue({ ciudad: null, barrio: null }, { emitEvent: false });
          return of([]);
        }
        return this.ubicacionService.getMunicipios(depId);
      })
    ).subscribe(muns => {
      this.ciudades = muns;
      this.barrios = [];
      this.form.patchValue({ ciudad: null, barrio: null }, { emitEvent: false });
    });

    // Ciudad/Municipio → Barrios
    this.form.get('ciudad')?.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroy$),
      switchMap((munId: number | null) => {
        if (!munId) {
          this.barrios = [];
          this.form.patchValue({ barrio: null }, { emitEvent: false });
          return of([]);
        }
        return this.ubicacionService.getBarrios(munId);
      })
    ).subscribe(bars => {
      this.barrios = bars;
      this.form.patchValue({ barrio: null }, { emitEvent: false });
    });
  }

  // ---------- Guardado ----------
  onSubmit() {
    if (this.form.invalid) return;

    const typeSelected = this.parametersGlotypes.find(t => t.key === this.form.value.typeInfo);
    if (!typeSelected) return;

    const payload: any = {
      personId: this.person.id,
      typeId: typeSelected.id
    };

    switch (this.form.value.typeInfo) {
      case 'DIR':
        payload.value = this.form.value.direccion.toUpperCase() || '';
        payload.country = this.form.value.pais;
        payload.department = this.form.value.departamento;
        payload.city = this.form.value.ciudad;
        payload.neighborhood = this.form.value.barrio;
        payload.description = this.form.value.descripcion.toUpperCase() || '';
        break;
      case 'TEL':
      case 'CEL':
        payload.value = this.form.value.telefono;
        break;
      case 'COR':
        payload.value = this.form.value.correo;
        break;
    }

    this.contactInfoService.updateContactInfo(this.contactInfo.id, payload)
      .subscribe(() => this.activeModal.close(true));
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactInfoService } from '@core/services/contactInfo.service';
import { GlotypesService } from '@core/services/glotypes.service';
import { UbicacionService } from '@core/services/ubicacion.service';
import { of, Subject, switchMap, tap, distinctUntilChanged, takeUntil } from 'rxjs';
import { LoadingComponent } from '@views/ui/loading/loading.component';

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

  @ViewChild('successalert', { static: true }) successAlertTpl!: TemplateRef<any>;
  @ViewChild('erroralert', { static: true }) errorAlertTpl!: TemplateRef<any>;

  errorMessage = '';
  lastErrorMessage = '';
  successDetails: string = '';
  formSubmitted = false; // Nueva propiedad para tracking

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
    private ubicacionService: UbicacionService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
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

    this.loadTypesAndPatchInitial();
    this.loadUbicacionInicial();
    this.setupListeners();
    this.setupTypeInfoListener();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Método helper para verificar si un campo es inválido
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.formSubmitted));
  }

  private loadTypesAndPatchInitial() {
    this.glotypesService.getGlotypesByKey('TIPUBI').subscribe(types => {
      this.parametersGlotypes = types;

      this.form.patchValue({
        typeInfo: this.contactInfo?.typeCode || '',
        direccion: (this.contactInfo?.typeCode === 'DIR' || this.contactInfo?.typeCode === 'DIRPRIN')
          ? this.contactInfo?.value : '',
        telefono: (this.contactInfo?.typeCode === 'TEL' || this.contactInfo?.typeCode === 'TELPRIN'
          || this.contactInfo?.typeCode === 'CEL' || this.contactInfo?.typeCode === 'CEPRIN')
          ? this.contactInfo?.value : '',
        correo: (this.contactInfo?.typeCode === 'COR' || this.contactInfo?.typeCode === 'COPRIN')
          ? this.contactInfo?.value : '',
        descripcion: this.contactInfo?.description || ''
      }, { emitEvent: false });

      // Aplicar validadores después de cargar los datos
      this.updateValidators(this.contactInfo?.typeCode || '');
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
  }

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

  private setupListeners() {
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
      this.form.patchValue({ departamento: null, ciudad: null, barrio: null }, { emitEvent: false });
    });

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

  private setupTypeInfoListener() {
    // Escuchar cambios en typeInfo
    this.form.get('typeInfo')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(typeInfo => {
      this.updateValidators(typeInfo);
    });
  }

  private updateValidators(typeInfo: string) {
    // Limpiar todos los validadores primero
    this.form.get('direccion')?.clearValidators();
    this.form.get('pais')?.clearValidators();
    this.form.get('departamento')?.clearValidators();
    this.form.get('ciudad')?.clearValidators();
    this.form.get('barrio')?.clearValidators();
    this.form.get('descripcion')?.clearValidators();
    this.form.get('telefono')?.clearValidators();
    this.form.get('correo')?.clearValidators();

    // Aplicar validadores según el tipo
    if (typeInfo === 'DIR' || typeInfo === 'DIRPRIN') {
      this.form.get('direccion')?.setValidators([Validators.required]);
      this.form.get('pais')?.setValidators([Validators.required]);
      this.form.get('departamento')?.setValidators([Validators.required]);
      this.form.get('ciudad')?.setValidators([Validators.required]);
      this.form.get('barrio')?.setValidators([Validators.required]);
      this.form.get('descripcion')?.setValidators([Validators.required]);
    } else if (typeInfo === 'TEL' || typeInfo === 'TELPRIN' || typeInfo === 'CEL' || typeInfo === 'CEPRIN' || typeInfo === 'WHA') {
      this.form.get('telefono')?.setValidators([Validators.required]);
    } else if (typeInfo === 'COR' || typeInfo === 'COPRIN') {
      this.form.get('correo')?.setValidators([Validators.required, Validators.email]);
    }

    // Actualizar el estado de validación
    this.form.get('direccion')?.updateValueAndValidity();
    this.form.get('pais')?.updateValueAndValidity();
    this.form.get('departamento')?.updateValueAndValidity();
    this.form.get('ciudad')?.updateValueAndValidity();
    this.form.get('barrio')?.updateValueAndValidity();
    this.form.get('descripcion')?.updateValueAndValidity();
    this.form.get('telefono')?.updateValueAndValidity();
    this.form.get('correo')?.updateValueAndValidity();
  }

  onSubmit() {
    this.formSubmitted = true;
    console.log('Submit ejecutado', this.form.value);

    if (this.form.invalid) {
      console.warn('Formulario inválido', this.form.errors, this.form.value);
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    const mapCodeToName: any = {
      DIR: 'DIRECCIÓN',
      DIRPRIN: 'DIRECCIÓN PRINCIPAL',
      TEL: 'TELÉFONO',
      TELPRIN: 'TELÉFONO PRINCIPAL',
      CEL: 'CELULAR',
      CEPRIN: 'CELULAR PRINCIPAL',
      COR: 'CORREO',
      COPRIN: 'CORREO PRINCIPAL',
      WHA: 'WHATSAPP'
    };

    const typeSelected = this.parametersGlotypes.find(
      t => t.name.toUpperCase() === mapCodeToName[this.form.value.typeInfo]
    );

    const payload: any = {
      personId: this.person.id,
      typeId: typeSelected.id
    };

    switch (this.form.value.typeInfo) {
      case 'DIR':
      case 'DIRPRIN':
        payload.value = this.form.value.direccion.toUpperCase() || '';
        payload.country = this.form.value.pais;
        payload.department = this.form.value.departamento;
        payload.city = this.form.value.ciudad;
        payload.neighborhood = this.form.value.barrio;
        payload.description = this.form.value.descripcion.toUpperCase() || '';
        break;

      case 'TEL':
      case 'TELPRIN':
      case 'CEL':
      case 'CEPRIN':
      case 'WHA':
        payload.value = this.form.value.telefono;
        break;

      case 'COR':
      case 'COPRIN':
        payload.value = this.form.value.correo;
        break;
    }

    const loadingRef = this.modalService.open(LoadingComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: 'sm',
      modalDialogClass: 'modal-loading'
    });

    this.contactInfoService.updateContactInfo(this.contactInfo.id, payload)
      .subscribe({
        next: (res) => {
          loadingRef.close();
          this.successDetails = res.details || 'La información de contacto fue actualizada correctamente';
          const modalRef = this.modalService.open(this.successAlertTpl, {
            centered: true,
            size: 'sm',
            backdrop: 'static'
          });
          modalRef.result.then(
            () => this.activeModal.close(true),
            () => this.activeModal.close(true)
          );
        },
        error: (err) => {
          loadingRef.close();
          this.lastErrorMessage = err?.datils || 'No se pudo actualizar la información de contacto';
          this.modalService.open(this.errorAlertTpl, {
            centered: true,
            size: 'sm',
            backdrop: 'static'
          });
        }
      });
  }

  onSuccessContinue(modal: any) {
    modal.close();
  }

  soloNumeros(event: KeyboardEvent) {
    const char = event.key;
    if (!/^[0-9]$/.test(char) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }
  }
}
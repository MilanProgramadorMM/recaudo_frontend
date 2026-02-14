import { NgClass, NgIf } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZonaResponseDto, ZonaService } from '@core/services/zona.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-zona',
  imports: [ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgClass],
  templateUrl: './create-zona.component.html',
  styleUrl: './create-zona.component.scss'
})
export class CreateZonaComponent {

  @Input() zonaToEdit?: ZonaResponseDto;

  @ViewChild('successalert', { static: true }) successAlertTpl!: TemplateRef<any>;
  @ViewChild('erroralert', { static: true }) errorAlertTpl!: TemplateRef<any>;

  form!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  lastErrorMessage = '';

  get isEditMode(): boolean {
    return !!this.zonaToEdit;
  }

  constructor(
    public activeModal: NgbActiveModal,
    private zonaService: ZonaService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      value: ['', Validators.required],
      description: ['']
    });
    if (this.isEditMode) {
      this.form.patchValue({
        value: this.zonaToEdit?.value,
        description: this.zonaToEdit?.description
      });
    }
  }

  saveZona(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return; // se queda mostrando los errores
    }
    this.loading = true;
    const dto = this.form.getRawValue();

    let request$;
    if (this.isEditMode) {
      request$ = this.zonaService.update(this.zonaToEdit!.id!, dto);
    } else {
      request$ = this.zonaService.create(dto);
    }

    request$.subscribe({
      next: (res) => {
        this.loading = false;
        const modalRef = this.modalService.open(this.successAlertTpl, {
          centered: true,
          size: 'sm',
          backdrop: 'static'
        });

        modalRef.result.then(
          () => this.activeModal.close(res.data),
          () => this.activeModal.close(res.data)
        );
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = this.isEditMode
          ? 'Error al actualizar la zona.'
          : 'Error al crear la zona.';

        this.lastErrorMessage = err?.error?.details || err?.details || null;

        this.modalService.open(this.errorAlertTpl, {
          centered: true,
          size: 'sm'
        });
      }
    });
  }

  onSuccessContinue(alertModalRef: any) {
    alertModalRef.close();
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}

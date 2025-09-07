import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AmortizationDto, AmortizationService } from '@core/services/amortizationType.service';
import { OtherDiscountsDto, OtherDiscountsService } from '@core/services/other-discounts.service';
import { TaxTypeDto, TaxTypeService } from '@core/services/tax-type.service';
import { Observable } from 'rxjs';
import { ServiceQuotaResponseDto, ServiceQuotaService } from '@core/services/service-quota.service';
import { Util } from '@core/helper/utils';

@Component({
  selector: 'app-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  @Input() type!: 'tax_type' | 'amortization_type' | 'other_discounts' | 'service_quota';
  @Input() entityToEdit?: AmortizationDto | TaxTypeDto | OtherDiscountsDto | ServiceQuotaResponseDto;

  submitted = false;
  loading = false;
  errorMessage = '';
  lastErrorMessage: string | null = null;

  @ViewChild('successAlert') successAlertTpl!: TemplateRef<any>;
  @ViewChild('errorAlert') errorAlertTpl!: TemplateRef<any>;

  // Campos base
  code: string = '';
  name: string = '';
  description: string = '';
  procedure: string = '';

  successMessage: string | null = null;
  successDetails: string | null = null;

  get isEditMode(): boolean {
    return !!this.entityToEdit;
  }

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private amortizationService: AmortizationService,
    private taxTypeService: TaxTypeService,
    private otherDiscountsService: OtherDiscountsService,
    private serviceQuotaService: ServiceQuotaService
  ) { }

  ngOnInit(): void {
    // Precargar datos si es edición
    if (this.entityToEdit) {
      this.code = (this.entityToEdit as any).code || '';
      this.name = this.entityToEdit.name;
      this.description = this.entityToEdit.description || '';
      this.procedure = this.entityToEdit.procedure || '';
    }
  }

  save(form: NgForm) {
    this.submitted = true;

    // 🔹 Normalizar todos los campos de texto
    this.code = Util.normalizeText(this.code);
    this.name = Util.normalizeText(this.name);
    this.description = Util.normalizeText(this.description);
    this.procedure = Util.normalizeText(this.procedure);

    if (form.invalid) {
      this.errorMessage = 'Por favor completa los campos obligatorios.';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    this.loading = true;

    let payload: any;
    let request$: Observable<any>;

    if (this.type === 'amortization_type') {
      payload = {
        code: this.code,
        name: this.name,
        description: this.description,
        procedure: this.procedure,
      };

      if (this.isEditMode) {
        request$ = this.amortizationService.edit((this.entityToEdit as AmortizationDto).id!, payload);
      } else {
        request$ = this.amortizationService.create(payload);
      }

    } else if (this.type === 'tax_type') {
      payload = {
        name: this.name,
        description: this.description,
        procedure: this.procedure,
      };

      if (this.isEditMode) {
        request$ = this.taxTypeService.edit((this.entityToEdit as TaxTypeDto).id!, payload);
      } else {
        request$ = this.taxTypeService.create(payload);
      }

    } else if (this.type === 'other_discounts') {
      payload = {
        name: this.name,
        description: this.description,
        procedure: this.procedure,
      };

      if (this.isEditMode) {
        request$ = this.otherDiscountsService.edit((this.entityToEdit as OtherDiscountsDto).id!, payload);
      } else {
        request$ = this.otherDiscountsService.create(payload);
      }
    } else if (this.type === 'service_quota') {
      payload = {
        name: this.name,
        description: this.description,
        procedure: this.procedure,
      };

      if (this.isEditMode) {
        request$ = this.serviceQuotaService.edit((this.entityToEdit as ServiceQuotaResponseDto).id!, payload);
      } else {
        request$ = this.serviceQuotaService.create(payload);
      }
    } else {
      this.loading = false;
      return;
    }

    request$.subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message;
        this.successDetails = res.details;

        const modalRef = this.modalService.open(this.successAlertTpl, {
          centered: true,
          size: 'sm',
          backdrop: 'static',
        });

        modalRef.result.then(
          () => this.activeModal.close(res),
          () => this.activeModal.close(res)
        );
      },
      error: (err) => {
        this.loading = false;
        this.lastErrorMessage =
          err?.error?.details || err?.error?.message || err?.message || 'Error inesperado';

        this.modalService.open(this.errorAlertTpl, {
          centered: true,
          size: 'sm',
        });
      },
    });
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  onSuccessContinue(alertModalRef: any) {
    alertModalRef.close();
  }
}

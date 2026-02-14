import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AmortizationDto, AmortizationService } from '@core/services/amortizationType.service';
import { CreateCreditLineDto, CreditLineDto, CreditLineService } from '@core/services/creditLine.service';
import { TaxTypeDto, TaxTypeService } from '@core/services/tax-type.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form-line',
  imports: [ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgClass,
    CommonModule],
  templateUrl: './form-line.component.html',
  styleUrl: './form-line.component.scss'
})
export class FormLineComponent {
  @Input() lineData: CreditLineDto | null = null;

  form!: FormGroup;
  submitted = false;
  errorMessage = '';
  successDetails: string = '';

  taxTypes: TaxTypeDto[] = [];
  amortizationTypes: AmortizationDto[] = [];

  @ViewChild('successalert', { static: true }) successAlertTpl!: TemplateRef<any>;
  @ViewChild('erroralert', { static: true }) errorAlertTpl!: TemplateRef<any>;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private creditLineService: CreditLineService,
    private taxTypeService: TaxTypeService,
    private amortizationService: AmortizationService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      min_quota: [null, [Validators.required, Validators.min(1)]],
      max_quota: [null, [Validators.required, Validators.min(1)]],
      min_period: [null, [Validators.required, Validators.min(1)]],
      max_period: [null, [Validators.required, Validators.min(1)]],
      tax_type_id: [null, Validators.required],
      amortization_type_id: [null, Validators.required],
      procedure_name: [''],
      life_insurance: [false],
      loan_disbursement: [false],
      portfolio_insurance: [false],
      require_documentation: [false],
    }, {
      validators: [
        this.minQuotaLessThanMaxValidator, this.minPeriodLessThanMaxValidator
      ],
      updateOn: 'change'
    }
    );

    this.loadTaxTypes();
    this.loadAmortizationTypes();
    if (this.lineData) {
      this.loadLineData(this.lineData);
    }
  }
  loadTaxTypes() {
    this.taxTypeService.getAll().subscribe({
      next: (response) => {
        this.taxTypes = response.data ?? [];
      },
      error: () => {
        this.errorMessage = 'Error al cargar tipos de tasa.';
      }
    });
  }

  loadAmortizationTypes() {
    this.amortizationService.getAll().subscribe({
      next: (response) => {
        this.amortizationTypes = response.data ?? [];
      },
      error: () => {
        this.errorMessage = 'Error al cargar tipos de amortización.';
      }
    });
  }


  loadLineData(data: CreditLineDto) {
    this.form.patchValue({
      name: data.name,
      description: data.description,
      min_quota: data.minQuota,
      max_quota: data.maxQuota,
      min_period: data.minPeriod,
      max_period: data.maxPeriod,
      tax_type_id: data.taxType,
      amortization_type_id: data.amortizationType,
      procedure_name: data.procedureName,
      life_insurance: data.lifeInsurance,
      portfolio_insurance: data.portfolioInsurance,
      loan_disbursement: data.loanDisbursement,
      require_documentation: data.requireDocumentation
    });
  }

  saveLine() {
    this.submitted = true;

    if (this.form.invalid) {
      this.errorMessage = 'Por favor completa los campos obligatorios.';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    const formValues = this.form.value;
    const line: CreateCreditLineDto = {
      ...formValues
    };

    let action: Observable<any>;

    if (this.lineData?.id) {
      action = this.creditLineService.update(this.lineData.id, line);
    } else {
      action = this.creditLineService.register(line);
    }

    action.subscribe({
      next: (response) => {
        this.successDetails = response.details;
        const modalRef = this.modalService.open(this.successAlertTpl, {
          centered: true,
          size: 'sm',
          backdrop: 'static'
        });
        modalRef.result.then(
          () => this.activeModal.close(response.data),
          () => this.activeModal.close(response.data)
        );
      },
      error: () => {
        this.errorMessage = 'Error al guardar la línea de crédito.';
        this.modalService.open(this.errorAlertTpl, {
          centered: true,
          size: 'sm'
        });
      }
    });
  }


  validateNumberInput(event: KeyboardEvent) {
    if (['e', 'E', '+', '-', '.'].includes(event.key)) {
      event.preventDefault();
    }
  }

  minQuotaLessThanMaxValidator(formGroup: AbstractControl): ValidationErrors | null {
    const min = formGroup.get('min_quota')?.value;
    const max = formGroup.get('max_quota')?.value;
    if (min !== null && max !== null && min >= max) {
      return { quotaInvalid: 'La cuota máxima debe ser mayor que la mínima.' };
    }
    return null;
  }

  minPeriodLessThanMaxValidator(formGroup: AbstractControl): ValidationErrors | null {
    const min = formGroup.get('min_period')?.value;
    const max = formGroup.get('max_period')?.value;
    if (min !== null && max !== null && min >= max) {
      return { periodInvalid: 'El periodo máximo debe ser mayor que el mínimo.' };
    }
    return null;
  }



  cancel() {
    this.activeModal.dismiss();
  }

  onSuccessContinue(alertModalRef: any) {
    alertModalRef.close();
  }
}

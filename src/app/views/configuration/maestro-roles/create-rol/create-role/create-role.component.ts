import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleService } from '@core/services/role.service';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-create-role',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.scss'
})
export class CreateRoleComponent implements OnInit {

  @ViewChild('successalert', { static: true }) successAlertTpl!: TemplateRef<any>;
  @ViewChild('erroralert', { static: true }) errorAlertTpl!: TemplateRef<any>;

  form!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  lastErrorMessage = '';

  constructor(
    public activeModal: NgbActiveModal,
    private roleService: RoleService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required], 
      description: ['']                
    });
  }

  saveRole(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.errorMessage = 'Por favor completa los campos obligatorios.';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    this.loading = true;
    const dto = this.form.getRawValue();

    this.roleService.createRole(dto).subscribe({
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
        this.errorMessage = 'Error al crear el rol.';
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

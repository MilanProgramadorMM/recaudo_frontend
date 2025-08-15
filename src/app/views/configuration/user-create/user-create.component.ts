import { Component, ViewChild, ChangeDetectorRef, type OnInit } from '@angular/core';
import { CdkStepperModule, CdkStepper } from '@angular/cdk/stepper'
import { NgStepperComponent, NgStepperModule } from 'angular-ng-stepper'
import { NgbActiveModal, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule, ReactiveFormsModule, Validators, FormBuilder, type UntypedFormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoleDto, RoleService } from '@core/services/role.service';
import { UserService } from '@core/services/user.service';


@Component({
  selector: 'add-users',
  standalone: true,
  imports: [FormsModule, CdkStepperModule, // <-- esto es necesario para usar <cdk-step> y <ng-stepper>
    NgbProgressbarModule, NgStepperModule, ReactiveFormsModule, CommonModule],
  templateUrl: './user-create.component.html',
  styles: ``
})
export class UserCreateComponent {
  myForm!: UntypedFormGroup
  profileForm!: UntypedFormGroup
  submit = false
  roles: RoleDto[] = [];
  selectedRoles: number[] = [];
  submitSuccess: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';



  @ViewChild('stepper') stepper!: NgStepperComponent
  @ViewChild('cdkSteppers') cdkSteppers!: CdkStepper
  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    public activeModal: NgbActiveModal,
    private roleService: RoleService,
    private userService: UserService,



  ) { }
  ngOnInit(): void {
    this.fetchRoles();

    this.myForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repassword: ['', [Validators.required]],
    }, {
      validators: [this.passwordMatchValidator]
    });
  }

  passwordMatchValidator(formGroup: UntypedFormGroup) {
    const password = formGroup.get('password')?.value;
    const repassword = formGroup.get('repassword')?.value;

    if (password !== repassword) {
      formGroup.get('repassword')?.setErrors({ mismatch: true });
    } else {
      const errors = formGroup.get('repassword')?.errors;
      if (errors) {
        delete errors['mismatch'];
        if (Object.keys(errors).length === 0) {
          formGroup.get('repassword')?.setErrors(null);
        } else {
          formGroup.get('repassword')?.setErrors(errors);
        }
      }
    }

    return null;
  }



  ngAfterViewInit() {
    this.updateProgressBarWidth()
  }

  isSelected(roleId: number): boolean {
    return this.selectedRoles.includes(roleId);
  }



  updateProgressBarWidth() {
    if (this.cdkSteppers) {
      const selectedIndex = this.cdkSteppers.selectedIndex || 0
      const stepsLength = this.cdkSteppers.steps.length || 1
      const width = ((selectedIndex + 1) / stepsLength) * 100 + '%'
      const progressBar = document.querySelector('.wizardprogress')
      if (progressBar) {
        ; (progressBar as HTMLElement).style.width = width
      }
      this.cdr.detectChanges()
    }
  }

  fetchRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (response) => {
        this.roles = response.data;
      },
      error: (error) => {
        console.error('Error al obtener users', error);
      }
    });
  }

  get form() {
    return this.myForm.controls
  }

  get secondform() {
    return this.profileForm.controls
  }

  close(): void {
    this.activeModal.dismiss();
  }

  // next step
  nextStep(id: number) {
    this.submit = true
    if (id == 1) {
      if (this.myForm.valid) {
        this.stepper.next()
      }
    } else {
      if (this.profileForm.valid) {
        this.stepper.next()
      }
    }
  }
  onToggleRole(roleId: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedRoles.includes(roleId)) {
        this.selectedRoles.push(roleId);
      }
    } else {
      this.selectedRoles = this.selectedRoles.filter(id => id !== roleId);
    }
  }

  submitUser() {
    this.submit = true;

    if (this.myForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    const userPayload = {
      username: this.myForm.value.userName,
      password: this.myForm.value.password,
      roles: this.selectedRoles
    };

    this.userService.createUser(userPayload).subscribe({
      next: (response) => {
        this.submitSuccess = true;
        this.successMessage = '¡Usuario creado correctamente!';
        this.stepper.next();
        setTimeout(() => {
          this.activeModal.close({ success: true });
        }, 5000);
      },
      error: (error) => {
        this.submitSuccess = false;
        this.errorMessage = 'Ocurrió un error al guardar el usuario.';
        this.stepper.next();
      }
    });
  }

}

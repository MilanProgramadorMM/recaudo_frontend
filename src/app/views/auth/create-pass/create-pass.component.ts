import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '@core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'create-pass',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-pass.component.html',
  styles: ``
})
export class CreatePassComponent {
  form!: FormGroup;
  submitted = false;
  errorMessage = '';

  showPasswordActual = false;
  showNewPassword = false;
  showConfirmPassword = false;

  @ViewChild('passwordChanged') passwordChangedTpl!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    public activeModal: NgbActiveModal,
    private authService: AuthenticationService,
    private modalService: NgbModal
  ) {
    this.form = this.fb.group({
      passwordActual: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });
  }

  // Custom validator para confirmar contraseñas
  private passwordsMatchValidator(group: FormGroup) {
    const newPass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return newPass === confirm ? null : { notMatching: true };
  }

  changePassword() {
    this.submitted = true;
    if (this.form.invalid) return;

    const { passwordActual, newPassword } = this.form.value;

    this.userService.updateLoggedUserPassword(passwordActual, newPassword).subscribe({
      next: () => {
        this.modalService.open(this.passwordChangedTpl, { centered: true, backdrop: 'static', keyboard: false });
      },
      error: (err) => {
        this.errorMessage = err.error?.details || 'Error al cambiar la contraseña';
      }
    });
  }

  onConfirmPasswordChange(modal: any) {
    modal.close();
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '@core/services/auth.service';

@Component({
  selector: 'create-pass',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-pass.component.html',
  styles: ``
})
export class CreatePassComponent {
  passwordActual = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';
  @ViewChild('passwordChanged') passwordChangedTpl!: TemplateRef<any>;


  constructor(
    private userService: UserService,
    private router: Router,
    public activeModal: NgbActiveModal,
    private AuthService: AuthenticationService,
    private modalService: NgbModal


  ) { }


  changePassword() {
    if (!this.passwordActual || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    if (this.newPassword.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.userService.updateLoggedUserPassword(this.passwordActual, this.newPassword).subscribe({
      next: () => {
        // Abrir modal de confirmación en lugar de cerrar directo
        this.modalService.open(this.passwordChangedTpl, { centered: true, backdrop: 'static', keyboard: false });
      },
      error: (err) => {
        this.errorMessage = err.error?.details || 'Error al cambiar la contraseña';
      }
    });
  }

  onConfirmPasswordChange(modal: any) {
    modal.close();
    this.AuthService.logout();
    this.router.navigate(['/auth/login']);
  }
}





import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '@core/services/auth.service';

@Component({
  selector: 'create-pass',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-pass.component.html',
  styles: ``
})
export class CreatePassComponent {
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';

  constructor(
    private userService: UserService,
    private router: Router,
    public activeModal: NgbActiveModal,
    private AuthService: AuthenticationService

  ) { }
  

  changePassword() {
    if (this.newPassword.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.userService.updateLoggedUserPassword(this.newPassword).subscribe({
      next: () => {
        this.activeModal.close();
        this.AuthService.logout(); // o el método que tengas para cerrar sesión
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al cambiar la contraseña';
      }
    });
  }
}



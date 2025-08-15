import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators, type UntypedFormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { loginSuccess, loginFailure } from '@/store/authentication/authentication.actions';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '@core/services/auth.service';
import { login } from '@/store/authentication/authentication.actions';
import { RouterLink } from '@angular/router';
import { currentYear } from '@common/constants';
import { NgClass, NgIf } from "@angular/common";
import { getError } from "@/store/authentication/authentication.selector";
import { take } from 'rxjs';
import { AlertType } from '@views/ui/alerts/data';

@Component({
  selector: 'login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, NgClass, NgIf, CommonModule],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {

  currentYear = currentYear
  signInForm!: UntypedFormGroup;
  loading = false;
  errorMessage: string = ''

  alertData: AlertType[] = [];


  constructor(
    // ...
    private actions$: Actions
  ) { }

  showSuccessAlert() {
    this.alertData.push({
      variant: 'success',
      icon: 'check-circle',
      message: 'Login successful!'
    });
    setTimeout(() => this.alertData = [], 4000); // Auto-hide after 3 seconds
  }
  showErrorAlert() {
    this.alertData.push({
      variant: 'danger',
      icon: 'exclamation-triangle',
      message: this.errorMessage || 'Login failed. Please try again.'
    });
    setTimeout(() => this.alertData = [], 4000); // Auto-hide after 3 seconds
  }


  public fb = inject(UntypedFormBuilder)
  public store = inject(Store)
  public service = inject(AuthenticationService)

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  get formValues() {
    return this.signInForm.controls
  }

  login() {
  if (!this.signInForm.valid) return;

  const username = this.formValues['username'].value;
  const password = this.formValues['password'].value;

  this.loading = true;
  this.store.dispatch(login({ username, password }));

  // Manejar éxito
  this.actions$.pipe(ofType(loginSuccess), take(1)).subscribe(() => {
    this.loading = false;
    this.showSuccessAlert();
  });

  // Manejar error
  this.actions$.pipe(ofType(loginFailure), take(1)).subscribe(({ error }) => {
    this.loading = false;
    this.errorMessage = error;
    this.showErrorAlert();
  });
}


}

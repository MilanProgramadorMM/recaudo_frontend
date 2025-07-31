import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators, type UntypedFormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthenticationService } from '@core/services/auth.service';
import { login } from '@/store/authentication/authentication.actions';
import { RouterLink } from '@angular/router';
import { currentYear } from '@common/constants';
import { NgClass, NgIf } from "@angular/common";
import { getError } from "@/store/authentication/authentication.selector";

@Component({
  selector: 'login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, NgClass, NgIf],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {

  currentYear = currentYear
  signInForm!: UntypedFormGroup;
  submitted: boolean = false

  errorMessage: string = ''

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
    this.submitted = true
    if (this.signInForm.valid) {
      const username = this.formValues['username'].value // Get the username from the form
      const password = this.formValues['password'].value // Get the password from the form

      // Login Api
      this.store.dispatch(login({ username: username, password: password }))

      this.store.select(getError).subscribe((error) => {
        if (error) {
          this.errorMessage = error; 
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }

}

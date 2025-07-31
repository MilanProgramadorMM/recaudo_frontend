import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-auth-logo',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
   <a routerLink="/" class="auth-brand mb-3">
    <img src="assets/images/logo-dark.png" alt="dark logo" height="24" class="logo-dark">
    <img src="assets/images/logo.png" alt="logo light" height="24" class="logo-light">
  </a>`,
})

export class AuthLogoComponent {

}

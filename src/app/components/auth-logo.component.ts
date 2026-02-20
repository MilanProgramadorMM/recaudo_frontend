import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-auth-logo',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
   <a routerLink="/" class="auth-brand mb-3">
    <img src="assets/images/logo-credisabe.png" alt="dark logo" height="100" class="logo-dark">
    <img src="assets/images/logo-credisabe.png" alt="logo light" height="24" class="logo-light">
  </a>`,
})

export class AuthLogoComponent {

}

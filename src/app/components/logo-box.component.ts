import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-logo-box',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <a routerLink="/" class="logo">
    <span class="logo-light">
      <span class="logo-lg"><img src="assets/images/logo.png" alt="logo"></span>
      <span class="logo-sm"><img src="assets/images/logo-sm.png" alt="small logo"></span>
    </span>

    <span class="logo-dark">
      <span class="logo-lg"><img src="assets/images/logo-dark.png" alt="dark logo"></span>
      <span class="logo-sm"><img src="assets/images/logo-sm.png" alt="small logo"></span>
    </span>
  </a>`,
})

export class LogoBoxComponent {

}

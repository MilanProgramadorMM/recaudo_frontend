import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-logo-box',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <a routerLink="/" class="logo">
    <span class="logo-light" style="justify-content: center; display: flex; align-items: center; padding: 10px;">
      <span class="logo-lg"><img src="assets/images/logo-horizontal.png" alt="logo" style="height: 80px; width: auto"></span>
      <span class="logo-sm"><img src="assets/images/logo-horizontal.png" alt="small logo"></span>
    </span>

    <span class="logo-dark">
      <span class="logo-lg"><img src="assets/images/logo-horizontal.png" alt="dark logo"></span>
      <span class="logo-sm"><img src="assets/images/logo-horizontal.png" alt="small logo"></span>
    </span>
  </a>`,
})

export class LogoBoxComponent {

}

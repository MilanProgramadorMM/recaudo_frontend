import { Component, inject, Renderer2, type OnDestroy, type OnInit } from '@angular/core';
import { AuthLogoComponent } from "../../../components/auth-logo.component";

@Component({
  selector: 'maintenance',
  standalone: true,
  imports: [ AuthLogoComponent],
  templateUrl: './maintenance.component.html',
  styles: ``
})
export class MaintenanceComponent implements OnInit, OnDestroy {
  private renderer = inject(Renderer2)

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'h-100')
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'h-100')
  }
}

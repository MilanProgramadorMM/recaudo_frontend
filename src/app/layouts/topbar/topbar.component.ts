import { changetheme } from '@/store/layout/layout-action';
import type { LayoutState } from '@/store/layout/layout-reducers';
import { getLayoutColor } from '@/store/layout/layout-selector';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Output, type OnInit, type TemplateRef } from '@angular/core';
import { Router, RouterLink  } from '@angular/router';
import { NgbDropdownModule, NgbModal, NgbModalModule, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { appData, languages } from './data';
import { SimplebarAngularModule } from 'simplebar-angular';
import { splitArray } from '@core/helper/utils';
import { currency } from '@common/constants';
import { logout } from '@/store/authentication/authentication.actions';
import { User } from '@core/helper/fake-backend';
import { AuthenticationService } from '@core/services/auth.service';
import { CreatePassComponent } from '@views/auth/create-pass/create-pass.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [NgbOffcanvasModule, NgbDropdownModule, SimplebarAngularModule, NgbModalModule],
  templateUrl: './topbar.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: ``
})
export class TopbarComponent implements OnInit {

  currency = currency
  user: User | null = null; // Añade esta propiedad


  constructor(
    private authService: AuthenticationService,
  ) { }
  languageList = languages
  appsChunks = splitArray(appData, 3);

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();


  private modalService = inject(NgbModal);

  router = inject(Router);
  store = inject(Store);

  color!: string;

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { size: "lg" })
  }

  ngOnInit(): void {
    this.store.select('layout').subscribe((data: LayoutState) => {
      this.color = data.LAYOUT_THEME;
      this.user = this.authService.loggedUser;
    });
  }

  settingMenu() {
    this.settingsButtonClicked.emit();
  }

  toggleMobileMenu() {
    this.mobileMenuButtonClicked.emit();
  }


  changeTheme() {
    const color = document.documentElement.getAttribute('data-bs-theme');
    if (color == 'light') {
      this.store.dispatch(changetheme({ color: 'dark' }));
    } else {
      this.store.dispatch(changetheme({ color: 'light' }));
    }
    this.store.select(getLayoutColor).subscribe((color) => {
      document.documentElement.setAttribute('data-bs-theme', color);
    });
  }

  logout() {
    this.store.dispatch(logout());
    //this.router.navigate(['/auth/login']); // Redirige a la página de inicio de sesión
  }

  openChangePasswordModal() {
    const modalRef = this.modalService.open(CreatePassComponent);
    modalRef.componentInstance.user = this.user; // Pasa el usuario al componente del modal
  }


}

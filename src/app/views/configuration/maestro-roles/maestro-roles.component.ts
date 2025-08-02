import { Component, Input } from '@angular/core';
import { NgbModal, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleComponent } from "@components/page-title.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoleDto, RoleService } from '@core/services/role.service';
import { UserConfigPermisionsComponent } from '../user-config-permisions/user-config-permisions.component';

@Component({
  selector: 'app-maestro-roles',
  imports: [
    PageTitleComponent,
    NgbPaginationModule,
    NgbModalModule,
    FormsModule,
    CommonModule,
  ], templateUrl: './maestro-roles.component.html',
  styleUrl: './maestro-roles.component.scss'
})
export class MaestroRolesComponent {

  roles: RoleDto[] = [];
  filteredRoles: RoleDto[] = [];
  searchTerm: string = '';
  page = 1;
  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  constructor(
    private modalService: NgbModal,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.fetchRoles();
  }

  fetchRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (response) => {
        this.roles = response.data;
        this.filteredRoles = [...this.roles];
      },
      error: (error) => {
        console.error('Error al obtener users', error);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredRoles = this.roles.filter(roles =>
    ((
      String(roles.rol).toLowerCase().includes(term)
    )));
  }

  openPermissionsModal(roleId: number): void {
    const modalRef = this.modalService.open(UserConfigPermisionsComponent, {
      size: 'xl',
      centered: true,
      scrollable: true
    });
    modalRef.componentInstance.id = roleId;
    modalRef.componentInstance.type = 'ROLES';

  }
}

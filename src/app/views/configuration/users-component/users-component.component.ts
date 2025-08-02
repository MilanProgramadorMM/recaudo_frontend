import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '@components/page-title.component';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { UserDto, UserService } from '@core/services/user.service';
import { UserConfigPermisionsComponent } from '../user-config-permisions/user-config-permisions.component';
import { MaestroRolesComponent } from '../maestro-roles/maestro-roles.component';
import { UserAssignRolComponent } from '../user-assign-rol/user-assign-rol.component';


@Component({
  selector: 'app-users-component',
  imports: [
    PageTitleComponent,
    NgbPaginationModule,
    NgbModalModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './users-component.component.html',
  styleUrl: './users-component.component.scss'
})
export class UsersComponentComponent {
  users: UserDto[] = [];
  filteredUsers: UserDto[] = [];
  searchTerm: string = '';
  page = 1;


  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }


  constructor(private modalService: NgbModal, private userService: UserService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.data;
        this.filteredUsers = [...this.users];
      },
      error: (error) => {
        console.error('Error al obtener users', error);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
    ((
      String(user.person_fullname).toLowerCase().includes(term) ||
      String(user.rol?.rol).toLowerCase().includes(term) ||
      String(user.username).toLowerCase().includes(term)
    )
    )
    );
  }

  openPermissionsModal(user: any): void {
    if (!user.rol || !user.rol.id) {
      console.error('Este usuario no tiene un rol asignado.');
      return;
    }
    const modalRef = this.modalService.open(UserConfigPermisionsComponent, {
      size: 'xl',          // ancho extra grande
      centered: true,      // centrado vertical
      scrollable: true     // permite scroll interno si el contenido excede
    });
    modalRef.componentInstance.id = user.id;
    modalRef.componentInstance.type = 'USERS';
    modalRef.componentInstance.nombreUsuario = user.person_fullname; // <-- Aquí lo pasas

  }

  openRoleUpdateModal(user: any): void {
    if (!user.rol || !user.rol.id) {
      console.error('Este usuario no tiene un rol asignado.');
      return;
    }
    const modalRef = this.modalService.open(UserAssignRolComponent, {
      size: 'xl',
      centered: true,
      scrollable: true
    });
    modalRef.componentInstance.userId = user.id;
    modalRef.closed.subscribe(() => {
      this.fetchUsers(); // vuelve a cargar la lista de usuarios
    });
  }


}

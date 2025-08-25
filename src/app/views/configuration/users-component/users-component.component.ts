import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '@components/page-title.component';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { UserDto, UserRegisterDto, UserService } from '@core/services/user.service';
import { UserConfigPermisionsComponent } from '../user-config-permisions/user-config-permisions.component';
import { UserAssignRolComponent } from '../user-assign-rol/user-assign-rol.component';
import { UserCreateComponent } from '../user-create/user-create.component';


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
  //userCreate: UserRegisterDto = [];
  filteredUsers: UserDto[] = [];
  searchTerm: string = '';
  page = 1;
  loadingUpdateRoles = false; 


  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }


  constructor(
    private modalService: NgbModal,
    private userService: UserService  ) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  //LLAMADA AL MODAL PARA CREAR UN USUARIO
  openUserModal(user?: UserRegisterDto) {
      const modalRef = this.modalService.open(UserCreateComponent, {
        centered: true,
        backdrop: 'static',
        windowClass: 'custom-modal-size modal-lg'
      });
  
      if (user) {
        modalRef.componentInstance.userData = user;
      }
  
      modalRef.result.then(() => {
        this.fetchUsers(); // Se refresca lista después de editar
      }).catch(() => { });
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
    /*if (!user.rol || !user.rol.id) {
      console.error('Este usuario no tiene un rol asignado.');
      return;
    }
      */
    const modalRef = this.modalService.open(UserConfigPermisionsComponent, {
      size: 'xl',          // ancho extra grande
      centered: true,      // centrado vertical
      scrollable: true     // permite scroll interno si el contenido excede
    });
    modalRef.componentInstance.id = user.id;
    modalRef.componentInstance.type = 'USERS';
    modalRef.componentInstance.nombreUsuario = user.person_fullname; 

  }

  openRoleUpdateModal(user: any): void {
  const modalRef = this.modalService.open(UserAssignRolComponent, {
    size: 'xl',
    centered: true,
    scrollable: true
  });
  modalRef.componentInstance.userId = user.id;

  // Usar promise result para capturar el payload del close()
  modalRef.result.then((result: any) => {
    console.log('[UsersComponent] modal closed with result:', result);

    if (result?.success) {
      const roleIds: number[] = result.selectedRoleIds ?? [];
      console.log('[UsersComponent] calling updateUserRoles', user.id, roleIds);

      this.loadingUpdateRoles = true;
      this.userService.updateUserRoles(user.id, roleIds).subscribe({
        next: (res) => {
          this.loadingUpdateRoles = false;
          console.log('[UsersComponent] updateUserRoles success', res);
          this.fetchUsers();
        },
        error: (err) => {
          this.loadingUpdateRoles = false;
          console.error('[UsersComponent] updateUserRoles error', err);
        }
      });
    } else {
      console.log('[UsersComponent] modal closed without success flag');
    }
  }).catch((reason) => {
    // dismiss (esc, backdrop click o activeModal.dismiss())
    console.log('[UsersComponent] modal dismissed:', reason);
  });
}


}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserPermissionDto, UserService } from '@core/services/user.service';
import { RolePermissionDto, RoleService } from '@core/services/role.service';

@Component({
  selector: 'app-user-config-permisions',
  imports: [CommonModule],
  templateUrl: './user-config-permisions.component.html',
  styleUrl: './user-config-permisions.component.scss'
})
export class UserConfigPermisionsComponent {

  @Input() id!: number;
  @Input() type!: String;
  @Input() nombreUsuario!: string;

  permissionsUser: UserPermissionDto[] = [];
  permissionsRole: RolePermissionDto[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService,
    private roleService: RoleService,
  ) { }

  ngOnInit(): void {
    if (!this.id) {
      console.error('No se recibió id de rol o usuario');
      return;
    }

    if (this.type === 'USERS') {
      this.userService.getUserPermissions(this.id).subscribe({
        next: (data) => this.permissionsUser = data,
        error: (err) => console.error('Error al obtener permisos', err)
      });
    } else if (this.type === 'ROLES') {
      this.roleService.getRolePermissions(this.id).subscribe({
        next: (data) => this.permissionsRole = data,
        error: (err) => console.error('Error al obtener permisos', err)
      });
    } else {
      console.error('Tipo no reconocido:', this.type);
    }
  }

  onTogglePermission(permiso: UserPermissionDto | RolePermissionDto): void {
    const updatedValue = !permiso.permiso;

    if (this.type === 'USERS') {
      this.userService.updateUserPermission(permiso.id, updatedValue).subscribe({
        next: () => {
          permiso.permiso = updatedValue;
        },
        error: (err) => {
          console.error('Error actualizando permiso de usuario', err);
          // opcional: revertir el valor si falla
        }
      });
    } else if (this.type === 'ROLES') {
      this.roleService.updateRolePermission(permiso.id, updatedValue).subscribe({
        next: () => {
          permiso.permiso = updatedValue;
        },
        error: (err) => {
          console.error('Error actualizando permiso de rol', err);
          // opcional: revertir el valor si falla
        }
      });
    }
  }


  close(): void {
    this.activeModal.dismiss();
  }
}
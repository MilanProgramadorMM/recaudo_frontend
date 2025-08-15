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
      const body = {
        userId: this.id,
        actionId: permiso.actionId,
        moduleId: permiso.moduleId,
        permiso: updatedValue
      };

      this.userService.updateUserPermission(body).subscribe({
        next: () => {
          permiso.permiso = updatedValue;
        },
        error: (err) => {
          console.error('Error actualizando permiso de usuario', err);
          // opcional: revertir si falla
        }
      });
    } else if (this.type === 'ROLES') {


      const body = {
        rolId: this.id,
        moduleId: permiso.moduleId,
        actionId: permiso.actionId,
        permiso: updatedValue
      };

      this.roleService.updateRolePermission(body).subscribe({
        next: () => {
          permiso.permiso = updatedValue;
        },
          error: (err) => {
          console.error('Error actualizando permiso de rol', err);
          // opcional: revertir si falla
        }
      });
    }
  }



  close(): void {
    this.activeModal.dismiss();
  }
}
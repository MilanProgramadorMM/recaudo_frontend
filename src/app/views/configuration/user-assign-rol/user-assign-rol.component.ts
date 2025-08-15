import { Component, Input, OnInit } from '@angular/core';
import { RoleDto } from '@core/services/role.service';
import { UserService } from '@core/services/user.service';
import { RoleService } from '@core/services/role.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-assign-rol',
  templateUrl: './user-assign-rol.component.html',
  imports: [CommonModule],
  styleUrls: ['./user-assign-rol.component.scss']
})
export class UserAssignRolComponent implements OnInit {
  @Input() userId!: number;

  roles: RoleDto[] = [];
  // Array local con los ids seleccionados visualmente
  selectedRoleIds: number[] = [];
  nombreUsuario: string = '';

  constructor(
    private roleService: RoleService,
    private userService: UserService,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.fetchRoles();
    this.fetchUserRole();
  }

  fetchRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (response) => {
        this.roles = response.data;
      },
      error: (error) => console.error('Error al obtener roles', error)
    });
  }

  fetchUserRole() {
    this.userService.getUserById(this.userId).subscribe({
      next: (response) => {
        const user = response.data;
        if (Array.isArray(user?.rol)) {
          this.selectedRoleIds = user.rol.map((r: any) => r.id);
        } else if (user?.rol) {
          this.selectedRoleIds = [user.rol.id];
        } else {
          this.selectedRoleIds = [];
        }

        this.nombreUsuario = `${user.person_fullname}`;

      },
      error: (error) => {
        console.error('Error al obtener rol actual', error);
        this.selectedRoleIds = [];
      }
    });
  }

  isSelected(roleId: number): boolean {
    return this.selectedRoleIds.includes(roleId);
  }

  onToggleRole(roleId: number, checked: boolean) {
    if (checked) {
      if (!this.selectedRoleIds.includes(roleId)) {
        this.selectedRoleIds.push(roleId);
      }
    } else {
      this.selectedRoleIds = this.selectedRoleIds.filter(id => id !== roleId);
    }
  }

  save() {
    console.log('[UserAssignRol] save() - selectedRoleIds =', this.selectedRoleIds);
    this.activeModal.close({ success: true, selectedRoleIds: this.selectedRoleIds });
  }

  close(): void {
    this.activeModal.dismiss();
  }
}

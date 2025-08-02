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
  selectedRoleId: number | null = null;
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
      this.selectedRoleId = user?.rol?.id || null;
      this.nombreUsuario = `${user.person_fullname}`; // Ajusta si tu modelo difiere
    },
    error: (error) => console.error('Error al obtener rol actual', error)
  });
}


  onToggleRole(roleId: number) {
    if (this.selectedRoleId === roleId) return;

    // 🔥 Cambia el rol seleccionado inmediatamente
    this.selectedRoleId = roleId;

    this.userService.assignUserRole(this.userId, roleId).subscribe({
      next: () => {
        // Ya se actualizó visualmente
      },
      error: (err) => {
        console.error('Error al asignar rol', err);
        // ⚠️ Podrías revertir visualmente si falla
        this.fetchUserRole(); // Opcional: restaurar estado anterior
      }
    });
  }

  close(): void {
    this.activeModal.dismiss();
  }

}

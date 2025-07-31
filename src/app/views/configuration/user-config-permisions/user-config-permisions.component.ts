import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { treatmentData } from '@views/hospital/patient-details/data';
import { PermissionDto, UserService } from '@core/services/user.service';

@Component({
  selector: 'app-user-config-permisions',
  imports: [CommonModule],
  templateUrl: './user-config-permisions.component.html',
  styleUrl: './user-config-permisions.component.scss'
})
export class UserConfigPermisionsComponent {
  treatmentHistoryData = treatmentData

  @Input() roleId!: number;
  permissions: PermissionDto[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    if (!this.roleId) {
      console.error('No se recibió un roleId');
      return;
    }

    this.userService.getPermissionsByRole(this.roleId).subscribe({
      next: (data) => this.permissions = data,
      error: (err) => console.error('Error al obtener permisos', err)
    });
  }

  onTogglePermission(permiso: PermissionDto) {
  const nuevoEstado = !permiso.permiso;
  this.userService.updatePermission(permiso.id, nuevoEstado).subscribe({
    next: () => permiso.permiso = nuevoEstado,
    error: (err) => {
      console.error('Error actualizando permiso', err);
    }
  });
}


  close(): void {
    this.activeModal.dismiss();
  }
}
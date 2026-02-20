import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageTitleComponent } from '@components/page-title.component';
import { AuthenticationService } from '@core/services/auth.service';
import { ClosingService, ClosingResponseDto } from '@core/services/closing.service';
import { ClosingStatusService } from '@core/services/closingStatus.service';

interface ClosingWithStatus extends ClosingResponseDto {
  closingStatus?: string;
  canEdit?: boolean;
}
@Component({
  selector: 'app-list-closing-asesor',
  imports: [CommonModule, PageTitleComponent],
  templateUrl: './list-closing-asesor.component.html',
  styleUrl: './list-closing-asesor.component.scss'
})
export class ListClosingAsesorComponent {

  closings: ClosingWithStatus[] = [];
  loading = false;
  personId: number | null = null;
  lastUpdate: Date | null = null;


  private pollingSubscription?: Subscription;

  constructor(
    private authService: AuthenticationService,
    private closingService: ClosingService,
    private closingStatusService: ClosingStatusService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.personId = this.authService.getUserId();

    if (!this.personId) {
      console.error('No se pudo obtener el ID del usuario');
      return;
    }

    this.loadClosings();
  }

  loadClosings(): void {
    if (!this.personId) return;

    this.loading = true;
    this.closingService.getClosingsByPerson(this.personId).subscribe({
      next: (response) => {
        this.closings = response.data || [];
        this.lastUpdate = new Date();
        this.loading = false;

        console.log('Cierres cargados:', this.closings);
      },
      error: (error) => {
        console.error('Error al cargar cierres:', error);
        this.loading = false;
      }
    });
  }

  refreshClosings(): void {
    this.loadClosings();
  }

  canEditClosing(closing: ClosingResponseDto): boolean {
    return (
      closing.closingStatus === 'PRE_CIERRE' &&
      closing.amount !== null &&
      closing.amount !== undefined &&
      closing.amount >= 0  
    );
  }

  goToClosing(closingId: number): void {
    this.router.navigate(['/configuration/closing', closingId]);
  }

  viewClosing(closingId: number): void {
    this.router.navigate(['/configuration/closing', closingId]);
  }

  // Métodos de conteo
  getPendingCount(): number {
    return this.closings.filter(c => c.closingStatus === 'PRE_CIERRE').length;
  }

  getStudyCount(): number {
    return this.closings.filter(c => c.closingStatus === 'STUDY').length;
  }

  getApprovedCount(): number {
    return this.closings.filter(c => c.closingStatus === 'APPROVED').length;
  }

  getRejectedCount(): number {
    return this.closings.filter(c => c.closingStatus === 'REJECTED').length;
  }

  hasPendingClosings(): boolean {
    return this.getPendingCount() > 0;
  }

  // Utilidades de UI
  getStatusBadgeClass(status?: string): string {
    switch (status) {
      case 'PRE_CIERRE':
        return 'badge bg-warning text-dark';
      case 'STUDY':
        return 'badge bg-info';
      case 'PRE_APPROVED':
        return 'badge bg-success';
      case 'APPROVED':
        return 'badge bg-success';
      case 'REJECTED':
        return 'badge  bg-danger-custom';
      default:
        return 'badge bg-secondary';
    }
  }

  getActionButtonText(closing: ClosingResponseDto): string {
    if (this.canEditClosing(closing)) {
      return 'Completar';
    }

    if (closing.closingStatus === 'PRE_CIERRE' &&
      (closing.amount === null || closing.amount === undefined || closing.amount === 0)) {
      return 'Esperando BASE'; 
    }

    if (this.canEditClosing(closing)) {
      return 'Completar';
    }
    switch (closing.closingStatus) {
      case 'STUDY':
      case 'PRE_APPROVED':
        return 'Ver Estado';
      case 'APPROVED':
      case 'REJECTED':
        return 'Ver Detalles';
      default:
        return 'Ver';
    }
  }

  getStatusText(status?: string): string {
    switch (status) {
      case 'PRE_CIERRE':
        return 'Pendiente';
      case 'STUDY':
        return 'En Estudio';
      case 'PRE_APPROVED':
        return 'Pre-Aprobado';
      case 'APPROVED':
        return 'Aprobado';
      case 'REJECTED':
        return 'Rechazado';
      default:
        return 'Desconocido';
    }
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
}

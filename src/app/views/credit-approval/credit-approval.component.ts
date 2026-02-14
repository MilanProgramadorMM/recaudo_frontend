// credit-approval.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditIntentionService, PublicCreditIntentionResponse } from '@core/services/creditIntention.service';
import { SendLinkService } from '@core/services/sendLink.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-credit-approval',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credit-approval.component.html',
  styleUrl: './credit-approval.component.scss'
})
export class CreditApprovalComponent implements OnInit {
  token: string = '';
  creditIntention: PublicCreditIntentionResponse | null = null;
  loading: boolean = true;
  error: string = '';
  processing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sendLinkService: SendLinkService,
    private creditIntentionService: CreditIntentionService
  ) { }

  ngOnInit(): void {
    // Obtener token de la URL
    this.token = this.route.snapshot.paramMap.get('token') || '';

    if (!this.token) {
      this.error = 'Token inválido';
      this.loading = false;
      return;
    }

    this.loadCreditIntention();
  }

  /**
   * Cargar información de la intención de crédito
   */
  private loadCreditIntention(): void {
    this.loading = true;
    this.error = '';

    this.sendLinkService.getPublicIntentionByToken(this.token)
      .subscribe({
        next: (data) => {
          this.creditIntention = data;
          this.loading = false;

          // Verificar si ya fue procesada o expiró
          if (data.tokenExpired) {
            this.error = 'Este enlace ha expirado';
          } else if (data.approvalStatus !== 'PENDING') {
            this.error = this.getStatusMessage(data.approvalStatus);
          }
        },
        error: (err) => {
          this.loading = false;

          // Manejo más seguro del mensaje de error
          if (err?.error?.error) {
            this.error = err.error.error; // backend envía { "error": "mensaje" }
          } else if (err?.error?.message) {
            this.error = err.error.message; // backend envía { "message": "mensaje" }
          } else if (err?.message) {
            this.error = err.message; // error del cliente HTTP
          } else {
            this.error = 'No se pudo cargar la información de la solicitud';
          }

          console.error('Error cargando intención:', err);
        }
      });
  }

  /**
   * Procesar aprobación
   */
  approve(): void {
    Swal.fire({
      title: '¿Confirmar aprobación?',
      html: `
        <p>Estás a punto de <strong>APROBAR</strong> esta solicitud de crédito.</p>
        <p class="text-muted small">Esta acción no se puede deshacer.</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-success me-2',
        cancelButton: 'btn btn-danger'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.submitDecision(true);
      }
    });
  }

  /**
   * Procesar rechazo
   */
  reject(): void {
    Swal.fire({
      title: '¿Rechazar solicitud?',
      html: `
        <p>Estás a punto de <strong>RECHAZAR</strong> esta solicitud de crédito.</p>
        <p class="text-muted small">Esta acción no se puede deshacer.</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-danger me-2',
        cancelButton: 'btn btn-secondary'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.submitDecision(false);
      }
    });
  }

  /**
   * Enviar decisión al backend
   */
  private submitDecision(approved: boolean): void {
    this.processing = true;

    this.sendLinkService.submitApprovalDecision(this.token, approved)
      .subscribe({
        next: () => {
          this.processing = false;

          Swal.fire({
            title: approved ? '¡Solicitud Aprobada!' : 'Solicitud Rechazada',
            html: approved
              ? '<p>Tu solicitud de crédito ha sido <strong>aprobada exitosamente</strong>.</p><p class="text-muted small">En breve nos pondremos en contacto contigo.</p>'
              : '<p>Tu solicitud de crédito ha sido <strong>rechazada</strong>.</p><p class="text-muted small">Si tienes dudas, contáctanos.</p>',
            icon: approved ? 'success' : 'info',
            confirmButtonText: 'Entendido',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-primary'
            },
            allowOutsideClick: false
          }).then(() => {
            // Recargar para mostrar el estado actualizado
            this.loadCreditIntention();
          });
        },
        error: (err) => {
          this.processing = false;

          Swal.fire({
            title: 'Error',
            text: err?.error?.message || 'No se pudo procesar tu decisión. Intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-danger'
            }
          });
        }
      });
  }

  /**
   * Obtener mensaje según el estado
   */
  private getStatusMessage(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'Esta solicitud ya fue aprobada anteriormente';
      case 'REJECTED':
        return 'Esta solicitud ya fue rechazada anteriormente';
      default:
        return 'Esta solicitud ya fue procesada';
    }
  }

  /**
   * Formatear moneda
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  }

  /**
   * Obtener clase de badge según estado
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'bg-success';
      case 'REJECTED':
        return 'bg-danger';
      case 'PENDING':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  /**
   * Obtener texto del estado
   */
  getStatusText(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'Aprobada';
      case 'REJECTED':
        return 'Rechazada';
      case 'PENDING':
        return 'Pendiente';
      default:
        return status;
    }
  }
}
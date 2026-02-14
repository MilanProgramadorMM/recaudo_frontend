// ============================================
// recent-orders.component.ts
// ============================================
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreditIntentionResponseDto, CreditIntentionService } from '@core/services/creditIntention.service';

@Component({
  selector: 'recent-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-orders.component.html',
  styles: ``
})
export class RecentOrdersComponent implements OnInit {
  // Intenciones de crédito
  intentions: CreditIntentionResponseDto[] = [];
  loadingIntentions = false;
  currency = '$';

  constructor(
    private creditIntentionService: CreditIntentionService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.loadRecentIntentions();
  }

  loadRecentIntentions(): void {
    this.loadingIntentions = true;
    this.creditIntentionService.getIntentions().subscribe({
      next: (response) => {
        if (response.status === 'OK') {
          // Ordenar por fecha de creación descendente y tomar las 5 más recientes
          this.intentions = response.data
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
        }
        this.loadingIntentions = false;
      },
      error: (err) => {
        console.error('Error al cargar intenciones:', err);
        this.loadingIntentions = false;
      }
    });
  }

  manageIntention(intention?: CreditIntentionResponseDto): void {
    if (!intention?.id) {
      console.warn('Intención inválida', intention);
      return;
    }

    this.router.navigate([
      '/operaciones/management-credit-intention',
      intention.id
    ]);
  }


  // Métodos de utilidad para el template
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Hoy';
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
  }

  getTotalAmount(intention: CreditIntentionResponseDto): number {
    const quota = intention.quotaValue ?? 0;
    const period = intention.periodQuantity ?? 0;
    return quota * period;
  }

}
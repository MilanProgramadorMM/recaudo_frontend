import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { currency } from '@common/constants';
import {
  ClientListItemDto,
  PortfolioSnapshotService,
} from '@core/services/cartera.service';
import { ClienteCarteraModalComponent } from '../cliente-cartera-modal/cliente-cartera-modal.component';

type EstadoFiltro = 'TODOS' | 'EN_MORA' | 'AL_DIA';

/**
 * Lista/buscador de clientes con cartera en una fecha puntual.
 * Consume el endpoint 4: GET /portfolio-snapshots/clients?date=...&search=...
 *
 * El filtro de texto se resuelve en memoria (el backend ya trae todos los
 * clientes de la fecha), igual que credits.component. El parámetro `search`
 * del endpoint queda disponible en el service por si el volumen crece y hay
 * que mover el filtrado al servidor.
 *
 * El detalle de cada cliente se abre en ClienteCarteraModalComponent, que
 * recibe la misma fecha seleccionada aquí como punto de partida.
 */
@Component({
  selector: 'app-cliente-cartera',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbPaginationModule],
  templateUrl: './cliente-cartera-components.component.html',
  styleUrl: './cliente-cartera-components.component.scss',
})
export class ClienteCarteraComponent implements OnInit {

  filterForm: FormGroup;

  clientes: ClientListItemDto[] = [];
  clientesFiltrados: ClientListItemDto[] = [];

  pendingRequests = 0;
  error = false;

  page = 1;
  pageSize = 10;

  constructor(
    private fb: FormBuilder,
    private portfolioSnapshotService: PortfolioSnapshotService,
    private modalService: NgbModal
  ) {
    this.filterForm = this.fb.group({
      fecha: [this.formatDate(new Date())],
      search: [''],
      estado: ['TODOS' as EstadoFiltro],
    });
  }

  ngOnInit(): void {
    this.loadClientes();

    // La fecha cambia el dataset: hay que volver al backend.
    this.filterForm.get('fecha')!.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(() => this.loadClientes());

    // Texto y estado se resuelven en memoria.
    this.filterForm.get('search')!.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe(() => this.aplicarFiltros());

    this.filterForm.get('estado')!.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(() => this.aplicarFiltros());
  }

  get loading(): boolean {
    return this.pendingRequests > 0;
  }

  get fecha(): string {
    return this.filterForm.get('fecha')!.value;
  }

  private loadClientes(): void {
    const fecha = this.fecha;
    if (!fecha) return;

    this.pendingRequests++;
    this.error = false;

    this.portfolioSnapshotService.getClients(fecha).subscribe({
      next: (response) => {
        this.clientes = response.data ?? [];
        this.aplicarFiltros();
        this.pendingRequests--;
      },
      error: (err) => {
        console.error('Error al cargar los clientes con cartera:', err);
        this.clientes = [];
        this.clientesFiltrados = [];
        this.error = true;
        this.pendingRequests--;
      },
    });
  }

  private aplicarFiltros(): void {
    const search: string = (this.filterForm.get('search')!.value ?? '')
      .toString()
      .trim()
      .toLowerCase();
    const estado: EstadoFiltro = this.filterForm.get('estado')!.value;

    this.clientesFiltrados = this.clientes.filter((c) => {
      const coincideTexto =
        search.length === 0 ||
        (c.clienteFullname ?? '').toLowerCase().includes(search) ||
        (c.clienteDocumento ?? '').toLowerCase().includes(search);

      const enMora = (c.diasMoraMaximo ?? 0) > 0;
      const coincideEstado =
        estado === 'TODOS' ||
        (estado === 'EN_MORA' && enMora) ||
        (estado === 'AL_DIA' && !enMora);

      return coincideTexto && coincideEstado;
    });

    this.page = 1;
  }

  limpiarFiltros(): void {
    this.filterForm.patchValue({ search: '', estado: 'TODOS' });
  }

  get clientesPaginados(): ClientListItemDto[] {
    const inicio = (this.page - 1) * this.pageSize;
    return this.clientesFiltrados.slice(inicio, inicio + this.pageSize);
  }

  verDetalles(cliente: ClientListItemDto): void {
    const modalRef = this.modalService.open(ClienteCarteraModalComponent, {
      size: 'xl',
      scrollable: true,
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.personId = cliente.personId;
    modalRef.componentInstance.clienteFullname = cliente.clienteFullname;
    modalRef.componentInstance.clienteDocumento = cliente.clienteDocumento;
    modalRef.componentInstance.fecha = this.fecha;
  }

  // ── KPIs del listado filtrado ───────────────────────────────────────────────

  get totalClientes(): number {
    return this.clientesFiltrados.length;
  }

  get totalSaldo(): number {
    return this.clientesFiltrados.reduce((acc, c) => acc + (c.saldoTotal ?? 0), 0);
  }

  get totalClientesEnMora(): number {
    return this.clientesFiltrados.filter((c) => (c.diasMoraMaximo ?? 0) > 0).length;
  }

  get totalCreditos(): number {
    return this.clientesFiltrados.reduce((acc, c) => acc + (c.totalCreditos ?? 0), 0);
  }

  // ── helpers de presentación ─────────────────────────────────────────────────

  moraBadgeClass(diasMora: number | null): string {
    const dias = diasMora ?? 0;
    if (dias === 0) return 'bg-success-subtle text-success';
    if (dias <= 30) return 'bg-warning-subtle text-warning';
    if (dias <= 60) return 'bg-orange-subtle text-orange';
    return 'bg-danger-subtle text-danger';
  }

  formatCurrency(value: number): string {
    return (value ?? 0).toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  get currency() {
    return currency;
  }

  trackByPersonId(_index: number, cliente: ClientListItemDto): number {
    return cliente.personId;
  }

  private formatDate(date: Date): string {
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  }
}
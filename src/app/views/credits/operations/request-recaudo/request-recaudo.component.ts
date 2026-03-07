import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "@core/services/auth.service";
import { PersonResponseDto, PersonService } from "@core/services/person.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RecaudoFormComponent } from "./recaudo-form/recaudo-form.component";
import { DailyCollectionItem, DailyCollectionService } from "@core/services/daily-collection.service";
import Swal from "sweetalert2";
import { FormsModule } from "@angular/forms";


@Component({
  selector: 'app-request-recaudo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './request-recaudo.component.html',
  styleUrl: './request-recaudo.component.scss'
})
export class RequestRecaudoComponent implements OnInit {

  loading = false;
  error = false;
  errorMessage = '';
  asesorId: number | null = null;
  zonas: string[] = [];
  selectedZona: string = 'all';
  asesorName: string | null = null;
  searchTerm: string = '';

  clientesnew: DailyCollectionItem[] = [];
  clientesFiltered: DailyCollectionItem[] = [];
  filterStatus: string = 'all';

  isAsistente = false;
  isAsesor = false;
  isAdmin = false;
  currentRole: string = '';

  constructor(
    private personService: PersonService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private dailyCollectionService: DailyCollectionService
  ) { }

  ngOnInit(): void {
    this.loadRecaudoData();
  }

  loadRecaudoData(): void {
    this.loading = true;
    this.error = false;

    // Obtener el ID del asesor desde el token
    this.asesorId = this.authService.getUserId();
    this.asesorName = this.authService.getUsername();

    // Verificar si el token está expirado
    if (this.authService.isTokenExpired()) {
      this.loading = false;
      this.error = true;
      this.errorMessage = 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
      return;
    }

    if (!this.asesorId) {
      this.loading = false;
      this.error = true;
      this.errorMessage = 'No se pudo obtener la información del usuario. Por favor, inicie sesión nuevamente.';
      return;
    }

    // Obtener la zona del asesor
    this.personService.getZonasByAsesor(this.asesorId).subscribe({
      next: (response) => {
        this.zonas = response.data as string[];

        if (this.zonas.length === 0) {
          this.loading = false;
          this.error = true;
          this.errorMessage = 'No tiene zonas asignadas';
          return;
        }

        // Si solo tiene una zona, seleccionarla automáticamente
        if (this.zonas.length === 1) {
          this.selectedZona = this.zonas[0];
        }
        this.loadClientesByZona();
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        this.errorMessage = 'Error al obtener la zona del asesor';
        console.error('Error al obtener zona:', err);
      }
    });
  }

  loadClientesByZona(): void {
    if (!this.asesorName) {
      this.error = true;
      this.errorMessage = 'No se pudo obtener el usuario logueado';
      return;
    }

    const today = new Date().toLocaleDateString('en-CA');

    this.dailyCollectionService.getDailyCollection(today).subscribe({
      next: (response) => {
        this.clientesnew = response;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        this.errorMessage = 'Error al obtener los clientes de la zona';
        console.error('Error al obtener clientes:', err);
      }
    });
  }


  applyFilter(): void {
    let filtered = this.clientesnew;

    // 1. Filtrar por zona si no es "all"
    if (this.selectedZona !== 'all') {
      filtered = filtered.filter(c => c.zona === this.selectedZona);
    }

    // 2. Filtrar por estado
    switch (this.filterStatus) {
      case 'paid':
        // Solo los que pagaron hoy
        this.clientesFiltered = filtered.filter(c => c.paidToday === 1);
        break;

      case 'pending':
        // Todos los que NO han pagado (incluye: sin estado, con promesa, no pago)
        this.clientesFiltered = filtered.filter(c => c.paidToday !== 1);
        break;

      case 'promise':
        // Solo los que tienen promesa registrada (y no han pagado)
        this.clientesFiltered = filtered.filter(c =>
          c.paymentPromiseDate && c.paidToday !== 1 && c.noPago !== 1
        );
        break;

      case 'nopago':
        // Solo los marcados como "no pagó"
        this.clientesFiltered = filtered.filter(c => c.noPago === 1);
        break;

      case 'all':
      default:
        // TODOS los registros (pagados + pendientes + promesa + no pago)
        this.clientesFiltered = filtered;
        break;
    }
  }

  onZonaChange(): void {
    this.applyFilter();
  }

  /**
   * Registra una promesa de pago
   */
  registrarPromesa(cliente: DailyCollectionItem): void {

    const today = new Date();
    const toLocalDate = (date: Date) => date.toLocaleDateString('en-CA');

    // mínimo: hoy
    const minDate = toLocalDate(today);

    // valor por defecto: mañana
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const defaultDate = toLocalDate(tomorrow);

    Swal.fire({
      title: '¿Registrar promesa de pago?',
      html: `
      <p class="mb-3"><strong>${cliente.clientName}</strong></p>
    <p class="mb-3">Cuota #${cliente.quotaNumber}</p>
    <div class="text-start">
      <label for="promiseDate" class="form-label">Fecha de promesa:</label>
      <input
        type="date"
        id="promiseDate"
        class="form-control mb-3"
        min="${minDate}"
        value="${defaultDate}"
      >

      <label for="observation" class="form-label">Observación (opcional):</label>
      <textarea
        id="observation"
        class="form-control"
        rows="2"
        placeholder="Motivo, situación del cliente..."
      ></textarea>
    </div>
    `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ffc107',
      customClass: {
        popup: 'swal-wide'
      },
      preConfirm: () => {
        const promiseDateInput = document.getElementById('promiseDate') as HTMLInputElement;
        const observationInput = document.getElementById('observation') as HTMLTextAreaElement;

        const promiseDate = promiseDateInput?.value;
        const observation = observationInput?.value || '';

        if (!promiseDate) {
          Swal.showValidationMessage('Por favor selecciona una fecha');
          return false;
        }

        return { promiseDate, observation };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.dailyCollectionService.registerPromise(
          cliente.creditId,
          cliente.cuotaId,
          result.value.promiseDate,
          result.value.observation
        ).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Promesa registrada',
              text: 'La promesa de pago se registró exitosamente',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadClientesByZona();
          },
          error: (err) => {
            console.error('Error al registrar promesa:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo registrar la promesa de pago'
            });
          }
        });
      }
    });
  }

  /**
   * Registra que el cliente NO pagó
   */
  registrarNoPago(cliente: DailyCollectionItem): void {
    Swal.fire({
      title: '¿Registrar que no pagó?',
      html: `
      <p class="mb-3"><strong>${cliente.clientName}</strong></p>
      <p class="mb-3">Cuota #${cliente.quotaNumber}</p>
      <div class="text-start">
        <label for="noPagoReason" class="form-label">Motivo:</label>
        <select id="noPagoReason" class="form-select mb-3">
          <option value="">Seleccione un motivo...</option>
          <option value="No tiene dinero">No tiene dinero</option>
          <option value="No se encuentra en casa">No se encuentra en casa</option>
          <option value="Se negó a pagar">Se negó a pagar</option>
          <option value="OTHER">Otro motivo</option>
        </select>
        <label for="observation" class="form-label">Observación:</label>
        <textarea id="observation" class="form-control" rows="2" 
                  placeholder="Detalles adicionales..."></textarea>
      </div>
    `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      customClass: {
        popup: 'swal-wide'
      },
      preConfirm: () => {
        const reasonSelect = document.getElementById('noPagoReason') as HTMLSelectElement;
        const observationInput = document.getElementById('observation') as HTMLTextAreaElement;

        const reason = reasonSelect?.value;
        const observation = observationInput?.value || '';

        if (!reason) {
          Swal.showValidationMessage('Por favor selecciona un motivo');
          return false;
        }

        return { reason, observation };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.dailyCollectionService.registerNoPago(
          cliente.creditId,
          cliente.cuotaId,
          result.value.reason,
          result.value.observation
        ).subscribe({
          next: () => {
            Swal.fire({
              icon: 'info',
              title: 'Registro exitoso',
              text: 'Se registró que el cliente no pagó',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadClientesByZona();
          },
          error: (err) => {
            console.error('Error al registrar no pago:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo registrar el no pago'
            });
          }
        });
      }
    });
  }


  openRecaudoModal(cliente: PersonResponseDto): void {
    const modalRef = this.modalService.open(RecaudoFormComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: true,
      centered: true
    });

    modalRef.componentInstance.cliente = cliente;
    modalRef.componentInstance.asesorId = this.asesorId;
    modalRef.componentInstance.asesorName = this.asesorName;

    modalRef.result.then(
      (result) => {
        if (result) {
          console.log('Recaudo guardado:', result);
          this.loadClientesByZona();
        }
      },
      (reason) => {
        console.log('Modal cerrado:', reason);
      }
    );
  }
  // NUEVO MÉTODO para ver detalle
  openRecaudoDetailModal(cliente: DailyCollectionItem): void {
    const modalRef = this.modalService.open(RecaudoFormComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: true,
      centered: true
    });

    modalRef.componentInstance.cliente = cliente;
    modalRef.componentInstance.viewMode = true;  // MODO SOLO LECTURA
  }

  reloadData(): void {
    this.loadRecaudoData();
  }

  applyCustomerFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    let filtered = this.clientesnew;
    if (!term) {
      this.clientesFiltered = [...this.clientesnew];
    } else {
      this.clientesFiltered = filtered.filter(item => item.clientName?.toLowerCase().includes(term));
    }
  }
}
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "@core/services/auth.service";
import { PersonResponseDto, PersonService } from "@core/services/person.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RecaudoFormComponent } from "./recaudo-form/recaudo-form.component";
import { DailyCollectionItem, DailyCollectionItemDTO, DailyCollectionService } from "@core/services/daily-collection.service";
import Swal from "sweetalert2";
import { FormsModule } from "@angular/forms";
import { RecaudoModalComponent } from "@views/credits/recaudo-modal/recaudo-modal.component";
import { Capacitor } from "@capacitor/core";
import { AppLauncher } from '@capacitor/app-launcher';
import { MatTooltipModule } from '@angular/material/tooltip';
import { A11yModule } from "@angular/cdk/a11y";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-request-recaudo',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTooltipModule, A11yModule],
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

  clientesnew: DailyCollectionItemDTO[] = [];
  clientesFiltered: DailyCollectionItemDTO[] = [];
  filterStatus: string = 'pending';

  isAsistente = false;
  isAsesor = false;
  isAdmin = false;
  currentRole: string = '';
  searchOrden: number = 0;

  constructor(
    private personService: PersonService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private dailyCollectionService: DailyCollectionService,
    private snackBar: MatSnackBar

  ) { }

  ngOnInit(): void {
    this.loadRecaudoData();
  }

  getInitials(text: string): string {
    if (!text) return '';

    const words = text
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return words
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join('');
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
          this.selectedZona = this.getInitials(this.zonas[0]);
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
    this.clientesnew = [];
    this.loading = true;

    const today = new Date().toLocaleDateString('en-CA');

    this.dailyCollectionService.getDailyCollection(today).subscribe({
      next: (response) => {
        this.clientesnew = response.map((c: any) => ({
          ...c,
          nombreDia: this.diasMap[c.data?.nombreDia] || c.data?.nombreDia
        }));
        //debugger;
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

  private diasMap: Record<string, string> = {
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
    Saturday: 'Sábado',
    Sunday: 'Domingo'
  };

  getDiaEspanol(dia: string): string {
    return this.diasMap[dia] || dia;
  }

  calcularTotalPagado(recaudos: any[]): number {
    if (!recaudos || recaudos.length === 0) return 0;

    return recaudos.reduce((acumulado, actual) => {
      return acumulado + (actual.totalPagado || 0);
    }, 0);
  }

  applyFilter(): void {
    let filtered = [...this.clientesnew];
    // if (this.selectedZona !== 'all') {
    //   filtered = filtered.filter(c => c.data.zona === this.selectedZona);
    // }

    if (this.selectedZona !== 'all') {
      filtered = filtered.filter(c =>
        this.selectedZona.startsWith(c.data.zona ?? '') ||
        c.data.zona === this.selectedZona
      );
    }

    const term = this.searchTerm.toLowerCase().trim();
    if (term) {
      filtered = filtered.filter(c =>
        c.data.clientName?.toLowerCase().includes(term)
      );
    }

    const orden = this.searchOrden;

    if (orden) {
      filtered = filtered.filter(c =>
        Number(c.data.clientOrden) === Number(orden)
      );
    }

    switch (this.filterStatus) {
      case 'paid':
        this.clientesFiltered = filtered.filter(c =>
          c.data.paidToday === 1 || c.data.paidFull === 'S'
        );
        break;

      case 'pending':
        // Pendientes puros (sin promesa, sin noPago, sin pago)
        this.clientesFiltered = filtered.filter(c =>
          c.data.paidToday !== 1 &&
          c.data.paidFull !== 'S' &&
          !c.data.paymentPromiseDate &&
          c.data.noPago !== 1
        );
        break;

      case 'promise':
        this.clientesFiltered = filtered.filter(c =>
          c.data.paymentPromiseDate && c.data.paidToday !== 1 && c.data.noPago !== 1
        );
        break;

      case 'nopago':
        this.clientesFiltered = filtered.filter(c => c.data.noPago === 1);
        break;

      case 'all':
      default:
        this.clientesFiltered = filtered.filter(c =>
          c.data.paidToday !== 1 && c.data.paidFull !== 'S'
        );
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

  openCreditDetail(creditId: number): void {
    const modalRef = this.modalService.open(RecaudoModalComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: true,
      centered: true,
      scrollable: true,
      windowClass: 'modal-extra-large'
    });

    modalRef.componentInstance.creditId = creditId;
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

  callPhone(number: string): void {
    if (!number) return;

    const cleanNumber = number.replace(/[^\d+]/g, '');
    window.location.href = `tel:${cleanNumber}`;
  }

  async openWhatsApp(phone: string): Promise<void> {
    if (!phone) return;

    const cleanedPhone = phone.replace(/\D/g, '');
    const fullPhone = cleanedPhone.startsWith('57')
      ? cleanedPhone
      : `57${cleanedPhone}`;

    if (Capacitor.isNativePlatform()) {
      await this.openWhatsAppNative(fullPhone);
    } else {
      window.open(`https://wa.me/${fullPhone}`, '_blank');
    }
  }

  private async openWhatsAppNative(fullPhone: string): Promise<void> {
    const whatsappUrl = `whatsapp://send?phone=${fullPhone}`;

    try {
      // Abrir directo sin canOpenUrl() — ese método falla en Android
      await AppLauncher.openUrl({ url: whatsappUrl });
    } catch (error) {
      console.error('WhatsApp no disponible:', error);
      // Solo si falla de verdad, ir al Play Store
      await AppLauncher.openUrl({
        url: 'market://details?id=com.whatsapp'
      });
    }
  }

  // applyCustomerFilter(): void {
  //   const term = this.searchTerm.toLowerCase().trim();
  //   let filtered = this.clientesnew;
  //   if (!term) {
  //     this.clientesFiltered = [...this.clientesnew];
  //   } else {
  //     this.clientesFiltered = filtered.filter(item => item.clientName?.toLowerCase().includes(term));
  //   }
  // }

  applyCustomerFilter(): void {
    this.applyFilter();
  }

  getPeriodoAbreviado(periodo: string | null | undefined): string {
    return (periodo || '').substring(0, 3);
  }

  showInfo(event: Event, cliente: any, tipo: string): void {
    event.stopPropagation();
    console.log('TIPO:', tipo);

    switch (tipo) {
      case 'capital':
        this.snackBar.open(
          'Valor total del crédito sin intereses moratorios',
          undefined,
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          }
        );
        break;

      case 'saldo':
        this.snackBar.open(
          'Saldo total del crédito',
          undefined, {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        }
        );
        break;

      case 'mora':
        this.snackBar.open(
          'Interés moratorio total del crédito',
          undefined, {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        }
        );
        break;

      case 'saldototalmora':
        this.snackBar.open(
          'Saldo total del crédito más intereses moratorios',
          undefined, {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        }
        );
        break;

      case 'valorcuota':
        this.snackBar.open(
          'Valor de la cuota sin intereses moratorios',
          undefined, {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        }
        );
        break;

      case 'saldovencidocuota':
        this.snackBar.open(
          'Saldo vencido de la cuota',
          undefined, {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        }
        );
        break;

      case 'interesmoracuota':
        this.snackBar.open(
          'Interés moratorio de la cuota',
          undefined, {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        }
        );
        break;

      case 'totalcuota':
        this.snackBar.open(
          'Total de la cuota incluyendo intereses moratorios',
          undefined, {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        }
        );
        break;

    }
  }
}
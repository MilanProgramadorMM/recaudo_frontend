import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "@core/services/auth.service";
import { PersonResponseDto, PersonService } from "@core/services/person.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RecaudoFormComponent } from "./recaudo-form/recaudo-form.component";
import { CardData, DailyCollectionItemDTO, DailyCollectionService } from "@core/services/daily-collection.service";
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
  searchOrden: string = '';

  vistaActual: 'cuota' | 'cartera' | 'mora' = 'cuota';
  carteraZona: DailyCollectionItemDTO[] = [];
  carteraFiltered: DailyCollectionItemDTO[] = [];

  enMora: DailyCollectionItemDTO[] = [];
  enMoraFiltered: DailyCollectionItemDTO[] = [];

  zonaOpciones: { code: string; name: string }[] = [];

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

  get itemsFiltrados(): DailyCollectionItemDTO[] {
    if (this.vistaActual === 'cartera') return this.carteraFiltered;
    if (this.vistaActual === 'mora') return this.enMoraFiltered;
    return this.clientesFiltered;
  }

  getInitials(text: string): string {
    if (!text) return '';
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return words.slice(0, 2).map(w => w[0].toUpperCase()).join('');
  }

  loadRecaudoData(): void {
    this.loading = true;
    this.error = false;

    this.asesorId = this.authService.getUserId();
    this.asesorName = this.authService.getUsername();

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

    this.personService.getZonasByAsesor(this.asesorId).subscribe({
      next: (response) => {
        this.zonas = response.data as string[];
        if (this.zonas.length === 0) {
          this.loading = false;
          this.error = true;
          this.errorMessage = 'No tiene zonas asignadas';
          return;
        }
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
        this.clientesnew = response.cobroHoy.map((c) => ({
          ...c,
          data: {
            ...c.data,
            zonaCode: c.data?.zonaCode ?? (c.data?.zona ? this.getInitials(c.data.zona) : null),
            nombreDia: this.diasMap[c.data?.nombreDia ?? ''] || c.data?.nombreDia
          }
        }));
        this.carteraZona = response.carteraZona;
        this.enMora = response.enMora;
        this.construirZonaOpciones();

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

  private construirZonaOpciones(): void {
    const todos = [...this.clientesnew, ...this.carteraZona, ...this.enMora];
    const mapa = new Map<string, string>();

    for (const item of todos) {
      const code = item.data?.zonaCode;
      if (code && !mapa.has(code)) {
        mapa.set(code, item.data?.zona ?? code);
      }
    }

    this.zonaOpciones = Array.from(mapa, ([code, name]) => ({ code, name }))
      .sort((a, b) => a.code.localeCompare(b.code));

    if (this.zonaOpciones.length === 1) {
      this.selectedZona = this.zonaOpciones[0].code;
      this.applyFilter();
    }
  }

  onVistaChange(value: 'cuota' | 'cartera' | 'mora'): void {
    this.vistaActual = value;
    this.applyFilter();
  }

  private diasMap: Record<string, string> = {
    Monday: 'Lunes', Tuesday: 'Martes', Wednesday: 'Miércoles',
    Thursday: 'Jueves', Friday: 'Viernes', Saturday: 'Sábado', Sunday: 'Domingo'
  };

  getDiaEspanol(dia: string): string {
    return this.diasMap[dia] || dia;
  }

  calcularTotalPagado(recaudos: any[]): number {
    if (!recaudos || recaudos.length === 0) return 0;
    return recaudos.reduce((acc, r) => acc + (r.totalPagado || 0), 0);
  }

  applyFilter(): void {
    if (this.vistaActual === 'cartera') { this.applyCarteraFilter(); return; }
    if (this.vistaActual === 'mora') { this.applyMoraFilter(); return; }
    this.applyCuotaFilter();
  }

  private applyCuotaFilter(): void {
    let filtered = [...this.clientesnew];
  console.log('CMP', JSON.stringify(this.clientesnew.map(c => c.data.zonaCode)), 'vs', JSON.stringify(this.selectedZona));

    if (this.selectedZona !== 'all') {
      filtered = filtered.filter(c => c.data.zonaCode === this.selectedZona);
    }
    console.log('[CUOTA] tras zona =', filtered.length);

    const term = this.searchTerm.toLowerCase().trim();
    if (term) filtered = filtered.filter(c => c.data.clientName?.toLowerCase().includes(term));
    console.log('[CUOTA] tras searchTerm =', filtered.length, '| term =', JSON.stringify(this.searchTerm));

    if (this.searchOrden) filtered = filtered.filter(c => Number(c.data.clientOrden) === Number(this.searchOrden));
    console.log('[CUOTA] tras searchOrden =', filtered.length, '| searchOrden =', JSON.stringify(this.searchOrden));

    switch (this.filterStatus) {
      case 'paid':
        this.clientesFiltered = filtered.filter(c => c.data.paidToday === 1 || c.data.paidFull === 'S');
        break;
      case 'pending':
        const debug = filtered.map(c => ({
          orden: c.data.clientOrden,
          paidToday: c.data.paidToday, tPaidToday: typeof c.data.paidToday,
          paidFull: c.data.paidFull,
          promesa: c.data.paymentPromiseDate,
          noPago: c.data.noPago, tNoPago: typeof c.data.noPago,
          pasa: c.data.paidToday !== 1 && c.data.paidFull !== 'S' && !c.data.paymentPromiseDate && c.data.noPago !== 1
        }));
        console.table(debug);
        this.clientesFiltered = filtered.filter(c =>
          c.data.paidToday !== 1 && c.data.paidFull !== 'S' && !c.data.paymentPromiseDate && c.data.noPago !== 1);
        break;
      case 'promise':
        this.clientesFiltered = filtered.filter(c =>
          c.data.paymentPromiseDate && c.data.paidToday !== 1 && c.data.noPago !== 1);
        break;
      case 'nopago':
        this.clientesFiltered = filtered.filter(c => c.data.noPago === 1);
        break;
      default:
        this.clientesFiltered = filtered.filter(c => c.data.paidToday !== 1 && c.data.paidFull !== 'S');
    }

    console.log('[CUOTA] filterStatus =', this.filterStatus, '| final =', this.clientesFiltered.length);
  }

  private applyCarteraFilter(): void {
    console.log('[CUOTA] base clientesnew =', this.clientesnew.length,
      '| selectedZona =', this.selectedZona,
      '| codes =', [...new Set(this.clientesnew.map(c => c.data?.zonaCode))]);
    let filtered = [...this.carteraZona];
    if (this.selectedZona !== 'all') filtered = filtered.filter(c => c.data.zonaCode === this.selectedZona);
    const term = this.searchTerm.toLowerCase().trim();
    if (term) filtered = filtered.filter(c => c.data.clientName?.toLowerCase().includes(term));
    if (this.searchOrden) filtered = filtered.filter(c => Number(c.data.clientOrden) === Number(this.searchOrden));
    this.carteraFiltered = filtered;
  }

  private applyMoraFilter(): void {
    console.log('[CUOTA] base clientesnew =', this.clientesnew.length,
      '| selectedZona =', this.selectedZona,
      '| codes =', [...new Set(this.clientesnew.map(c => c.data?.zonaCode))]);
    let filtered = [...this.enMora];
    if (this.selectedZona !== 'all') filtered = filtered.filter(c => c.data.zonaCode === this.selectedZona);
    const term = this.searchTerm.toLowerCase().trim();
    if (term) filtered = filtered.filter(c => c.data.clientName?.toLowerCase().includes(term));
    if (this.searchOrden) filtered = filtered.filter(c => Number(c.data.clientOrden) === Number(this.searchOrden));
    this.enMoraFiltered = filtered;
  }

  applyCustomerFilter(): void { this.applyFilter(); }

  onZonaChange(value: string): void {
    this.selectedZona = value;
    this.applyFilter();
  }

  registrarPromesa(cliente: CardData): void {
    const today = new Date();
    const toLocalDate = (date: Date) => date.toLocaleDateString('en-CA');
    const minDate = toLocalDate(today);
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
        <input type="date" id="promiseDate" class="form-control mb-3" min="${minDate}" value="${defaultDate}">
        <label for="observation" class="form-label">Observación (opcional):</label>
        <textarea id="observation" class="form-control" rows="2" placeholder="Motivo, situación del cliente..."></textarea>
      </div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ffc107',
      customClass: { popup: 'swal-wide' },
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
      if (result.isConfirmed && result.value && cliente.cuotaId != null) {
        (this.dailyCollectionService as any).registerPromise(
          cliente.creditId,
          cliente.cuotaId,
          result.value.promiseDate,
          result.value.observation
        ).subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Promesa registrada', text: 'La promesa de pago se registró exitosamente', timer: 2000, showConfirmButton: false });
            this.loadClientesByZona();
          },
          error: (err: any) => {
            console.error('Error al registrar promesa:', err);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo registrar la promesa de pago' });
          }
        });
      }
    });
  }

  registrarNoPago(cliente: CardData): void {
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
        <textarea id="observation" class="form-control" rows="2" placeholder="Detalles adicionales..."></textarea>
      </div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      customClass: { popup: 'swal-wide' },
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
      if (result.isConfirmed && result.value && cliente.cuotaId != null) {
        (this.dailyCollectionService as any).registerNoPago(
          cliente.creditId,
          cliente.cuotaId,
          result.value.reason,
          result.value.observation
        ).subscribe({
          next: () => {
            Swal.fire({ icon: 'info', title: 'Registro exitoso', text: 'Se registró que el cliente no pagó', timer: 2000, showConfirmButton: false });
            this.loadClientesByZona();
          },
          error: (err: any) => {
            console.error('Error al registrar no pago:', err);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo registrar el no pago' });
          }
        });
      }
    });
  }

  openCreditDetail(creditId: number): void {
    const modalRef = this.modalService.open(RecaudoModalComponent, {
      size: 'xl', backdrop: 'static', keyboard: true, centered: true, scrollable: true, windowClass: 'modal-extra-large'
    });
    modalRef.componentInstance.creditId = creditId;
  }

  // openRecaudoModal(cliente: CardData): void {
  //   const modalRef = this.modalService.open(RecaudoFormComponent, {
  //     size: 'md', backdrop: 'static', keyboard: true, centered: true
  //   });
  //   modalRef.componentInstance.cliente = cliente;
  //   modalRef.componentInstance.asesorId = this.asesorId;
  //   modalRef.componentInstance.asesorName = this.asesorName;
  //   modalRef.result.then(
  //     (result) => { if (result) { this.loadClientesByZona(); } },
  //     () => {}
  //   );
  // }

  openRecaudoModal(cliente: CardData): void {
    // La cuota a recaudar depende de la vista:
    // mora -> la más antigua vencida; cuota/cartera -> quotaNumber (ya viene bien)
    const quotaNumber =
      this.vistaActual === 'mora'
        ? (cliente.primeraCuotaVencidaNumero ?? cliente.quotaNumber)
        : cliente.quotaNumber;

    const clienteParaModal: CardData = { ...cliente, quotaNumber };

    const modalRef = this.modalService.open(RecaudoFormComponent, {
      size: 'md', backdrop: 'static', keyboard: true, centered: true
    });
    modalRef.componentInstance.cliente = clienteParaModal;
    modalRef.componentInstance.asesorId = this.asesorId;
    modalRef.componentInstance.asesorName = this.asesorName;
    modalRef.result.then(
      (result) => { if (result) { this.loadClientesByZona(); } },
      () => { }
    );
  }

  openRecaudoDetailModal(cliente: CardData): void {
    const modalRef = this.modalService.open(RecaudoFormComponent, {
      size: 'md', backdrop: 'static', keyboard: true, centered: true
    });
    modalRef.componentInstance.cliente = cliente;
    modalRef.componentInstance.viewMode = true;
  }

  reloadData(): void { this.loadRecaudoData(); }

  callPhone(number: string | null): void {
    if (!this.isValidPhone(number)) {
      this.snackBar.open('El cliente no tiene celular registrado', 'Cerrar', { duration: 3000 });
      return;
    }
    const cleanNumber = number!.replace(/\D/g, '');
    window.location.href = `tel:${cleanNumber}`;
  }

  async openWhatsApp(phone: string | null): Promise<void> {
    if (!this.isValidPhone(phone)) {
      this.snackBar.open('El cliente no tiene WhatsApp registrado', 'Cerrar', { duration: 3000 });
      return;
    }
    const cleanedPhone = phone!.replace(/\D/g, '');
    const fullPhone = cleanedPhone.startsWith('57') ? cleanedPhone : `57${cleanedPhone}`;
    if (Capacitor.isNativePlatform()) {
      await this.openWhatsAppNative(fullPhone);
    } else {
      window.open(`https://wa.me/${fullPhone}`, '_blank');
    }
  }

  private async openWhatsAppNative(fullPhone: string): Promise<void> {
    const whatsappUrl = `whatsapp://send?phone=${fullPhone}`;
    try {
      await AppLauncher.openUrl({ url: whatsappUrl });
    } catch (error) {
      console.error('WhatsApp no disponible:', error);
      await AppLauncher.openUrl({ url: 'market://details?id=com.whatsapp' });
    }
  }

  private isValidPhone(phone: string | null | undefined): boolean {
    if (!phone) return false;
    const cleaned = phone.replace(/\D/g, '');
    return cleaned !== '' && cleaned !== '0' && cleaned.length >= 10;
  }

  getPeriodoAbreviado(periodo: string | null | undefined): string {
    return (periodo || '').substring(0, 3);
  }

  showInfo(event: Event, cliente: any, tipo: string): void {
    event.stopPropagation();
    const mensajes: Record<string, string> = {
      capital: 'Valor total del crédito sin intereses moratorios',
      saldo: 'Saldo total del crédito',
      mora: 'Interés moratorio total del crédito',
      saldototalmora: 'Saldo total del crédito más intereses moratorios',
      valorcuota: 'Valor de la cuota sin intereses moratorios',
      saldovencidocuota: 'Saldo vencido de la cuota',
      interesmoracuota: 'Interés moratorio de la cuota',
      totalcuota: 'Total de la cuota incluyendo intereses moratorios'
    };
    if (mensajes[tipo]) {
      this.snackBar.open(mensajes[tipo], undefined, { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
    }
  }

  formatearFechaArray(fechaArr: number[] | null): string {
    if (!fechaArr || fechaArr.length < 3) return '';
    const [anio, mes, dia] = fechaArr;
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return `${dia} ${meses[mes - 1]} ${anio}`;
  }
}
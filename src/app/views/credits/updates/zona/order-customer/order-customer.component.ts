import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PersonZonaService } from '@core/services/person-zona.service';
import { PersonResponseDto, PersonService } from '@core/services/person.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from '@views/ui/loading/loading.component';
import { finalize } from 'rxjs';
import { AfterViewChecked, ElementRef } from '@angular/core';


@Component({
  selector: 'app-order-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './order-customer.component.html',
  styleUrl: './order-customer.component.scss',
})
export class OrderCustomerComponent implements OnInit {
  @Input() zonaId!: number;
  @Input() zonaValue!: string;

  @ViewChild('successalert', { static: true }) successAlertTpl!: TemplateRef<any>;
  @ViewChild('erroralert', { static: true }) errorAlertTpl!: TemplateRef<any>;

  lastErrorMessage = '';
  clienteMovidoId: number | null = null;


  // Se mantienen los mismos dos arrays de antes para que guardarOrden()
  // y la comunicación con el backend queden idénticos. Lo único que cambia
  // es cómo se presentan: una sola columna en el HTML.
  clientesConOrden: PersonResponseDto[] = [];
  clientesSinOrden: PersonResponseDto[] = [];

  filtro = '';
  filtroRuta = '';
  filtroSinAsignar = '';
  loading = true;

  constructor(
    public activeModal: NgbActiveModal,
    private personService: PersonService,
    private personZonaService: PersonZonaService,
    private modalService: NgbModal,
    private dialog: MatDialog,
    private host: ElementRef,
  ) { }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.personService.getPersonsByZona('CLIENTE', this.zonaValue).subscribe({
      next: (res) => {
        const all = res.data.filter((c) => c != null);

        this.clientesConOrden = all
          .filter((c) => c.orden && c.orden > 0)
          .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

        this.clientesSinOrden = all
          .filter((c) => !c.orden || c.orden === 0)
          .sort((a, b) => (a.fullName ?? '').localeCompare(b.fullName ?? ''));

        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes por zona', err);
        this.loading = false;
      },
    });
  }

  get conOrdenFiltrados(): PersonResponseDto[] {
    const q = this.filtroRuta.trim().toLowerCase();
    if (!q) return this.clientesConOrden;
    return this.clientesConOrden.filter(
      (c) =>
        (c.fullName ?? '').toLowerCase().includes(q) ||
        (c.document ?? '').toLowerCase().includes(q)
    );
  }

  get sinOrdenFiltrados(): PersonResponseDto[] {
    const q = this.filtroSinAsignar.trim().toLowerCase();
    if (!q) return this.clientesSinOrden;
    return this.clientesSinOrden.filter(
      (c) =>
        (c.fullName ?? '').toLowerCase().includes(q) ||
        (c.document ?? '').toLowerCase().includes(q)
    );
  }

  // ── Mover dentro de la ruta con flechas ──────────────────────────────────────

  // Trabajan sobre el objeto, no sobre el índice de la vista filtrada
  subir(cliente: PersonResponseDto): void {
    const index = this.clientesConOrden.indexOf(cliente);
    if (index <= 0) return;
    moveItemInArray(this.clientesConOrden, index, index - 1);
    this.renumerar();
  }

  bajar(cliente: PersonResponseDto): void {
    const index = this.clientesConOrden.indexOf(cliente);
    if (index === -1 || index >= this.clientesConOrden.length - 1) return;
    moveItemInArray(this.clientesConOrden, index, index + 1);
    this.renumerar();
  }

  // ── Incluir / excluir de la ruta ─────────────────────────────────────────────

  agregarARuta(cliente: PersonResponseDto): void {
    const i = this.clientesSinOrden.indexOf(cliente);
    if (i === -1) return;
    this.clientesSinOrden.splice(i, 1);
    this.clientesConOrden.push(cliente); // entra al final de la ruta
    this.renumerar();
  }

  quitarDeRuta(cliente: PersonResponseDto): void {
    const index = this.clientesConOrden.indexOf(cliente);
    if (index === -1) return;
    this.clientesConOrden.splice(index, 1);
    cliente.orden = 0;
    this.clientesSinOrden.push(cliente);
    this.clientesSinOrden.sort((a, b) =>
      (a.fullName ?? '').localeCompare(b.fullName ?? '')
    );
    this.renumerar();
  }

  agregarTodos(): void {
    const restantes = [...this.clientesSinOrden];
    this.clientesSinOrden = [];
    this.clientesConOrden.push(...restantes);
    this.renumerar();
  }

  limpiarRuta(): void {
    const enRuta = [...this.clientesConOrden];
    enRuta.forEach((c) => (c.orden = 0));
    this.clientesConOrden = [];
    this.clientesSinOrden.push(...enRuta);
    this.clientesSinOrden.sort((a, b) =>
      (a.fullName ?? '').localeCompare(b.fullName ?? '')
    );
  }

  // ── Arrastre opcional (una sola lista, sin columnas conectadas) ──────────────

  drop(event: CdkDragDrop<PersonResponseDto[]>): void {
    moveItemInArray(this.clientesConOrden, event.previousIndex, event.currentIndex);
    this.renumerar();
  }

  // ── Numeración ───────────────────────────────────────────────────────────────

  renumerar(): void {
    this.clientesConOrden.forEach((c, i) => (c.orden = i + 1));
  }

  // ── Guardado (sin cambios respecto al original) ──────────────────────────────

  guardarOrden(): void {
    const data = {
      clientes: this.clientesConOrden.map((c) => ({
        personId: c.id,
        zonaId: this.zonaId,
        orden: c.orden!,
      })),
    };

    const loadingRef = this.modalService.open(LoadingComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: 'sm',
      modalDialogClass: 'modal-loading',
    });

    this.personZonaService
      .updateOrdenClientes(data)
      .pipe(finalize(() => loadingRef.close()))
      .subscribe({
        next: () => {
          this.modalService.open(this.successAlertTpl, {
            centered: true,
            size: 'sm',
            backdrop: 'static',
          });
        },
        error: (err) => {
          this.lastErrorMessage = err?.error?.details || err?.details || '';
          this.modalService.open(this.errorAlertTpl, {
            centered: true,
            size: 'sm',
          });
        },
      });
  }

  onSuccessContinue(alertModalRef: any): void {
    alertModalRef.close();
  }

  trackById(_index: number, cliente: PersonResponseDto): number {
    return cliente.id;
  }

  esPrimero(cliente: PersonResponseDto): boolean {
    return this.clientesConOrden.indexOf(cliente) === 0;
  }

  esUltimo(cliente: PersonResponseDto): boolean {
    return this.clientesConOrden.indexOf(cliente) === this.clientesConOrden.length - 1;
  }

  cambiarOrden(cliente: PersonResponseDto, valor: string): void {
    const total = this.clientesConOrden.length;
    let destino = parseInt(valor, 10);

    if (isNaN(destino)) {
      this.renumerar();
      return;
    }

    destino = Math.max(1, Math.min(total, destino));

    const actual = this.clientesConOrden.indexOf(cliente);
    if (actual === -1) return;

    moveItemInArray(this.clientesConOrden, actual, destino - 1);
    this.renumerar();

    // marca al cliente para resaltarlo y llevar el scroll hasta él
    this.clienteMovidoId = cliente.id;
    this.scrollAlClienteMovido();
  }

  private scrollAlClienteMovido(): void {
    // setTimeout deja que Angular repinte la lista en el nuevo orden antes de buscar la fila
    setTimeout(() => {
      const fila = this.host.nativeElement.querySelector(
        `[data-cliente-id="${this.clienteMovidoId}"]`
      );
      if (fila) {
        fila.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // quita el resaltado después de un momento
      setTimeout(() => (this.clienteMovidoId = null), 1500);
    });
  }
}
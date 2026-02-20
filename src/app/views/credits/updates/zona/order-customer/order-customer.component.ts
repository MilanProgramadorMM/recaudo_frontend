import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PersonZonaService } from '@core/services/person-zona.service';
import { PersonResponseDto, PersonService } from '@core/services/person.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from '@views/ui/loading/loading.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-order-customer',
  imports: [CommonModule, DragDropModule],
  templateUrl: './order-customer.component.html',
  styleUrl: './order-customer.component.scss',
})
export class OrderCustomerComponent {
  @Input() zonaId!: number;
  @Input() zonaValue!: string;

  @ViewChild('successalert', { static: true }) successAlertTpl!: TemplateRef<any>;
  @ViewChild('erroralert', { static: true }) errorAlertTpl!: TemplateRef<any>;

  errorMessage = '';
  lastErrorMessage = '';

  clientesConOrden: PersonResponseDto[] = [];
  clientesSinOrden: PersonResponseDto[] = [];
  loading: boolean = true;

  constructor(
    public activeModal: NgbActiveModal,
    private personService: PersonService,
    private personZonaService: PersonZonaService,
    private modalService: NgbModal,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.personService.getPersonsByZona("CLIENTE", this.zonaValue).subscribe({
      next: (res) => {
        const all = res.data.filter(c => c != null); // Filtrar nulls

        // Ordenar y remover duplicados
        this.clientesConOrden = all
          .filter(c => c.orden && c.orden > 0)
          .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

        this.clientesSinOrden = all.filter(c => !c.orden || c.orden === 0);

        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes por zona', err);
        this.loading = false;
      }
    });
  }

  dropToLeft(event: CdkDragDrop<PersonResponseDto[]>) {
    if (!event.container.data || !event.previousContainer.data) {
      return; // Protección contra undefined
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(this.clientesConOrden, event.previousIndex, event.currentIndex);
    } else {
      const moved = this.clientesSinOrden[event.previousIndex];
      if (!moved) return; // Protección adicional

      this.clientesSinOrden.splice(event.previousIndex, 1);
      this.clientesConOrden.splice(event.currentIndex, 0, moved);
    }
    this.renumerar();
  }



  // Reasigna números de orden en la lista de clientes con orden
  renumerar() {
    this.clientesConOrden.forEach((c, i) => c.orden = i + 1);
  }



  guardarOrden(): void {
    const data = {
      clientes: this.clientesConOrden.map(c => ({
        personId: c.id,
        zonaId: this.zonaId,
        orden: c.orden!
      }))
    };

    const loadingRef = this.modalService.open(LoadingComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: 'sm',
      modalDialogClass: 'modal-loading' 
    });

    this.personZonaService.updateOrdenClientes(data)
      .pipe(
      finalize(() => loadingRef.close())
    )
      .subscribe({
        next: () => {
          this.modalService.open(this.successAlertTpl, {
            centered: true,
            size: 'sm',
            backdrop: 'static'
          });
        },
        error: (err) => {
          this.lastErrorMessage =
            err?.error?.details || err?.details || null;

          this.modalService.open(this.errorAlertTpl, {
            centered: true,
            size: 'sm'
          });
        }
      });

  }

  onSuccessContinue(alertModalRef: any) {
    alertModalRef.close();
  }

}

import { Component } from '@angular/core';
import { CommonModule, LowerCasePipe } from '@angular/common';
import { PageTitleComponent } from '@components/page-title.component';
import { NgbDropdownModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PersonDataType } from './data';
import { PersonCreateComponent } from '../person-create/person-create.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonRegisterDto, PersonResponseDto, PersonService } from '@core/services/person.service';
import { PersonDatilsComponent } from '../person-datils/person-datils.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@core/services/auth.service';
import { ClosingDto, ClosingService } from '@core/services/closing.service';
import { LoadingComponent } from '@views/ui/loading/loading.component';
import { MatDialog } from '@angular/material/dialog';
import { ZonaResponseDto, ZonaService } from '@core/services/zona.service'; // IMPORTAR

@Component({
  selector: 'app-person-component',
  imports: [
    PageTitleComponent,
    NgbPaginationModule,
    NgbModalModule,
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    ReactiveFormsModule
  ],
  templateUrl: './person-component.component.html',
  styleUrl: './person-component.component.scss'
})
export class PersonComponentComponent {
  personType!: string;
  persons: PersonResponseDto[] = [];
  filteredPersons: PersonResponseDto[] = [];
  searchTerm: string = '';
  page = 1;
  pageSize = 10;
  loading: boolean = false;
  userRole: string | null = null;
  showModal = false;
  selectedPerson: PersonDataType | null = null;

  // AGREGAR ARRAY DE ZONAS
  zonas: ZonaResponseDto[] = [];

  constructor(
    private modalService: NgbModal,
    private personService: PersonService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private closingService: ClosingService,
    private router: Router,
    private dialog: MatDialog,
    private zonaService: ZonaService // INYECTAR SERVICIO
  ) { }

  ngOnInit(): void {
    this.personType = this.route.snapshot.data['type'];
    this.loadZonas(); // CARGAR ZONAS PRIMERO
    this.fetchPersons();
    this.userRole = this.authService.getUserRole();
  }

  // MÉTODO PARA CARGAR ZONAS
  loadZonas() {
    this.zonaService.getByStatus().subscribe({
      next: (res) => {
        this.zonas = res.data;
      },
      error: (err) => {
        console.error('Error cargando zonas:', err);
      }
    });
  }

  fetchPersons() {
    this.loading = true;

    this.personService.getPersonsByType(this.personType).subscribe({
      next: (response) => {
        this.persons = response.data.map((p: any) => {
          const cleanedPerson = { ...p };

          Object.keys(cleanedPerson).forEach(key => {
            if (
              cleanedPerson[key] === null ||
              cleanedPerson[key] === undefined ||
              String(cleanedPerson[key]).trim() === ''
            ) {
              if (key !== 'status' && key !== 'id') {
                cleanedPerson[key] = '---';
              }
            }
          });

          cleanedPerson.closingsByZona = {};

          return cleanedPerson;
        });

        // CAMBIO IMPORTANTE: Cargar cierres por zona en lugar del método anterior
        if (this.personType === 'ASESOR') {
          this.persons.forEach(person => {
            this.loadTodayClosingsByZona(person);
          });
        }

        this.filteredPersons = [...this.persons];
        this.page = 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener personas', error);
        this.loading = false;
      }
    });
  }

  // private loadTodayClosingForPersons(persons: any[]): void {
  //   if (this.personType !== 'ASESOR') {
  //     return;
  //   }

  //   persons.forEach(person => {
  //     this.closingService.getTodayClosingByPerson(person.id).subscribe({
  //       next: (res) => {
  //         const data = res.data;
  //         if (data) {
  //           person.hasClosingToday = true;
  //           person.closingStatus = data.closingStatus;
  //         } else {
  //           person.hasClosingToday = false;
  //           person.closingStatus = null;
  //         }
  //       },
  //       error: () => {
  //         person.hasClosingToday = false;
  //         person.closingStatus = null;
  //       }
  //     });
  //   });
  // }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredPersons = this.persons.filter(person =>
    (person.firstName?.toLowerCase().includes(term) ||
      person.lastName?.toLowerCase().includes(term) ||
      person.document?.toLowerCase().includes(term) ||
      person.occupation?.toLowerCase().includes(term) ||
      person.maternalLastname?.toLowerCase().includes(term) ||
      person.middleName?.toLowerCase().includes(term) ||
      person.orden?.toString().toLowerCase().includes(term) ||
      person.zona?.toLowerCase().includes(term) ||
      person.celular?.toLowerCase().includes(term) ||
      person.telefono?.toLowerCase().includes(term))
    );
    this.page = 1;
  }

  get pagedPersons(): PersonResponseDto[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredPersons.slice(start, start + this.pageSize);
  }

  openUserModal(person?: PersonRegisterDto) {
    const modalRef = this.modalService.open(PersonCreateComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'custom-modal-size modal-xl'
    });

    modalRef.componentInstance.personType = this.personType;
    if (person) {
      modalRef.componentInstance.personData = person;
    }

    modalRef.result.then(() => {
      this.fetchPersons();
    }).catch(() => { });
  }

  openInfoUserModal(person?: PersonRegisterDto) {
    const modalRef = this.modalService.open(PersonDatilsComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'custom-modal-size modal-xl'
    });

    if (person) {
      modalRef.componentInstance.personData = person;
    }

    modalRef.result.then(() => {
      this.fetchPersons();
    }).catch(() => { });
  }

  onDelete(id: number): void {
    const deleteMsg =
      this.personType === 'ASESOR'
        ? 'Esta acción inactivará al asesor y su usuario asociado.'
        : 'Esta acción inactivará a este cliente.';

    Swal.fire({
      title: '¿Estás seguro?',
      text: deleteMsg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d69130ff',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.personService.deletePerson(id).subscribe({
          next: (res) => {
            Swal.fire('¡Eliminado!', res.message, 'success');
            this.fetchPersons();
          },
          error: (err) => {
            console.error('Error eliminando persona', err);
            Swal.fire('Error', 'Error al eliminar la persona.', 'error');
          }
        });
      }
    });
  }

  changeStatusPerson(event: Event, person: PersonResponseDto): void {
    event.preventDefault();
    event.stopPropagation();

    const action = person.status ? 'inactivar' : 'activar';

    Swal.fire({
      title: `¿Quieres ${action} a este asesor?`,
      text: `El asesor quedará ${person.status ? 'inactivo' : 'activo'}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.personService.toggleStatus(person.id, !person.status).subscribe({
          next: (res) => {
            person.status = !person.status;
            Swal.fire('¡Actualizado!', res.message, 'success');
          },
          error: (err) => {
            Swal.fire('Error', err.error?.details || 'No se pudo actualizar el estado', 'error');
          }
        });
      }
    });
  }

  canDoClosing(): boolean {
    return this.userRole === 'Administrador' || this.userRole === 'BACKOFFICE';
  }

  canCreateClosing(person: any): boolean {
    if (!person.hasClosingToday) {
      return true;
    }
    if (person.closingStatus === 'REJECTED') {
      return true;
    }
    return false;
  }

  canViewClosing(person: any): boolean {
    if (!person.closingsByZona) return false;

    // Retorna true si tiene al menos un cierre que no sea rechazado
    return Object.values(person.closingsByZona).some((closing: any) =>
      closing.hasClosing && closing.closingStatus !== 'REJECTED'
    );
  }

  // MÉTODO PRINCIPAL PARA CREAR CIERRE
  createClosing(person: PersonResponseDto): void {
    const zonaIds = this.getZonaIds(person);

    if (zonaIds.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin zonas asignadas',
        text: 'Este asesor no tiene zonas asignadas. Por favor, actualiza sus datos.',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if (zonaIds.length > 1) {
      this.selectZonaAndCreate(person, zonaIds);
    } else {
      this.confirmAndCreateClosing(person, zonaIds[0]);
    }
  }

  // OBTENER IDs DE ZONAS DEL ASESOR
  getZonaIds(person: any): number[] {
    if (!person.zid) return [];
    return person.zid.split('-')
      .map((z: string) => Number(z))
      .filter((z: number) => !isNaN(z));
  }

  // OBTENER INFORMACIÓN COMPLETA DE LAS ZONAS
  getZonasInfo(person: any): ZonaResponseDto[] {
    const zonaIds = this.getZonaIds(person);
    return this.zonas.filter(z => zonaIds.includes(z.id!));
  }

  // OBTENER NOMBRE DE ZONA POR ID
  getZonaNameById(zonaId: number): string {
    const zona = this.zonas.find(z => z.id === zonaId);
    return zona?.value || zona?.value || `Zona ${zonaId}`;
  }

  // SELECTOR DE ZONA CON NOMBRES REALES
  selectZonaAndCreate(person: PersonResponseDto, zonaIds: number[]): void {
    // Crear opciones con los nombres reales de las zonas
    const inputOptions = zonaIds.reduce((acc: any, zonaId: number) => {
      acc[zonaId] = this.getZonaNameById(zonaId);
      return acc;
    }, {});

    Swal.fire({
      title: 'Selecciona la zona del cierre',
      html: `<p>El asesor <strong>${person.fullName}</strong> tiene asignadas múltiples zonas.</p>
             <p>Selecciona la zona para este cierre:</p>`,
      input: 'select',
      inputOptions: inputOptions,
      inputPlaceholder: 'Seleccione una zona',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes seleccionar una zona';
        }
        return null;
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        this.confirmAndCreateClosing(person, Number(result.value));
      }
    });
  }

  // CONFIRMACIÓN Y CREACIÓN DEL CIERRE
  confirmAndCreateClosing(person: PersonResponseDto, zonaId: number): void {
    const isRestarting = person.hasClosingToday && person.closingStatus === 'REJECTED';
    const zonaName = this.getZonaNameById(zonaId);

    const dto: ClosingDto = {
      personId: person.id,
      closingDate: this.getTodayDate(),
      zonaId: zonaId
    };

    Swal.fire({
      title: isRestarting ? '¿Reiniciar cierre rechazado?' : '¿Iniciar cierre?',
      html: `
        <p>${isRestarting ? 'Se reiniciará' : 'Se iniciará'} el cierre de caja para:</p>
        <p class="fw-bold">${person.fullName || 'el asesor seleccionado'}</p>
        <p class="text-info"><i class="ti ti-map-pin"></i> Zona: ${zonaName}</p>
        ${isRestarting ? '<p class="text-warning"><i class="ti ti-alert-circle"></i> El cierre anterior fue rechazado</p>' : ''}
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: isRestarting ? 'Reiniciar Cierre' : 'Iniciar Cierre',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-secondary'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const dialogRef = this.dialog.open(LoadingComponent, {
          disableClose: true
        });

        this.closingService.create(dto).subscribe({
          next: (response) => {
            const closingId = response.data.id;
            dialogRef.close();

            Swal.fire({
              icon: 'success',
              title: isRestarting ? 'Cierre reiniciado' : 'Cierre iniciado',
              text: `Se ha ${isRestarting ? 'reiniciado' : 'creado'} el cierre correctamente para ${zonaName}`,
              confirmButtonText: 'Ir al Cierre',
              customClass: { confirmButton: 'btn btn-primary' }
            }).then(() => {
              this.router.navigate(['/configuration/closing/', closingId]);
            });
          },
          error: (error) => {
            dialogRef.close();
            console.error('Error al crear cierre', error);

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error?.message || 'No se pudo crear el cierre',
              confirmButtonText: 'Entendido'
            });
          }
        });
      }
    });
  }

  // Carga los cierres del día por cada zona del asesor
  loadTodayClosingsByZona(person: any): void {
    person.closingsByZona = {};

    const zonaIds = this.getZonaIds(person);

    zonaIds.forEach(zonaId => {
      this.closingService
        .getTodayClosingByPersonAndZona(person.id, zonaId)
        .subscribe({
          next: res => {
            if (res.data) {
              person.closingsByZona[zonaId] = {
                hasClosing: true,
                closingStatus: res.data.closingStatus,
                closingId: res.data.closingId
              };
            } else {
              person.closingsByZona[zonaId] = {
                hasClosing: false,
                closingStatus: null
              };
            }
          }
        });
    });
  }


  goToClosing(person: any): void {
    const zonasConCierre: number[] = [];

    // Filtrar zonas que tengan cierre activo
    Object.keys(person.closingsByZona || {}).forEach(zonaId => {
      const closing = person.closingsByZona[Number(zonaId)];
      if (closing.hasClosing && closing.closingStatus !== 'REJECTED') {
        zonasConCierre.push(Number(zonaId));
      }
    });

    if (zonasConCierre.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin cierres',
        text: 'No hay cierres disponibles para hoy'
      });
      return;
    }

    if (zonasConCierre.length === 1) {
      // Si solo hay un cierre, ir directamente
      const closingId = person.closingsByZona[zonasConCierre[0]].closingId;
      this.router.navigate(['/configuration/closing/', closingId]);
    } else {
      // Si hay múltiples, mostrar selector
      const inputOptions = zonasConCierre.reduce((acc: any, zonaId: number) => {
        acc[zonaId] = this.getZonaNameById(zonaId);
        return acc;
      }, {});

      Swal.fire({
        title: 'Selecciona el cierre a ver',
        html: `<p>El asesor <strong>${person.fullName}</strong> tiene múltiples cierres hoy.</p>
             <p>Selecciona la zona:</p>`,
        input: 'select',
        inputOptions: inputOptions,
        inputPlaceholder: 'Seleccione una zona',
        showCancelButton: true,
        confirmButtonText: 'Ver Cierre',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return 'Debes seleccionar una zona';
          }
          return null;
        }
      }).then(result => {
        if (result.isConfirmed && result.value) {
          const closingId = person.closingsByZona[Number(result.value)].closingId;
          this.router.navigate(['/configuration/closing/', closingId]);
        }
      });
    }
  }


  goToSpecificClosing(person: any, zonaId: number): void {
    const closingId = person.closingsByZona[zonaId]?.closingId;
    if (closingId) {
      this.router.navigate(['/configuration/closing/', closingId]);
    }
  }

  private getTodayDate(): string {
    return new Date().toLocaleDateString('en-CA');
  }

  getClosingStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PRE_CIERRE': return 'badge bg-warning text-dark';
      case 'STUDY': return 'badge bg-info text-dark';
      case 'PRE_APPROVED': return 'badge bg-primary text-white';
      case 'APPROVED': return 'badge bg-success';
      case 'REJECTED': return 'badge bg-danger-custom';
      default: return 'badge bg-secondary';
    }
  }

  getClosingStatusText(status: string): string {
    switch (status) {
      case 'PRE_CIERRE': return 'Pre-cierre';
      case 'STUDY': return 'En estudio';
      case 'PRE_APPROVED': return 'Pre-aprobado';
      case 'APPROVED': return 'Aprobado';
      case 'REJECTED': return 'Rechazado';
      default: return 'Desconocido';
    }
  }

  // Obtiene el cierre de una zona específica
  getClosingByZona(person: any, zonaId: number): any {
    return person.closingsByZona?.[zonaId] || { hasClosing: false, closingStatus: null };
  }

  canCreateClosingByZona(person: any, zonaId: number): boolean {
    const closing = this.getClosingByZona(person, zonaId);

    // Puede crear si no tiene cierre o si fue rechazado
    if (!closing.hasClosing) {
      return true;
    }
    if (closing.closingStatus === 'REJECTED') {
      return true;
    }
    return false;
  }

}
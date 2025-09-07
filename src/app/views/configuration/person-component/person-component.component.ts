import { Component } from '@angular/core';
import { CommonModule, LowerCasePipe } from '@angular/common';
import { PageTitleComponent } from '@components/page-title.component';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PersonDataType } from './data';
import { PersonCreateComponent } from '../person-create/person-create.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { PersonRegisterDto, PersonService } from '@core/services/person.service';
import { PatientDetailsComponent } from '@views/hospital/patient-details/patient-details.component';
import { PersonDatilsComponent } from '../person-datils/person-datils.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-person-component',
  imports: [
    PageTitleComponent,
    NgbPaginationModule,
    NgbModalModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './person-component.component.html',
  styleUrl: './person-component.component.scss'
})
export class PersonComponentComponent {
  personType!: string; // ASESOR | CLIENTE

  persons: PersonRegisterDto[] = [];
  filteredPersons: PersonRegisterDto[] = [];
  searchTerm: string = '';
  page = 1;


  newUser = {
    name: '',
    email: ''
  };

  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  selectedPerson: PersonDataType | null = null;


  constructor(private modalService: NgbModal, private personService: PersonService, private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.personType = this.route.snapshot.data['type'];
    this.fetchPersons();
  }


  fetchPersons() {
    this.personService.getPersonsByType(this.personType).subscribe({
      next: (response) => {
        this.persons = response.data;
        this.filteredPersons = [...this.persons];
      },
      error: (error) => {
        console.error('Error al obtener personas', error);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredPersons = this.persons.filter(person =>
    (person.first_name?.toLowerCase().includes(term) || person.last_name?.toLowerCase().includes(term) || person.document?.toLowerCase().includes(term)
      || person.occupation?.toLowerCase().includes(term) || person.maternal_lastname?.toLowerCase().includes(term) || person.middlename?.toLowerCase().includes(term))
    );
  }

  openUserModal(person?: PersonRegisterDto) {
    const modalRef = this.modalService.open(PersonCreateComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'custom-modal-size modal-xl'
    });

    modalRef.componentInstance.personType = this.personType; // 👈 pasamos el tipo
    if (person) {
      modalRef.componentInstance.personData = person;
    }

    modalRef.result.then(() => {
      this.fetchPersons(); // Se refresca lista después de editar
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



}

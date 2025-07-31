import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '@components/page-title.component';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PersonDataType } from './data';
import { PersonCreateComponent } from '../person-create/person-create.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { PersonRegisterDto, PersonService } from '@core/services/person.service';
import { PatientDetailsComponent } from '@views/hospital/patient-details/patient-details.component';

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


  constructor(private modalService: NgbModal, private personService: PersonService) { }

  ngOnInit(): void {
    this.fetchPersons();
  }

  /*openUserModal(content: any) {
    this.modalService.open(content, { centered: true });
  }
    */

  fetchPersons() {
    this.personService.getAllPersons().subscribe({
      next: (response) => {
        this.persons = response.data;
        this.filteredPersons = [...this.persons]; // inicializa filtrado
      },
      error: (error) => {
        console.error('Error al obtener personas', error);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredPersons = this.persons.filter(person =>
    (person.first_name?.toLowerCase().includes(term) ||person.last_name?.toLowerCase().includes(term) ||person.document?.toLowerCase().includes(term))
    );
  }

  openUserModal(person?: PersonRegisterDto) {
    const modalRef = this.modalService.open(PersonCreateComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'custom-modal-size modal-xl'
    });

    if (person) {
      modalRef.componentInstance.personData = person;
    }

    modalRef.result.then(() => {
      this.fetchPersons(); // Se refresca lista después de editar
    }).catch(() => { });
  }

  openInfoUserModal(person?: PersonRegisterDto) {
    const modalRef = this.modalService.open(PatientDetailsComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'custom-modal-size modal-xl'
    });

    if (person) {
      modalRef.componentInstance.personData = person;
    }

    modalRef.result.then(() => {
      this.fetchPersons(); // Se refresca lista después de editar
    }).catch(() => { });
  }

  onDelete(id: number): void {
    const userDelete = 'admin'; // Aquí debe ser el user del token o usuario logueado
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción inactivará a la persona y al usuario asociado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d69130ff',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.personService.deletePerson(id, userDelete).subscribe({
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

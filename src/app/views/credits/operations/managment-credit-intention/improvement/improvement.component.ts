import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { CreditIntentionDocumentResponseDto, CreditIntentionResponseDto, CreditIntentionService, DocumentFilesMapItem, DocumentMetadata } from '@core/services/creditIntention.service';
import { CreditLineDto, CreditLineService } from '@core/services/creditLine.service';
import { FileUploaderComponent } from '@components/file-uploader.component';
import { LoadingComponent } from '@views/ui/loading/loading.component';
import Swal from 'sweetalert2';
import { CreditIntentionStatusService } from '@core/services/creditIntentionStatus.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-improvement',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  templateUrl: './improvement.component.html',
  styleUrl: './improvement.component.scss'
})
export class ImprovementComponent implements OnInit {

  private _credit!: CreditIntentionResponseDto;
  private isLoadingCreditLine = false;
  private lastLoadedCreditLineId: number | null = null;
  documentsComplete: boolean = false;



  @Input()
  set credit(value: CreditIntentionResponseDto) {
    if (!value) return;
    this._credit = value;

    if (
      value.creditLineId &&
      !this.isLoadingCreditLine &&
      this.lastLoadedCreditLineId !== value.creditLineId
    ) {
      this.isLoadingCreditLine = true;
      this.lastLoadedCreditLineId = value.creditLineId;
      this.loadCreditLineDetails(value.creditLineId);
    }
  }

  get credit(): CreditIntentionResponseDto {
    return this._credit;
  }

  @Output() allActivitiesCompleted = new EventEmitter<boolean>();

  isPhaseCompleted = false;

  @ViewChild(MatStepper) stepper!: MatStepper;

  form1!: FormGroup;
  form2!: FormGroup;
  isLinear = true;
  submitted = false;
  errorMessage = '';

  // Línea de crédito completa con documentos requeridos
  creditLineDetails: CreditLineDto | null = null;

  // Map para almacenar documentos
  documentFiles: Map<string, DocumentFilesMapItem> = new Map();
  existingDocuments: CreditIntentionDocumentResponseDto[] = [];

  linkSent: boolean = false;
  sendingLink: boolean = false;
  approvalLink: string = '';

  // Estado de aprobación del cliente
  approvalStatusChecked: boolean = false;
  clientApprovalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' = 'PENDING';
  approvalDate: Date | null = null;
  checkingStatus: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private creditLineService: CreditLineService,
    private creditIntentionService: CreditIntentionService,
    private creditIntencionStatusService: CreditIntentionStatusService

  ) { }

  ngOnInit(): void {

    this.form1 = this.fb.group({
      documents: this.fb.array([])
    });

    this.form2 = this.fb.group({
      linkSent: [false],
      approvalStatus: ['PENDING']
    });

    this.loadApprovalStatus();

  }

  private loadApprovalStatus(): void {
    if (!this.credit?.id) return;

    // Verificar si ya tiene link y estado
    if (this.credit.approvalLink) {
      this.approvalLink = this.credit.approvalLink;
      this.linkSent = true;
      this.form2.get('linkSent')?.setValue(true);
    }

    if (this.credit.approvalStatus) {
      this.clientApprovalStatus = this.credit.approvalStatus;
      this.approvalStatusChecked = true;
      this.form2.get('approvalStatus')?.setValue(this.credit.approvalStatus);
    }

    if (this.credit.approvedAt) {
      this.approvalDate = new Date(this.credit.approvedAt);
    }
  }

  getClientWhatsApp(): string {
    return this._credit?.whatsappNumber ||
      this._credit?.phoneNumber ||
      '';
  }

  resendWhatsAppLink(): void {
    this.sendingLink = true;
    this.errorMessage = '';

    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
    });

    this.creditIntentionService.resendApprovalLink(this.credit.id)
      .subscribe({
        next: (response) => {
          dialogRef.close();
          this.sendingLink = false;

          Swal.fire({
            title: '¡Link Reenviado!',
            text: 'El link de aprobación ha sido reenviado exitosamente.',
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });
        },
        error: (err) => {
          dialogRef.close();
          this.sendingLink = false;

          Swal.fire({
            title: 'Error',
            text: err?.error?.message || 'Error al reenviar el link',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            customClass: {
              confirmButton: 'btn btn-danger'
            }
          });
        }
      });
  }

  get documentsFormArray(): FormArray {
    return this.form1.get('documents') as FormArray;
  }

  /**
   * Cargar detalles completos de la línea de crédito
   */
  private loadCreditLineDetails(creditLineId: number): void {
    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
    });

    this.creditLineService.getById(creditLineId).subscribe({
      next: (response) => {
        this.creditLineDetails = response.data;
        this.loadExistingDocuments(this.credit.id);
        this.isLoadingCreditLine = false;
        dialogRef.close();
        console.log('Línea de crédito cargada:', this.creditLineDetails);
      },
      error: (err) => {
        console.error('Error cargando detalles de línea de crédito:', err);
        this.errorMessage = 'No se pudo cargar la información de la línea de crédito';
        this.isLoadingCreditLine = false;
        dialogRef.close();
      }
    });
  }

  private buildDocumentsForm(): void {
    const docsArray = this.documentsFormArray;
    docsArray.clear();

    this.getRequiredDocumentsWithoutCedula().forEach(doc => {
      docsArray.push(
        this.fb.group({
          documentTypeId: [doc.id],
          documentTypeName: [doc.name],
          file: [null]
        })
      );
    });

    this.updateDocumentsCompleteStatus();
  }



  /**
   * Obtener documentos requeridos desde la línea de crédito
   */
  getRequiredDocuments(): any[] {
    return this.creditLineDetails?.requiredDocuments ?? [];
  }

  /**
   * Verificar si la línea de crédito requiere documentación
   */
  requiresDocumentation(): boolean {
    return this.creditLineDetails?.requireDocumentation ?? false;
  }

  /**
   * Verificar si un documento requiere dos lados (frontal y trasero)
   */
  requiresTwoSides(documentName: string): boolean {
    const twoSidedDocuments = [
      'CÉDULA',
      'CEDULA',
      'CÉDULA DE CIUDADANÍA',
      'CEDULA DE CIUDADANIA',
      'DNI',
      'IDENTIFICACIÓN',
      'IDENTIFICACION'
    ];

    return twoSidedDocuments.some(doc =>
      documentName.toUpperCase().includes(doc)
    );
  }

  /**
   * Manejar cambios en los archivos de documentos
   */
  onDocumentFileChange(files: any[], documentId: number, side: string | null): void {
    const key = `doc_${documentId}`;

    if (!this.documentFiles.has(key)) {
      this.documentFiles.set(key, {});
    }

    const docFiles = this.documentFiles.get(key)!;

    if (side === 'front') {
      docFiles.front = files;
    } else if (side === 'back') {
      docFiles.back = files;
    } else {
      docFiles.single = files;
    }

    console.log('Archivos de documentos actualizados:', this.documentFiles);
  }

  /**
   * Validar que todos los documentos requeridos estén cargados
   */
  validateDocuments(): boolean {
    const requiredDocs = this.getRequiredDocuments();

    for (const doc of requiredDocs) {

      // saltar cédula (ya cargada antes)
      if (this.isCedula(doc.name)) {
        continue;
      }

      const key = `doc_${doc.id}`;
      const files = this.documentFiles.get(key);

      if (!files?.single?.length) {
        this.errorMessage = `Por favor cargue el documento: ${doc.name}`;
        return false;
      }
    }

    return true;
  }

  /**
 * Obtener solo los archivos que fueron modificados para enviar al backend
 */
  getDocumentFilesForUpload(): { files: File[], metadata: DocumentMetadata[] } {
    const files: File[] = [];
    const metadata: DocumentMetadata[] = [];
    let fileIndex = 0;

    this.documentFiles.forEach((docFiles, key) => {
      const documentId = parseInt(key.replace('doc_', ''));

      //Solo incluir documentos que tienen cambios o son nuevos
      if (!docFiles.hasChanges && docFiles.existing) {
        return; // Saltar este documento, ya existe y no cambió
      }

      // Procesar archivo único (el caso más común en tu implementación)
      if (docFiles.single?.length) {
        files.push(docFiles.single[0]);
        metadata.push({
          documentationTypeId: documentId,
          documentSide: 'SINGLE',
          fileIndex: fileIndex++
        });
      }

      // Si necesitas soportar front/back en el futuro
      if (docFiles.front?.length) {
        files.push(docFiles.front[0]);
        metadata.push({
          documentationTypeId: documentId,
          documentSide: 'FRONT',
          fileIndex: fileIndex++
        });
      }

      if (docFiles.back?.length) {
        files.push(docFiles.back[0]);
        metadata.push({
          documentationTypeId: documentId,
          documentSide: 'BACK',
          fileIndex: fileIndex++
        });
      }
    });

    return { files, metadata };
  }

  previousStep(): void {
    if (this.stepper.selected) {
      this.stepper.selected.completed = false;
    }

    this.stepper.previous();

    setTimeout(() => {
      if (this.stepper.selected) {
        this.stepper.selected.completed = false;
      }
    }, 0);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  /**
   * Navegar al siguiente paso
   */
  nextStep(step: number): void {
    this.submitted = true;
    this.errorMessage = '';

    let isValid = false;

    switch (step) {
      case 1:
        isValid = this.validateActividad1();
        break;
      case 2:
        isValid = this.validateActividad2();
        break;
    }

    if (isValid) {
      this.submitted = false;
      this.stepper.next();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Scroll al primer error
      setTimeout(() => {
        const firstInvalid = document.querySelector('.is-invalid, .error-message');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  onSubmitActividad1(): void {
    if (this.submitted) return;

    this.submitted = true;
    this.errorMessage = '';

    // Validar que todos los documentos requeridos estén presentes
    if (!this.validateActividad1()) {
      this.submitted = false;
      return;
    }

    // Verificar si hay cambios que guardar
    if (this.hasDocumentChanges()) {
      this.submitDocuments();
      return;
    }

    //No hay cambios, pasar directamente a la siguiente actividad
    this.submitted = false;
    this.stepper.next();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private validateActividad1(): boolean {
    // Si no requiere documentación, no hay nada que validar
    if (!this.requiresDocumentation()) {
      this.errorMessage = '';
      return true;
    }

    // Validar documentos (nuevos o existentes)
    const requiredDocs = this.getRequiredDocuments();

    for (const doc of requiredDocs) {
      if (this.isCedula(doc.name)) {
        continue;
      }

      const key = `doc_${doc.id}`;
      const files = this.documentFiles.get(key);

      const hasNewFile = files?.single?.length;
      const hasExistingDoc = files?.existing;

      if (!hasNewFile && !hasExistingDoc) {
        this.errorMessage = `Debe cargar el documento: ${doc.name}`;
        return false;
      }
    }

    // Todo bien
    this.errorMessage = '';
    return true;
  }

  private validateActividad2(): boolean {
    this.errorMessage = '';

    if (!this.linkSent) {
      this.errorMessage = 'Debe enviar el link de aprobación al cliente antes de continuar';
      return false;
    }

    if (this.clientApprovalStatus !== 'APPROVED') {
      this.errorMessage = 'El cliente debe aprobar la solicitud antes de continuar. Por favor, consulte el estado de aprobación.';
      return false;
    }

    return true;
  }

  onSubmitActividad2(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (!this.validateActividad2()) {
      setTimeout(() => {
        const firstInvalid =
          document.querySelector('.is-invalid') ||
          document.querySelector('.error-message');

        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
    });

    this.creditIntencionStatusService.updateStatus({
      credit_id: this.credit.id,
      new_status: 'DISBURSEMENT'
    })
      .pipe(
        finalize(() => {
          dialogRef.close();
        })
      )
      .subscribe({
        next: () => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Fase de perfeccionamiento completada correctamente.',
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          }).then(() => {
            this.isPhaseCompleted = true;
            this.allActivitiesCompleted.emit(this.isPhaseCompleted);
            this.stepper.next();
          });
        },
        error: (err) => {
          Swal.fire({
            title: 'Error',
            text: err?.error?.message || 'No se pudo actualizar el estado',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            customClass: {
              confirmButton: 'btn btn-danger'
            }
          });
        },
        complete: () => {
          dialogRef.close();
        }
      });
  }


  /**
 * Documentos requeridos EXCLUYENDO la cédula
 * (porque ya fue cargada en la simulación)
 */
  getRequiredDocumentsWithoutCedula(): any[] {
    const docs = this.creditLineDetails?.requiredDocuments ?? [];

    return docs.filter(doc => !this.requiresTwoSides(doc.name));
  }

  loadExistingDocuments(intentionId: number): void {
    this.creditIntentionService.getDocumentsByIntention(intentionId)
      .subscribe({
        next: (docs) => {
          console.log('Documentos existentes recibidos:', docs);
          this.existingDocuments = docs || [];

          // Primero mapear documentos existentes
          docs.forEach(doc => {
            const key = `doc_${doc.documentationTypeId}`;
            if (!this.documentFiles.has(key)) {
              this.documentFiles.set(key, {} as DocumentFilesMapItem);
            }
            this.documentFiles.get(key)!.existing = doc;
          });

          // LUEGO construir el formulario
          this.buildDocumentsForm();

          this.updateDocumentsCompleteStatus();
        },
        error: (err) => {
          console.error('Error cargando documentos:', err);
          this.existingDocuments = [];
          // Construir el form aunque haya error
          this.buildDocumentsForm();

          this.updateDocumentsCompleteStatus();
        }
      });
  }

  /**
   * Verifica si todos los documentos requeridos están completos
   * (considerando tanto archivos nuevos como documentos existentes)
   */
  areDocumentsComplete(): boolean {
    return this.documentsComplete;
  }

  private checkDocumentsComplete(): boolean {
    // Si no requiere documentación, está completo
    if (!this.requiresDocumentation()) {
      return true;
    }

    const requiredDocs = this.getRequiredDocuments();

    // Si no hay documentos requeridos (sin cédula), está completo
    const docsWithoutCedula = requiredDocs.filter(doc => !this.isCedula(doc.name));
    if (docsWithoutCedula.length === 0) {
      return true;
    }

    // Verificar cada documento requerido
    for (const doc of docsWithoutCedula) {
      const key = `doc_${doc.id}`;
      const docFiles = this.documentFiles.get(key);

      const hasNewFile = docFiles?.single && docFiles.single.length > 0;
      const hasExistingDocument = docFiles?.existing !== undefined && docFiles?.existing !== null;

      // Debe tener al menos uno: archivo nuevo o documento existente
      if (!hasNewFile && !hasExistingDocument) {
        return false;
      }
    }

    return true;
  }

  isCedula(documentName: string): boolean {
    return this.requiresTwoSides(documentName);
  }

  isImage(contentType: string | undefined): boolean {
    return contentType?.startsWith('image/') ?? false;
  }


  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const docCtrl = this.documentsFormArray.at(index);
    const documentId = docCtrl.get('documentTypeId')?.value;

    const key = `doc_${documentId}`;

    // Obtener el item existente o crear uno nuevo
    const existingItem = this.documentFiles.get(key) || {} as DocumentFilesMapItem;

    // Actualizar solo el campo 'single' y marcar que hubo cambio
    this.documentFiles.set(key, {
      ...existingItem,
      single: [file],
      hasChanges: true
    });

    console.log('Archivo seleccionado para:', documentId, file.name);

    this.updateDocumentsCompleteStatus();
  }

  private updateDocumentsCompleteStatus(): void {
    this.documentsComplete = this.checkDocumentsComplete();
  }

  hasDocumentsToUpload(): boolean {
    if (!this.requiresDocumentation()) {
      return false;
    }

    // Excluir cédula
    const docs = this.getRequiredDocuments().filter(
      doc => !this.isCedula(doc.name)
    );

    return docs.length > 0;
  }

  /**

 * Enviar solo los documentos que fueron modificados o son nuevos
 */
  submitDocuments(): void {
    const { files, metadata } = this.getDocumentFilesForUpload();

    if (files.length === 0) {
      this.submitted = false;
      this.stepper.next();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
    });

    this.creditIntentionService
      .uploadDocuments(this.credit.id, files, metadata)
      .subscribe({
        next: () => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Documentos cargados correctamente.',
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          }).then(() => {
            this.stepper.next();
            // Limpiar los flags de cambios después de guardar
            this.clearDocumentChangesFlags();

            this.submitted = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });

          });
        },
        error: (err) => {
          Swal.fire({
            title: 'Error',
            text: err?.error?.message || 'Error al actualizar documentos',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            customClass: {
              confirmButton: 'btn btn-danger'
            }
          });
        },
        complete: () => {
          dialogRef.close();
        }
      });
  }

  /**
 * Limpiar los flags de cambios después de guardar exitosamente
 */
  private clearDocumentChangesFlags(): void {
    this.documentFiles.forEach((docFiles, key) => {
      if (docFiles.hasChanges) {
        docFiles.hasChanges = false;
      }
    });

    this.updateDocumentsCompleteStatus();
  }

  /**
 * Ver documento en nueva pestaña
 */
  viewDocument(doc: CreditIntentionDocumentResponseDto): void {
    const dataUrl = `data:${doc.contentType};base64,${doc.fileDataBase64}`;

    // Para PDFs y la mayoría de archivos
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${doc.fileName}</title>
          <style>
            body { margin: 0; padding: 0; }
            iframe { border: none; width: 100vw; height: 100vh; }
            img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
          </style>
        </head>
        <body>
          ${this.isImage(doc.contentType)
          ? `<img src="${dataUrl}" alt="${doc.fileName}" />`
          : `<iframe src="${dataUrl}" type="${doc.contentType}"></iframe>`
        }
        </body>
      </html>
    `);
      newWindow.document.close();
    }
  }

  /**
   * Descargar documento
   */
  downloadDocument(doc: CreditIntentionDocumentResponseDto): void {
    const dataUrl = `data:${doc.contentType};base64,${doc.fileDataBase64}`;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = doc.fileName;
    link.click();
  }

  /**
 * Verificar si hay documentos nuevos o modificados que necesitan ser guardados
 */
  hasDocumentChanges(): boolean {
    if (!this.requiresDocumentation()) {
      return false;
    }

    const requiredDocs = this.getRequiredDocuments().filter(
      doc => !this.isCedula(doc.name)
    );

    // Verificar si algún documento tiene cambios
    for (const doc of requiredDocs) {
      const key = `doc_${doc.id}`;
      const docFiles = this.documentFiles.get(key);

      // Si tiene el flag hasChanges o tiene un archivo nuevo sin documento existente
      if (docFiles?.hasChanges || (docFiles?.single && !docFiles?.existing)) {
        return true;
      }
    }

    return false;
  }

  //Metodo para generar link de confirmacion de aprobacion de credito y enviarlo al cliente 
  sendWhatsAppLink(): void {
    const whatsapp = this.getClientWhatsApp();

    if (!whatsapp) {
      this.errorMessage = 'No hay número de WhatsApp registrado para este cliente';
      return;
    }

    this.sendingLink = true;
    this.errorMessage = '';

    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
    });

    this.creditIntentionService.sendApprovalLink(this.credit.id, whatsapp)
      .subscribe({
        next: (response) => {
          dialogRef.close();
          this.linkSent = true;
          this.sendingLink = false;
          this.approvalLink = response.approvalLink;
          this.form2.get('linkSent')?.setValue(true);

          Swal.fire({
            title: '¡Link Enviado!',
            html: `
            <p>El link de aprobación ha sido enviado al WhatsApp <strong>${whatsapp}</strong></p>
            <p class="text-muted small">El cliente tiene hasta el ${new Date(response.expiresAt).toLocaleDateString('es-CO')} para responder.</p>
            <div class="mt-3 p-2 bg-light rounded">
              <small class="text-muted">Link generado:</small>
              <div class="text-break small">${response.approvalLink}</div>
            </div>
          `,
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Enviar por WhatsApp',
            customClass: {
              confirmButton: 'btn btn-copy-red'
            }
          }).then((result) => {
            if (result.isConfirmed) {
              this.openWhatsAppWithMessage(whatsapp, response.approvalLink);
            }
          });
        },
        error: (err) => {
          dialogRef.close();
          this.sendingLink = false;
          this.errorMessage = err?.error?.message || 'Error al enviar el link de aprobación';

          Swal.fire({
            title: 'Error',
            text: this.errorMessage,
            icon: 'error',
            confirmButtonText: 'Cerrar',
            customClass: {
              confirmButton: 'btn btn-danger'
            }
          });
        }
      });
  }

  private openWhatsAppWithMessage(phoneNumber: string, approvalLink: string): void {
    // Formatear número (espacios, guiones, paréntesis)
    let formattedPhone = phoneNumber.replace(/\D/g, '');

    // Agregar código de país +57
    if (!formattedPhone.startsWith('57') && formattedPhone.length === 10) {
      formattedPhone = '57' + formattedPhone;
    }

    // mensaje personalizado
    const mensaje = `
    📢 *Credisabe*

      Hola ${this.credit.fullname || 'Cliente'} 👋

      Tu solicitud de crédito *#${this.credit.id}* se encuentra lista para continuar con la siguiente etapa.

      ✅ Completa el proceso aquí: 
      ${approvalLink}

      _Si tienes alguna duda, estamos atentos._
    `.trim();

    // Crear URL de WhatsApp
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(mensaje)}`;

    // Abrir WhatsApp en nueva pestaña
    window.open(whatsappUrl, '_blank');
  }


  // resendWhatsAppLink(): void {
  //   this.sendingLink = true;
  //   this.errorMessage = '';

  //   const dialogRef = this.dialog.open(LoadingComponent, {
  //     disableClose: true,
  //   });

  //   this.creditIntentionService.resendApprovalLink(this.credit.id)
  //     .subscribe({
  //       next: (response) => {
  //         dialogRef.close();
  //         this.sendingLink = false;
  //         this.approvalLink = response.approvalLink;

  //         Swal.fire({
  //           title: '¡Link Reenviado!',
  //           html: `
  //             <p>El link de aprobación ha sido reenviado exitosamente.</p>
  //             <p class="text-muted small">El cliente recibirá un nuevo mensaje de WhatsApp.</p>
  //           `,
  //           icon: 'success',
  //           buttonsStyling: false,
  //           confirmButtonText: 'Aceptar',
  //           customClass: {
  //             confirmButton: 'btn btn-success'
  //           }
  //         });
  //       },
  //       error: (err) => {
  //         dialogRef.close();
  //         this.sendingLink = false;

  //         Swal.fire({
  //           title: 'Error',
  //           text: err?.error?.message || 'Error al reenviar el link',
  //           icon: 'error',
  //           confirmButtonText: 'Cerrar',
  //           customClass: {
  //             confirmButton: 'btn btn-danger'
  //           }
  //         });
  //       }
  //     });
  // }

  //Metodo para obetner el estado de la confirmacion de aprobacion enviada al cliente
  checkApprovalStatus(): void {
    this.checkingStatus = true;
    this.errorMessage = '';

    const dialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
    });

    // Recargar la intención para obtener el estado actualizado
    this.creditIntentionService.getIntentionsById(this.credit.id)
      .subscribe({
        next: (response) => {
          dialogRef.close();
          this.checkingStatus = false;

          const intentions = response.data;

          if (!intentions || intentions.length === 0) {
            this.errorMessage = 'No se encontró la intención de crédito';
            return;
          }

          const intention = intentions[0];
          this.clientApprovalStatus = intention.approvalStatus || 'PENDING';
          this.approvalStatusChecked = true;
          this.form2.get('approvalStatus')?.setValue(this.clientApprovalStatus);

          if (intention.approvedAt) {
            this.approvalDate = new Date(intention.approvedAt);
          }

          // Mostrar mensaje según estado
          if (this.clientApprovalStatus === 'APPROVED') {
            Swal.fire({
              title: '¡Aprobado!',
              text: 'El cliente ha aprobado la solicitud de crédito.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            });
          } else if (this.clientApprovalStatus === 'REJECTED') {

            Swal.fire({
              title: 'Rechazado',
              text: 'El cliente ha rechazado la solicitud de crédito.',
              icon: 'warning',
              confirmButtonText: 'Aceptar',
              customClass: {
                confirmButton: 'btn btn-warning'
              }
            }).then(() => {
              this.creditIntencionStatusService.updateStatus({
                credit_id: this.credit.id,
                new_status: 'RECHAZED'
              }).subscribe({
                next: () => {
                  this.router.navigate(
                    ['/operaciones/intencion'],
                    { replaceUrl: true }
                  );
                },
                error: (err) => {
                  Swal.fire({
                    title: 'Error',
                    text: err?.error?.message || 'No se pudo actualizar el estado del crédito',
                    icon: 'error',
                    confirmButtonText: 'Cerrar',
                    customClass: {
                      confirmButton: 'btn btn-danger'
                    }
                  });
                }
              });

            });
          }
        },
        error: (err) => {
          dialogRef.close();
          this.checkingStatus = false;
          Swal.fire({
            title: 'Error',
            text: err?.error?.message || 'Error al consultar el estado',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            customClass: {
              confirmButton: 'btn btn-danger'
            }
          });
        }
      });
  }

  //Metodo para copiar el link generado
  copyLinkToClipboard(): void {
    if (!this.approvalLink) return;

    navigator.clipboard.writeText(this.approvalLink).then(() => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Link copiado correctamente',
        showConfirmButton: false,
        timer: 2000,
      });
    }).catch(err => {
      console.error('Error al copiar:', err);
    });
  }

  /**
   * Obtener mensaje según el estado de aprobación
   */
  getApprovalStatusMessage(): string {
    switch (this.clientApprovalStatus) {
      case 'APPROVED':
        return 'El cliente ha APROBADO la solicitud de crédito.';
      case 'REJECTED':
        return 'El cliente ha RECHAZADO la solicitud de crédito.';
      case 'PENDING':
        return 'El cliente aún no ha respondido a la solicitud.';
      default:
        return 'Estado desconocido';
    }
  }

  //Validar estado y permitir seguir a la siguiente actividad
  canProceedToNextStep(): boolean {
    // Debe haber enviado el link
    if (!this.linkSent) {
      return false;
    }

    // Y el cliente debe haber aprobado
    return this.clientApprovalStatus === 'APPROVED';
  }

  // Método para resetear cuando cambia de fase
  resetPhase(): void {
    this.isPhaseCompleted = false;
    this.stepper.reset();
  }
}
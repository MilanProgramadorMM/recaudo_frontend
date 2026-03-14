import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import Swal from 'sweetalert2';

export type UploadedFile = {
  name: string;
  size: number;
  type: string;
  dataURL?: string;
  blob?: Blob;
  side?: string;
}

@Component({
  selector: 'FileUploader',
  standalone: true,
  imports: [CommonModule, DropzoneModule],
  template: `
    <div *ngIf="uploadedFiles.length === 0" class="text-center" style="border: 1px solid #ced4da; border-radius: 5px;">

      <div class="dz-message needsclick" style="font-size:0.7rem; cursor:pointer;" (click)="selectFileInputMode($event)">

        <i class="ti ti-cloud-upload mb-2" style="font-size:2rem; color: #ced4da;"></i>

        <h6 class="mb-1 text-muted">
          Suelta la imagen aquí o selecciona.
        </h6>

        <span class="text-muted fs-12" style="font-size:0.8rem;">
          Haz clic para seleccionar
        </span>

      </div>

      <input
        #fileInput
        type="file"
        hidden
        [accept]="acceptedTypes"
        (change)="onFileSelected($event)"
      />

    </div>

    <!-- Preview -->
    <div *ngIf="showPreview && uploadedFiles.length > 0" class="dropzone-previews mt-3">

      <div
        *ngFor="let file of uploadedFiles; let i = index"
        class="card mt-1 mb-0 shadow-none border">

        <div class="p-2">

          <div class="row align-items-center">

            <div class="col-auto">

              <img
                *ngIf="file.type.startsWith('image/')"
                [src]="file.dataURL"
                class="avatar-md rounded bg-light"
              />

            </div>

            <div class="col ps-0">

              <span class="text-muted fw-bold">
                {{ file.name }}
              </span>

              <p class="mb-0">

                <strong>
                  {{ formatFileSize(file.size) }}
                </strong>

                <span *ngIf="file.side" class="badge bg-info ms-2">
                  {{ file.side === 'front' ? 'Frontal' : 'Trasero' }}
                </span>

              </p>

            </div>

            <div class="col-auto">

              <button
                type="button"
                class="btn btn-link btn-lg text-danger p-0"
                (click)="removeFile(i)">

                <i class="ti ti-x"></i>

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  `,
  styles: [`
    .avatar-md {
    width: 100px;   // Más grande
    height: 100px;
    object-fit: cover;
    border: 2px solid #e0e0e0;
  }

    .badge {
      font-size: 0.7rem;
    }
  `]
})
export class FileUploaderComponent implements OnInit {
  @Input() showPreview: boolean = false;
  @Input() acceptedTypes: string = 'image/*,.pdf';
  @Input() side?: string;
  @Input() maxFiles: number = 1;

  @Output() filesChange = new EventEmitter<UploadedFile[]>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  uploadedFiles: UploadedFile[] = [];

  ngOnInit(): void {}

  selectFileInputMode(event: Event) {
    event.preventDefault();
    Swal.fire({
      title: '¿Seleccione cómo desea subir la evidencia?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: '<i style="font-size: 22px;" class="ti ti-camera"></i>',
      cancelButtonText: '<i style="font-size: 22px;" class="ti ti-folder"></i>',
      confirmButtonColor: 'rgb(214, 48, 48)',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.takePhoto();
      }
      if (result.dismiss === Swal.DismissReason.cancel) {
        this.openFileSelector();
      }

    });

  }

  openFileSelector() {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: any) {

    const file = event.target.files[0];
    if (!file) return;

    if (this.uploadedFiles.length >= this.maxFiles) {
      alert(`Solo puedes subir ${this.maxFiles} archivo(s)`);
      return;
    }

    const resized = await this.resizeImage(file);

    const uploaded: UploadedFile = {
      name: file.name,
      size: resized.size,
      type: file.type,
      dataURL: URL.createObjectURL(resized),
      blob: resized,
      side: this.side
    };

    this.uploadedFiles.push(uploaded);

    this.filesChange.emit(this.uploadedFiles);

    this.fileInput.nativeElement.value = '';

  }

  async takePhoto() {
    const photo = await Camera.getPhoto({
      quality: 70,
      width: 1024,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    const resized = await this.resizeImage(blob);

    const uploaded: UploadedFile = {
      name: `photo_${Date.now()}.jpg`,
      size: resized.size,
      type: 'image/jpeg',
      dataURL: URL.createObjectURL(resized),
      blob: resized,
      side: this.side
    };

    this.uploadedFiles.push(uploaded);
    this.filesChange.emit(this.uploadedFiles);  
  }

  compressImage(fileBlob: Blob, maxWidth = 800, quality = 0.6): Promise<Blob> {

    return new Promise((resolve) => {

      const img = new Image();
      img.src = URL.createObjectURL(fileBlob);

      img.onload = () => {

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const scale = maxWidth / img.width;

        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => resolve(blob!),
          "image/jpeg",
          quality
        );

      };

    });

  }

  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
    this.filesChange.emit(this.uploadedFiles);
  }

  formatFileSize(bytes: number): string {

    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];

  }

  getFiles(): UploadedFile[] {
    return this.uploadedFiles;
  }

  clearFiles() {
    this.uploadedFiles = [];
    this.filesChange.emit(this.uploadedFiles);
  }

  async resizeImage(fileBlob: Blob, maxSizeMB = 1): Promise<Blob> {

    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(fileBlob);
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 1280;
        if (width > MAX_WIDTH) {
          const ratio = MAX_WIDTH / width;
          width = MAX_WIDTH;
          height = height * ratio;
        }
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        let quality = 0.9;
        const compress = () => {
          canvas.toBlob((blob) => {
            if (!blob) return;
            const sizeMB = blob.size / (1024 * 1024);
            if (sizeMB > maxSizeMB && quality > 0.3) {
              quality -= 0.1;
              compress();
            } else {
              resolve(blob);
            }
          }, "image/jpeg", quality);
        };
        compress();
      };
    });
  }
}
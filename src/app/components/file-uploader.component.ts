import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

type UploadedFile = {
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
    <!-- Dropzone -->
    <dropzone
      *ngIf="uploadedFiles.length === 0"
      class="dropzone"
      [config]="dropzoneConfig"
      [message]="dropzone"
      (success)="onUploadSuccess($event)">
    </dropzone>

    <!-- Área de vista previa -->
    <div *ngIf="showPreview && uploadedFiles.length > 0" 
         class="dropzone-previews mt-3">
      <div
        *ngFor="let file of uploadedFiles; let i = index"
        class="card mt-1 mb-0 shadow-none border">
        <div class="p-2">
          <div class="row align-items-center">
            <div class="col-auto">
              <img
                [src]="file.dataURL"
                class="avatar-md rounded bg-light"
                alt="preview"
              />
            </div>
            <div class="col ps-0">
              <span class="text-muted fw-bold">{{ file.name }}</span>
              <p class="mb-0">
                <strong>{{ formatFileSize(file.size) }}</strong>
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

  uploadedFiles: UploadedFile[] = [];

  dropzoneConfig: DropzoneConfigInterface = {
    url: 'https://httpbin.org/post',
    maxFilesize: 50,
    maxFiles: 1,
    clickable: true,
    addRemoveLinks: true,
    acceptedFiles: this.acceptedTypes
  };

  dropzone = `<div class="dz-message needsclick" style="font-size: 0.7rem;">
    <i class="ti ti-cloud-upload mb-2" style="font-size: 2rem;"></i>
    <h6 class="mb-1">Suelta la imagen aquí o selecciona.</h6>
    <span class="text-muted fs-12" style="font-size: 0.8rem;">
      haz clic para seleccionar
    </span>
  </div>`;

  ngOnInit(): void {
    if (this.showPreview === true) {
      this.dropzoneConfig.previewsContainer = false;
    }

    this.dropzoneConfig.maxFiles = this.maxFiles;
    this.dropzoneConfig.acceptedFiles = this.acceptedTypes;
  }


  onUploadSuccess(event: any) {
    if (this.uploadedFiles.length >= this.maxFiles) {
      alert(`Solo puedes subir ${this.maxFiles} archivo(s)`);
      return;
    }

    setTimeout(() => {
      const file = event[0];
      if (this.side) {
        file.side = this.side;
      }
      this.uploadedFiles.push(file);
      this.filesChange.emit(this.uploadedFiles);
    }, 0);
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
}
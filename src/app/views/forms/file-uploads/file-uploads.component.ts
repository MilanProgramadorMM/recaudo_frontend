import { Component } from '@angular/core';
import { FileUploaderComponent } from '@components/file-uploader.component';
import { PageTitleComponent } from '@components/page-title.component';

@Component({
  selector: 'file-uploads',
  standalone: true,
  imports: [FileUploaderComponent,PageTitleComponent],
  templateUrl: './file-uploads.component.html',
  styles: ``
})
export class FileUploadsComponent {

}

import type { Route } from "@angular/router";
import { BasicElementsComponent } from "./basic-elements/basic-elements.component";
import { InputMasksComponent } from "./input-masks/input-masks.component";
import { PickerComponent } from "./picker/picker.component";
import { SelectComponent } from "./select/select.component";
import { RangeSliderComponent } from "./range-slider/range-slider.component";
import { ValidationComponent } from "./validation/validation.component";
import { WizardComponent } from "./wizard/wizard.component";
import { FileUploadsComponent } from "./file-uploads/file-uploads.component";
import { EditorsComponent } from "./editors/editors.component";
import { LayoutsComponent } from "./layouts/layouts.component";

export const FORMS_ROUTES: Route[] = [
  {
    path: 'basic-elements',
    component: BasicElementsComponent,
    data: { title: 'Basic Elements' }
  },
  {
    path: 'inputmask',
    component: InputMasksComponent,
    data: { title: 'Input Masks' }
  },
  {
    path: 'picker',
    component: PickerComponent,
    data: { title: 'Form Picker' }
  },
  {
    path: 'select',
    component: SelectComponent,
    data: { title: 'Form Select' }
  },
  {
    path: 'slider',
    component: RangeSliderComponent,
    data: { title: 'Range Slider' }
  },
  {
    path: 'validation',
    component: ValidationComponent,
    data: { title: 'Form Validation' }
  },
  {
    path: 'wizard',
    component: WizardComponent,
    data: { title: 'Form Wizard' }
  },
  {
    path: 'file-uploads',
    component: FileUploadsComponent,
    data: { title: 'File Uploads' }
  },
  {
    path: 'editors',
    component: EditorsComponent,
    data: { title: 'Editors' }
  },
  {
    path: 'layouts',
    component: LayoutsComponent,
    data: { title: 'Layouts' }
  },
]
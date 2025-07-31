import { Component, ViewChild,  ChangeDetectorRef, type OnInit } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { CdkStepperModule, CdkStepper } from '@angular/cdk/stepper'
import { NgStepperComponent, NgStepperModule } from 'angular-ng-stepper'
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule, ReactiveFormsModule, Validators,  FormBuilder, type UntypedFormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'wizard',
  standalone: true,
  imports: [PageTitleComponent,FormsModule,ReactiveFormsModule,NgbProgressbarModule,NgStepperModule,CommonModule,CdkStepperModule],
  templateUrl: './wizard.component.html',
  styles: ``
})
export class WizardComponent implements OnInit{
  myForm!: UntypedFormGroup
  profileForm!: UntypedFormGroup
  submit = false

  @ViewChild('stepper') stepper!: NgStepperComponent
  @ViewChild('cdkSteppers') cdkSteppers!: CdkStepper
  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      repassword: ['', Validators.required],
    })

    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required]],
    })
  }

  ngAfterViewInit() {
    this.updateProgressBarWidth()
  }

  updateProgressBarWidth() {
    if (this.cdkSteppers) {
      const selectedIndex = this.cdkSteppers.selectedIndex || 0
      const stepsLength = this.cdkSteppers.steps.length || 1
      const width = ((selectedIndex + 1) / stepsLength) * 100 + '%'
      const progressBar = document.querySelector('.wizardprogress')
      if (progressBar) {
        ;(progressBar as HTMLElement).style.width = width
      }
      this.cdr.detectChanges()
    }
  }

  get form() {
    return this.myForm.controls
  }

  get secondform() {
    return this.profileForm.controls
  }

  // next step
  nextStep(id: number) {
    this.submit = true
    if (id == 1) {
      if (this.myForm.valid) {
        this.stepper.next()
      }
    } else {
      if (this.profileForm.valid) {
        this.stepper.next()
      }
    }
  }
}

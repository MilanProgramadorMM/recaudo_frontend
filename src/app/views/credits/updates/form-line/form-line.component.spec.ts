import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLineComponent } from './form-line.component';

describe('FormLineComponent', () => {
  let component: FormLineComponent;
  let fixture: ComponentFixture<FormLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

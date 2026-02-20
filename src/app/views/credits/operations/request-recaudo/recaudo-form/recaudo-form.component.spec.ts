import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecaudoFormComponent } from './recaudo-form.component';

describe('RecaudoFormComponent', () => {
  let component: RecaudoFormComponent;
  let fixture: ComponentFixture<RecaudoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecaudoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecaudoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

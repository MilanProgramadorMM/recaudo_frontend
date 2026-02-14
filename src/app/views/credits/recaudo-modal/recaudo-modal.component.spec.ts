import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecaudoModalComponent } from './recaudo-modal.component';

describe('RecaudoModalComponent', () => {
  let component: RecaudoModalComponent;
  let fixture: ComponentFixture<RecaudoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecaudoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecaudoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

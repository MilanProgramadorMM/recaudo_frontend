import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteCarteraModalComponent } from './cliente-cartera-modal.component';

describe('ClienteCarteraModalComponent', () => {
  let component: ClienteCarteraModalComponent;
  let fixture: ComponentFixture<ClienteCarteraModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteCarteraModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteCarteraModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

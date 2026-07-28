import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteCarteraComponentsComponent } from './cliente-cartera-components.component';

describe('ClienteCarteraComponentsComponent', () => {
  let component: ClienteCarteraComponentsComponent;
  let fixture: ComponentFixture<ClienteCarteraComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteCarteraComponentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteCarteraComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

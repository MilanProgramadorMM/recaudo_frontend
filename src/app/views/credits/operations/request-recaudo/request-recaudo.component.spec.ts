import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestRecaudoComponent } from './request-recaudo.component';

describe('RequestRecaudoComponent', () => {
  let component: RequestRecaudoComponent;
  let fixture: ComponentFixture<RequestRecaudoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestRecaudoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestRecaudoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

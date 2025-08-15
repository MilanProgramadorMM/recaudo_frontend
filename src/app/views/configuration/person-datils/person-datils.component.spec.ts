import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonDatilsComponent } from './person-datils.component';

describe('PersonDatilsComponent', () => {
  let component: PersonDatilsComponent;
  let fixture: ComponentFixture<PersonDatilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonDatilsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonDatilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

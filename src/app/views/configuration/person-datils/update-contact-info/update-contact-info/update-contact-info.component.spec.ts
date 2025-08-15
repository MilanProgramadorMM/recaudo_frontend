import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateContactInfoComponent } from './update-contact-info.component';

describe('UpdateContactInfoComponent', () => {
  let component: UpdateContactInfoComponent;
  let fixture: ComponentFixture<UpdateContactInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateContactInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

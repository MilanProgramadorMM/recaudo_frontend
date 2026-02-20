import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StadyComponent } from './stady.component';

describe('StadyComponent', () => {
  let component: StadyComponent;
  let fixture: ComponentFixture<StadyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StadyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StadyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

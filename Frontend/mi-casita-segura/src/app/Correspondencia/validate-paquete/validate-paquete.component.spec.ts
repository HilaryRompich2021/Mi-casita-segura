import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatePaqueteComponent } from './validate-paquete.component';

describe('ValidatePaqueteComponent', () => {
  let component: ValidatePaqueteComponent;
  let fixture: ComponentFixture<ValidatePaqueteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidatePaqueteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidatePaqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

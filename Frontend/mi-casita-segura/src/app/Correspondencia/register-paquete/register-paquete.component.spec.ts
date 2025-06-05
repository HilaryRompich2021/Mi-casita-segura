import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPaqueteComponent } from './register-paquete.component';

describe('RegisterPaqueteComponent', () => {
  let component: RegisterPaqueteComponent;
  let fixture: ComponentFixture<RegisterPaqueteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPaqueteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPaqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

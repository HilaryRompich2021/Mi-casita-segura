import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcedenteAguaComponent } from './excedente-agua.component';

describe('ExcedenteAguaComponent', () => {
  let component: ExcedenteAguaComponent;
  let fixture: ComponentFixture<ExcedenteAguaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcedenteAguaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcedenteAguaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

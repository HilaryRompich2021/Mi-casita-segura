import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitanteResidenteComponent } from './visitante-residente.component';

describe('VisitanteResidenteComponent', () => {
  let component: VisitanteResidenteComponent;
  let fixture: ComponentFixture<VisitanteResidenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitanteResidenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitanteResidenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitanteComponent } from './visitante.component';

describe('VisitanteComponent', () => {
  let component: VisitanteComponent;
  let fixture: ComponentFixture<VisitanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

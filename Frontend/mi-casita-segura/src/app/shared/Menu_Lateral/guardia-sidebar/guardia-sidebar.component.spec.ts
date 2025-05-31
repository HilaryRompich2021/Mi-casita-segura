import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuardiaSidebarComponent } from './guardia-sidebar.component';

describe('GuardiaSidebarComponent', () => {
  let component: GuardiaSidebarComponent;
  let fixture: ComponentFixture<GuardiaSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuardiaSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuardiaSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidenteSidebarComponent } from './residente-sidebar.component';

describe('ResidenteSidebarComponent', () => {
  let component: ResidenteSidebarComponent;
  let fixture: ComponentFixture<ResidenteSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidenteSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidenteSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

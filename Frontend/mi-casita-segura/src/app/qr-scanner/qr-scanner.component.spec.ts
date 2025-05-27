import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScannerQrComponent } from './qr-scanner.component';
import { ZXingScannerModule }   from '@zxing/ngx-scanner';
import { WebSocketService }     from '../services/web-socket.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule }     from '@angular/router/testing';

describe('QrScannerComponent', () => {
  let component: ScannerQrComponent;
  let fixture:   ComponentFixture<ScannerQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [
        ScannerQrComponent,
        ZXingScannerModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],

      providers: [
        WebSocketService
      ]
    })
    .compileComponents();

    fixture   = TestBed.createComponent(ScannerQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

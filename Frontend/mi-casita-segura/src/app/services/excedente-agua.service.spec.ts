import { TestBed } from '@angular/core/testing';

import { ExcedenteAguaService } from './excedente-agua.service';

describe('ExcedenteAguaService', () => {
  let service: ExcedenteAguaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcedenteAguaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

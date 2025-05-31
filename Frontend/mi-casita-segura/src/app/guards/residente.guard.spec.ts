import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { residenteGuard } from './residente.guard';

describe('residenteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => residenteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

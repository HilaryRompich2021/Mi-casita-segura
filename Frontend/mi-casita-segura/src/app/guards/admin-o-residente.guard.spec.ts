import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminOResidenteGuard } from './admin-o-residente.guard';

describe('adminOResidenteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminOResidenteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

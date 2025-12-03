import { TestBed } from '@angular/core/testing';

import { AccessPermissionService } from './access-permission-service';

describe('AccessPermissionService', () => {
  let service: AccessPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

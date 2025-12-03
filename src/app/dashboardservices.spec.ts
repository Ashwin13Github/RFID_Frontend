import { TestBed } from '@angular/core/testing';

import { Dashboardservices } from './dashboardservices';

describe('Dashboardservices', () => {
  let service: Dashboardservices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dashboardservices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

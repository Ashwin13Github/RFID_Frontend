import { TestBed } from '@angular/core/testing';

import { Assettheftservice } from './assettheftservice';

describe('Assettheftservice', () => {
  let service: Assettheftservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Assettheftservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

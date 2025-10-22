import { TestBed } from '@angular/core/testing';

import { Filtering } from './filtering';

describe('Filtering', () => {
  let service: Filtering;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Filtering);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

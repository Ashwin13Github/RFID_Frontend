import { TestBed } from '@angular/core/testing';

import { Libraryservice } from './libraryservice';

describe('Libraryservice', () => {
  let service: Libraryservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Libraryservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

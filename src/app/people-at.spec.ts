import { TestBed } from '@angular/core/testing';

import { PeopleAt } from './people-at';

describe('PeopleAt', () => {
  let service: PeopleAt;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeopleAt);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

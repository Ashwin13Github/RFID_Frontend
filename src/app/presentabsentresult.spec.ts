import { TestBed } from '@angular/core/testing';

import { Presentabsentresult } from './presentabsentresult';

describe('Presentabsentresult', () => {
  let service: Presentabsentresult;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Presentabsentresult);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

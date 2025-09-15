import { TestBed } from '@angular/core/testing';

import { Technologist } from './technologist';

describe('Technologist', () => {
  let service: Technologist;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Technologist);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

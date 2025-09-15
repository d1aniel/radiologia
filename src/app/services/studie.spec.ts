import { TestBed } from '@angular/core/testing';

import { Studie } from './studie';

describe('Studie', () => {
  let service: Studie;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Studie);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

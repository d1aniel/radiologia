import { TestBed } from '@angular/core/testing';

import { Modaliti } from './modaliti';

describe('Modaliti', () => {
  let service: Modaliti;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Modaliti);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

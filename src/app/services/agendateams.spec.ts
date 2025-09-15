import { TestBed } from '@angular/core/testing';

import { Agendateams } from './agendateams';

describe('Agendateams', () => {
  let service: Agendateams;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Agendateams);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { Agendamodality } from './agendamodality';

describe('Agendamodality', () => {
  let service: Agendamodality;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Agendamodality);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

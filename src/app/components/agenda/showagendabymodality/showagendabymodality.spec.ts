import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showagendabymodality } from './showagendabymodality';

describe('Showagendabymodality', () => {
  let component: Showagendabymodality;
  let fixture: ComponentFixture<Showagendabymodality>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showagendabymodality]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Showagendabymodality);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

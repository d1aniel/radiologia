import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createagendabymodality } from './createagendabymodality';

describe('Createagendabymodality', () => {
  let component: Createagendabymodality;
  let fixture: ComponentFixture<Createagendabymodality>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createagendabymodality]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createagendabymodality);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

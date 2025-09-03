import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updateagendabymodality } from './updateagendabymodality';

describe('Updateagendabymodality', () => {
  let component: Updateagendabymodality;
  let fixture: ComponentFixture<Updateagendabymodality>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updateagendabymodality]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updateagendabymodality);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createagendabyteam } from './createagendabyteam';

describe('Createagendabyteam', () => {
  let component: Createagendabyteam;
  let fixture: ComponentFixture<Createagendabyteam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createagendabyteam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createagendabyteam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

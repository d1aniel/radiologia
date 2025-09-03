import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showagendabyteam } from './showagendabyteam';

describe('Showagendabyteam', () => {
  let component: Showagendabyteam;
  let fixture: ComponentFixture<Showagendabyteam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showagendabyteam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Showagendabyteam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

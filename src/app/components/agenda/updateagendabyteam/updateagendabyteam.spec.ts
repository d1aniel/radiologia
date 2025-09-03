import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updateagendabyteam } from './updateagendabyteam';

describe('Updateagendabyteam', () => {
  let component: Updateagendabyteam;
  let fixture: ComponentFixture<Updateagendabyteam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updateagendabyteam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updateagendabyteam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

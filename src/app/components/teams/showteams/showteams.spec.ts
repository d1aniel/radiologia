import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showteams } from './showteams';

describe('Showteams', () => {
  let component: Showteams;
  let fixture: ComponentFixture<Showteams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showteams]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Showteams);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

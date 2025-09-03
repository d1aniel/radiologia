import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createteams } from './createteams';

describe('Createteams', () => {
  let component: Createteams;
  let fixture: ComponentFixture<Createteams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createteams]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createteams);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

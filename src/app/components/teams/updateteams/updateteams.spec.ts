import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updateteams } from './updateteams';

describe('Updateteams', () => {
  let component: Updateteams;
  let fixture: ComponentFixture<Updateteams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updateteams]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updateteams);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

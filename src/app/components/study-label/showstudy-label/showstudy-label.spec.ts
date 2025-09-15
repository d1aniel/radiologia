import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowstudyLabel } from './showstudy-label';

describe('ShowstudyLabel', () => {
  let component: ShowstudyLabel;
  let fixture: ComponentFixture<ShowstudyLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowstudyLabel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowstudyLabel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

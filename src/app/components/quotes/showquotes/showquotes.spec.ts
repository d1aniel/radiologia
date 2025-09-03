import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showquotes } from './showquotes';

describe('Showquotes', () => {
  let component: Showquotes;
  let fixture: ComponentFixture<Showquotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showquotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Showquotes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

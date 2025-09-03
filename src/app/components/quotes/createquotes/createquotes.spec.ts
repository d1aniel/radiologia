import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createquotes } from './createquotes';

describe('Createquotes', () => {
  let component: Createquotes;
  let fixture: ComponentFixture<Createquotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createquotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createquotes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

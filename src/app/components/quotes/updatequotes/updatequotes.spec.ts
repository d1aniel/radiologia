import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updatequotes } from './updatequotes';

describe('Updatequotes', () => {
  let component: Updatequotes;
  let fixture: ComponentFixture<Updatequotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updatequotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updatequotes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

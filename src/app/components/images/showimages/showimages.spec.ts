import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showimages } from './showimages';

describe('Showimages', () => {
  let component: Showimages;
  let fixture: ComponentFixture<Showimages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showimages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Showimages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

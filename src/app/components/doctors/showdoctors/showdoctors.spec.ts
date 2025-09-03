import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showdoctors } from './showdoctors';

describe('Showdoctors', () => {
  let component: Showdoctors;
  let fixture: ComponentFixture<Showdoctors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showdoctors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Showdoctors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

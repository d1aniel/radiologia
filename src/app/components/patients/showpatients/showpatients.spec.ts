import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showpatients } from './showpatients';

describe('Showpatients', () => {
  let component: Showpatients;
  let fixture: ComponentFixture<Showpatients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showpatients]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Showpatients);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

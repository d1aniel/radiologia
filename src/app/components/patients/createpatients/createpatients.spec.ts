import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createpatients } from './createpatients';

describe('Createpatients', () => {
  let component: Createpatients;
  let fixture: ComponentFixture<Createpatients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createpatients]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createpatients);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

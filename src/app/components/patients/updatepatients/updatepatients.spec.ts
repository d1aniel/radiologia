import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updatepatients } from './updatepatients';

describe('Updatepatients', () => {
  let component: Updatepatients;
  let fixture: ComponentFixture<Updatepatients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updatepatients]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updatepatients);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updateparameters } from './updateparameters';

describe('Updateparameters', () => {
  let component: Updateparameters;
  let fixture: ComponentFixture<Updateparameters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updateparameters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updateparameters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

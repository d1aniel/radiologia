import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showparameters } from './showparameters';

describe('Showparameters', () => {
  let component: Showparameters;
  let fixture: ComponentFixture<Showparameters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showparameters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Showparameters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

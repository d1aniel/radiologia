import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createparameters } from './createparameters';

describe('Createparameters', () => {
  let component: Createparameters;
  let fixture: ComponentFixture<Createparameters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createparameters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createparameters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

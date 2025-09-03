import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createuserandroles } from './createuserandroles';

describe('Createuserandroles', () => {
  let component: Createuserandroles;
  let fixture: ComponentFixture<Createuserandroles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createuserandroles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createuserandroles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showuserandroles } from './showuserandroles';

describe('Showuserandroles', () => {
  let component: Showuserandroles;
  let fixture: ComponentFixture<Showuserandroles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showuserandroles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Showuserandroles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

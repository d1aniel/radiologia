import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showreports } from './showreports';

describe('Showreports', () => {
  let component: Showreports;
  let fixture: ComponentFixture<Showreports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showreports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Showreports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showpayments } from './showpayments';

describe('Showpayments', () => {
  let component: Showpayments;
  let fixture: ComponentFixture<Showpayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showpayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Showpayments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createpayments } from './createpayments';

describe('Createpayments', () => {
  let component: Createpayments;
  let fixture: ComponentFixture<Createpayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createpayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createpayments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updatepayments } from './updatepayments';

describe('Updatepayments', () => {
  let component: Updatepayments;
  let fixture: ComponentFixture<Updatepayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updatepayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updatepayments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

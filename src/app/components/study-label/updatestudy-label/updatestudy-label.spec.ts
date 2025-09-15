import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatestudyLabel } from './updatestudy-label';

describe('UpdatestudyLabel', () => {
  let component: UpdatestudyLabel;
  let fixture: ComponentFixture<UpdatestudyLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatestudyLabel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatestudyLabel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatestudyLabel } from './createstudy-label';

describe('CreatestudyLabel', () => {
  let component: CreatestudyLabel;
  let fixture: ComponentFixture<CreatestudyLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatestudyLabel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatestudyLabel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

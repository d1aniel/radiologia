import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createstudies } from './createstudies';

describe('Createstudies', () => {
  let component: Createstudies;
  let fixture: ComponentFixture<Createstudies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createstudies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createstudies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

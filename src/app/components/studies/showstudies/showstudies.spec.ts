import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showstudies } from './showstudies';

describe('Showstudies', () => {
  let component: Showstudies;
  let fixture: ComponentFixture<Showstudies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showstudies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Showstudies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

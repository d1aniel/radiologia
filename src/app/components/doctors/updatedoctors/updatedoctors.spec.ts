import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updatedoctors } from './updatedoctors';

describe('Updatedoctors', () => {
  let component: Updatedoctors;
  let fixture: ComponentFixture<Updatedoctors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updatedoctors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updatedoctors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

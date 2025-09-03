import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createdoctors } from './createdoctors';

describe('Createdoctors', () => {
  let component: Createdoctors;
  let fixture: ComponentFixture<Createdoctors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createdoctors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createdoctors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

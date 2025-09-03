import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createmodalities } from './createmodalities';

describe('Createmodalities', () => {
  let component: Createmodalities;
  let fixture: ComponentFixture<Createmodalities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createmodalities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createmodalities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createtechnologists } from './createtechnologists';

describe('Createtechnologists', () => {
  let component: Createtechnologists;
  let fixture: ComponentFixture<Createtechnologists>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createtechnologists]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createtechnologists);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

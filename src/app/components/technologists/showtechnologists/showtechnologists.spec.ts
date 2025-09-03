import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showtechnologists } from './showtechnologists';

describe('Showtechnologists', () => {
  let component: Showtechnologists;
  let fixture: ComponentFixture<Showtechnologists>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showtechnologists]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Showtechnologists);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

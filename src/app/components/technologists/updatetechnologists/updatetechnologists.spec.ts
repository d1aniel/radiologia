import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updatetechnologists } from './updatetechnologists';

describe('Updatetechnologists', () => {
  let component: Updatetechnologists;
  let fixture: ComponentFixture<Updatetechnologists>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updatetechnologists]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updatetechnologists);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

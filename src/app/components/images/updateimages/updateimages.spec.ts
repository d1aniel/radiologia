import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updateimages } from './updateimages';

describe('Updateimages', () => {
  let component: Updateimages;
  let fixture: ComponentFixture<Updateimages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updateimages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updateimages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

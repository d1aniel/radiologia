import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createimages } from './createimages';

describe('Createimages', () => {
  let component: Createimages;
  let fixture: ComponentFixture<Createimages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createimages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createimages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

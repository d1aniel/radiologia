import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updateuserandroles } from './updateuserandroles';

describe('Updateuserandroles', () => {
  let component: Updateuserandroles;
  let fixture: ComponentFixture<Updateuserandroles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updateuserandroles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updateuserandroles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

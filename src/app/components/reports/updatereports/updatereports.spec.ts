import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updatereports } from './updatereports';

describe('Updatereports', () => {
  let component: Updatereports;
  let fixture: ComponentFixture<Updatereports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updatereports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updatereports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createreports } from './createreports';

describe('Createreports', () => {
  let component: Createreports;
  let fixture: ComponentFixture<Createreports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createreports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createreports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

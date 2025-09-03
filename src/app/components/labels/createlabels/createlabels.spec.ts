import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createlabels } from './createlabels';

describe('Createlabels', () => {
  let component: Createlabels;
  let fixture: ComponentFixture<Createlabels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createlabels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createlabels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

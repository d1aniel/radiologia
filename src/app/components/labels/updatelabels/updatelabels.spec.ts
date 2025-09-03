import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updatelabels } from './updatelabels';

describe('Updatelabels', () => {
  let component: Updatelabels;
  let fixture: ComponentFixture<Updatelabels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updatelabels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updatelabels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

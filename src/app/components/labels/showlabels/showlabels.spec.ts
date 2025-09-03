import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showlabels } from './showlabels';

describe('Showlabels', () => {
  let component: Showlabels;
  let fixture: ComponentFixture<Showlabels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showlabels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Showlabels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

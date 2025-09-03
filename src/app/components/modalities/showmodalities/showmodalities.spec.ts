import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showmodalities } from './showmodalities';

describe('Showmodalities', () => {
  let component: Showmodalities;
  let fixture: ComponentFixture<Showmodalities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showmodalities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Showmodalities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

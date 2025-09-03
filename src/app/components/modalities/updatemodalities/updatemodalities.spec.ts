import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updatemodalities } from './updatemodalities';

describe('Updatemodalities', () => {
  let component: Updatemodalities;
  let fixture: ComponentFixture<Updatemodalities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updatemodalities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updatemodalities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updatestuies } from './updatestuies';

describe('Updatestuies', () => {
  let component: Updatestuies;
  let fixture: ComponentFixture<Updatestuies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updatestuies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updatestuies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

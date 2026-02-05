import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoSnack } from './nuevo-snack';

describe('NuevoSnack', () => {
  let component: NuevoSnack;
  let fixture: ComponentFixture<NuevoSnack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoSnack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoSnack);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

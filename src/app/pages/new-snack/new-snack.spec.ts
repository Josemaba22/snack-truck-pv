import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSnack } from './new-snack';

describe('NewSnack', () => {
  let component: NewSnack;
  let fixture: ComponentFixture<NewSnack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSnack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSnack);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

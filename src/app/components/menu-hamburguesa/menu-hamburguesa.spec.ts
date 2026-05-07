import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHamburguesa } from './menu-hamburguesa';

describe('MenuHamburguesa', () => {
  let component: MenuHamburguesa;
  let fixture: ComponentFixture<MenuHamburguesa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuHamburguesa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuHamburguesa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

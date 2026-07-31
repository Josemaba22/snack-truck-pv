import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { OrdersHistory } from './orders-history';

describe('OrdersHistory', () => {
  let component: OrdersHistory;
  let fixture: ComponentFixture<OrdersHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersHistory],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

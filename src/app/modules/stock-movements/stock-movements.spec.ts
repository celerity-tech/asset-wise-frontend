import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { StockMovements } from './stock-movements';

describe('StockMovements', () => {
  let component: StockMovements;
  let fixture: ComponentFixture<StockMovements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockMovements],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(StockMovements);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

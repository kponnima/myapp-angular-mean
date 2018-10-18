import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { CartService } from './cart.service';

describe('CartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([CartService], (service: CartService) => {
    expect(service).toBeTruthy();
  }));
});

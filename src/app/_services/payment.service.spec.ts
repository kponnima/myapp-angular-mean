import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentService],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([PaymentService], (service: PaymentService) => {
    expect(service).toBeTruthy();
  }));
});

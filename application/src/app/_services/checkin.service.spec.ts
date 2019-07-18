import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { CheckinService } from './checkin.service';

describe('CheckinService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckinService],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([CheckinService], (service: CheckinService) => {
    expect(service).toBeTruthy();
  }));
});

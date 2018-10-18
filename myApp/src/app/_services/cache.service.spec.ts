import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { CacheService } from './cache.service';

describe('CacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CacheService],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([CacheService], (service: CacheService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { TraveldocsService } from './traveldocs.service';

describe('TraveldocsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TraveldocsService],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([TraveldocsService], (service: TraveldocsService) => {
    expect(service).toBeTruthy();
  }));
});

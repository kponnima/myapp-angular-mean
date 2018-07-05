import { TestBed, inject } from '@angular/core/testing';

import { TraveldocsService } from './traveldocs.service';

describe('TraveldocsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TraveldocsService]
    });
  });

  it('should be created', inject([TraveldocsService], (service: TraveldocsService) => {
    expect(service).toBeTruthy();
  }));
});

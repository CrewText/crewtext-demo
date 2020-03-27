import { TestBed } from '@angular/core/testing';

import { VolubleService } from './voluble.service';

describe('VolubleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VolubleService = TestBed.get(VolubleService);
    expect(service).toBeTruthy();
  });
});

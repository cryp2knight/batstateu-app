import { TestBed } from '@angular/core/testing';

import { CustomToolsService } from './custom-tools.service';

describe('CustomToolsService', () => {
  let service: CustomToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

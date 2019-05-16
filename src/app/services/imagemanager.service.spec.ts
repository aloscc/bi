import { TestBed } from '@angular/core/testing';

import { ImagemanagerService } from './imagemanager.service';

describe('ImagemanagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImagemanagerService = TestBed.get(ImagemanagerService);
    expect(service).toBeTruthy();
  });
});

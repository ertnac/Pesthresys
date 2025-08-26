import { TestBed } from '@angular/core/testing';

import { OnnxService } from './onnx.service';

describe('OnnxService', () => {
  let service: OnnxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnnxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

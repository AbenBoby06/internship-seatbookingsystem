import { TestBed } from '@angular/core/testing';

import { CreateSeatRequest } from './create-seat-request';

describe('CreateSeatRequest', () => {
  let service: CreateSeatRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateSeatRequest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

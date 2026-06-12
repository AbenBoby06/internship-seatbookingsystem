import { TestBed } from '@angular/core/testing';

import { BookedSeat } from './booked-seat';

describe('BookedSeat', () => {
  let service: BookedSeat;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookedSeat);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

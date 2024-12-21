import { TestBed } from '@angular/core/testing';

import { ServerSentEventsService } from './server.sent.events.service';

describe('ServerSentEventsService', () => {
  let service: ServerSentEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerSentEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

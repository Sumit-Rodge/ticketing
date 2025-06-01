import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@sumit-r/tic-common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

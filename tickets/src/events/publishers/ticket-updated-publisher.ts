import { Publisher, Subjects, TicketUpdatedEvent } from '@sumit-r/tic-common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

import { Publisher, Subjects, TicketCreatedEvent } from '@sumit-r/tic-common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

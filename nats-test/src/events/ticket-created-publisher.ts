import { Publisher } from '../../../common/src/events/base-defination/base-publisher';
import { Subjects } from '../../../common/src/events/subjects';
import { TicketCreatedEvent } from '../../../common/src/events/events-interfaces/ticket-created-events';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

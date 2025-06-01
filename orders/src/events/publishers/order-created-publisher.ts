import { OrderCreatedEvent, Publisher, Subjects } from '@sumit-r/tic-common';

export class OrderCreatePublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

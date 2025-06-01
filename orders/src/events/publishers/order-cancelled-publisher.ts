import { OrderCancelledEvent, Publisher, Subjects } from '@sumit-r/tic-common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

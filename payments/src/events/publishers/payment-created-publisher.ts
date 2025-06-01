import { PaymentCreatedEvent, Publisher, Subjects } from '@sumit-r/tic-common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

import { Publisher, Subjects, InfoCreatedEvent } from '@naoufalbelhour/skeleton-common';

export class InfoCreatedPublisher extends Publisher<InfoCreatedEvent> {
  subject: Subjects.InfoCreated = Subjects.InfoCreated;
}

import { Publisher, Subjects, InfoUpdatedEvent } from '@naoufalbelhour/skeleton-common';

export class InfoUpdatedPublisher extends Publisher<InfoUpdatedEvent> {
  subject: Subjects.InfoUpdated = Subjects.InfoUpdated;
}

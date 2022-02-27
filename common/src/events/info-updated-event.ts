import { Subjects } from './subjects';

export interface InfoUpdatedEvent {
  subject: Subjects.InfoUpdated;
  data: {
    id: string;
    version: number;
    title: string;
    content: string;
    userId: string;
    orderId?: string;
  };
}

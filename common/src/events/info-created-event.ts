import { Subjects } from './subjects';

export interface InfoCreatedEvent {
  subject: Subjects.InfoCreated;
  data: {
    id: string;
    version: number;
    title: string;
    content: string;
    userId: string;
  };
}

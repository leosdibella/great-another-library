import { IGalEventBinding } from './i-gal-event-binding';

export interface IGalParsedHtml {
  template: string;
  events: IGalEventBinding[];
}

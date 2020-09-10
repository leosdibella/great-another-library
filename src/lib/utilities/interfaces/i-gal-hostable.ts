import { IGalEventBinding } from './i-gal-event-binding';

export interface IGalHostable {
  new (): IGalHostable;
  galHostEvents: IGalEventBinding[];
}

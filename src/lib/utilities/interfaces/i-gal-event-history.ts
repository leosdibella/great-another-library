export interface IGalEventHistory {
  eventName: string;
  eventFunction(customEvent: CustomEvent<unknown>): void;
}

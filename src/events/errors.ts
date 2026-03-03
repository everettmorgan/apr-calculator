import { ViewEvents } from './view-events';

export class InvalidEventError extends Error {
  constructor(event: ViewEvents, data: string) {
    super(`received an invalid event: ${event}: ${data}`);
    this.name = 'InvalidEventError';
  }
}

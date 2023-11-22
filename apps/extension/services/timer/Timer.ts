import { ITimer } from './ITimer';

export class Timer implements ITimer {
  private startTime: number;
  private elapsedTime: number;
  private timerId: NodeJS.Timer | null;

  constructor() {
    this.startTime = 0;
    this.elapsedTime = 0;
    this.timerId = null;
  }

  start() {
    if (!this.timerId) {
      this.startTime = Date.now() - this.elapsedTime;
      this.timerId = setInterval(() => {
        this.elapsedTime = Date.now() - this.startTime;
      }, 1000);
    }
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  getElapsedTime() {
    return this.elapsedTime;
  }

  // This is useful if you want to reset the timer to zero.
  reset() {
    this.elapsedTime = 0;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

export interface ITimer {
  start: () => void;
  stop: () => void;
  reset: () => void;
  getElapsedTime: () => number;
}

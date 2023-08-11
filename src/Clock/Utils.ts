export type ClockSubscriber = () => void;

export enum EditMode {
  NA = 0,
  Hour,
  Minute,
}

export interface AbstactClockController {
  updateClock(): void;
  increment(): void;
  changeMode(): void;
  switchLight(): void;
  switchFormat24(): void;
  reset(): void;
  changeTimeZone(timeZone: number): void;
}

export const TIME_ZONES: number[] = [-10, -5, -2, -1, 0, 1, 2, 5, 10];

export const timeZoneNumberToString = (n: number): string => {
  return n < 0 ? `Etc/GMT${n}` : `Etc/GMT+${n}`;
};

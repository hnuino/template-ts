import { ClockModel } from "./ClockModel";
import { AbstactClockController, EditMode } from "./Types";

export const MINUTE_IN_MILLISECONDS: number = 60 * 1000;
export const HOUR_IN_MILLISECONDS: number = 60 * MINUTE_IN_MILLISECONDS;

export class ClockController implements AbstactClockController {
  constructor(private model: ClockModel) {}

  updateClock = (): void => {
    this.model.date = new Date();
  };

  increment = (): void => {
    if (this.model.editMode === EditMode.Hour) {
      this.model.dateOffset += HOUR_IN_MILLISECONDS;
    } else if (this.model.editMode === EditMode.Minute) {
      this.model.dateOffset += MINUTE_IN_MILLISECONDS;
    }
  };

  changeMode = (): void => {
    const editModeLength: number = Object.keys(EditMode).length / 2;
    const nextValue: EditMode = (this.model.editMode + 1) % editModeLength;
    this.model.editMode = nextValue;
  };

  switchLight = (): void => {
    this.model.lightOn = !this.model.lightOn;
  };

  switchFormat24 = (): void => {
    this.model.format12 = !this.model.format12;
  };

  reset = (): void => {
    this.model.date = new Date();
    this.model.dateOffset = 0;
    this.model.editMode = EditMode.NA;
    this.model.lightOn = false;
  };

  changeTimeZone = (timeZone: string): void => {
    this.model.timeZone = timeZone;
  };
}

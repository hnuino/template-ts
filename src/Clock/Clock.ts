import { ClockController } from "./ClockController";
import { ClockModel } from "./ClockModel";
import { ClockView } from "./ClockView";

export class Clock {
  private model: ClockModel;
  private controller: ClockController;
  private view: ClockView;
  constructor(timeZone: number = 0) {
    this.model = new ClockModel(timeZone);
    this.controller = new ClockController(this.model);
    this.view = new ClockView(this.model, this.controller);
  }

  init(): void {
    this.view.createHtmlElements();
    this.view.display();

    setInterval(this.controller.updateClock, 1000);
  }
}

export function createThenInitClick(timeZone: number = 0): Clock {
  const clock = new Clock(timeZone);
  clock.init();
  return clock;
}

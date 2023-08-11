import { HOUR_IN_MILLISECONDS } from "./ClockController";
import { ClockModel } from "./ClockModel";
import {
  AbstactClockController,
  ClockSubscriber,
  EditMode,
  TIME_ZONES,
} from "./Types";

const DIGIT_EDITION_CSS_CLASS = "edition-in-progress";
const DISPLAY_LIGHT_CSS_CLASS = "enlight";

export class ClockView {
  private digits: {
    hours: HTMLElement;
    minutes: HTMLElement;
    seconds: HTMLElement;
  };
  private displayElement: HTMLElement;
  private modeElement: HTMLElement;
  private incrementElement: HTMLElement;
  private lightElement: HTMLElement;
  private resetElement: HTMLElement;
  private timezoneElement: HTMLElement;
  private format12BoxElement: HTMLElement;
  private format12buttonElement: HTMLElement;

  constructor(
    private model: ClockModel,
    private controller: AbstactClockController
  ) {
    this.digits = {
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds"),
    };
    this.displayElement = document.getElementById("display");
    this.modeElement = document.getElementById("mode-button");
    this.incrementElement = document.getElementById("increment-button");
    this.lightElement = document.getElementById("light-button");
    this.resetElement = document.getElementById("reset-button");
    this.timezoneElement = document.getElementById("timezone-select");
    this.format12BoxElement = document.getElementById("format-12-box");
    this.format12buttonElement = document.getElementById("format-12-button");
  }

  display(): void {
    this.addTimeZoneOptions();

    this.model.subscribe(this.updateTime);
    this.model.subscribe(this.updateFormat12Box);
    this.model.subscribe(this.updateEditionAnimation);
    this.model.subscribe(this.updateLightning);

    this.modeElement.onclick = this.controller.changeMode;
    this.incrementElement.onclick = this.controller.increment;
    this.lightElement.onclick = this.controller.switchLight;
    this.resetElement.onclick = this.controller.reset;
    this.format12buttonElement.onclick = this.controller.switchFormat24;
    this.timezoneElement.onchange = () =>
      this.controller.changeTimeZone(
        (this.timezoneElement as HTMLSelectElement).value
      );
  }

  private updateTime: ClockSubscriber = () => {
    this.digits.hours.textContent = this.getCurrentDigits("hour");
    this.digits.minutes.textContent = this.getCurrentDigits("minute");
    this.digits.seconds.textContent = this.getCurrentDigits("second");
  };

  private updateEditionAnimation: ClockSubscriber = () => {
    const unstyleHours = () => {
      if (this.digits.hours.classList.contains(DIGIT_EDITION_CSS_CLASS)) {
        this.digits.hours.classList.remove(DIGIT_EDITION_CSS_CLASS);
      }
    };
    const styleHours = () => {
      if (!this.digits.hours.classList.contains(DIGIT_EDITION_CSS_CLASS)) {
        this.digits.hours.classList.add(DIGIT_EDITION_CSS_CLASS);
      }
    };
    const unstyleMinutes = () => {
      if (this.digits.minutes.classList.contains(DIGIT_EDITION_CSS_CLASS)) {
        this.digits.minutes.classList.remove(DIGIT_EDITION_CSS_CLASS);
      }
    };
    const styleMinutes = () => {
      if (!this.digits.minutes.classList.contains(DIGIT_EDITION_CSS_CLASS)) {
        this.digits.minutes.classList.add(DIGIT_EDITION_CSS_CLASS);
      }
    };

    if (this.model.editMode === EditMode.Hour) {
      unstyleMinutes();
      styleHours();
    } else if (this.model.editMode === EditMode.Minute) {
      unstyleHours();
      styleMinutes();
    } else {
      unstyleHours();
      unstyleMinutes();
    }
  };

  private updateLightning: ClockSubscriber = () => {
    const turnLightOn = () => {
      if (!this.displayElement.classList.contains(DISPLAY_LIGHT_CSS_CLASS)) {
        this.displayElement.classList.add(DISPLAY_LIGHT_CSS_CLASS);
      }
    };
    const turnLightOff = () => {
      if (this.displayElement.classList.contains(DISPLAY_LIGHT_CSS_CLASS)) {
        this.displayElement.classList.remove(DISPLAY_LIGHT_CSS_CLASS);
      }
    };

    if (this.model.lightOn) turnLightOn();
    else turnLightOff();
  };

  private getUsersGMTOffset = (): number => {
    const now = new Date().toLocaleString("en-US", { timeZone: "GMT" });
    const localOffset = new Date(now).getTimezoneOffset();
    return localOffset / -60;
  };

  private addTimeZoneOptions = (): void => {
    const userTimeZone = this.getUsersGMTOffset();
    const userTimeZoneExists =
      TIME_ZONES.find((v) => v === userTimeZone) !== undefined;

    (userTimeZoneExists ? TIME_ZONES : [...TIME_ZONES, userTimeZone])
      .sort((a, b) => a - b)
      .forEach((n) => {
        const option = document.createElement("option");
        option.value = option.text = n < 0 ? `Etc/GMT${n}` : `Etc/GMT+${n}`;
        this.timezoneElement.appendChild(option);
        if (n === userTimeZone) option.selected = true;
      });
  };

  private getCurrentDigits(digits: "hour" | "minute" | "second"): string {
    const current = new Date(this.model.date.getTime() + this.model.dateOffset);
    return current
      .toLocaleString("en-US", {
        timeZone: this.model.timeZone,
        [digits]: "2-digit",
        formatMatcher: "best fit",
        hour12: this.model.format12,
      })
      .substring(0, 2)
      .padStart(2, "0");
  }

  private updateFormat12Box = (): void => {
    const current = new Date(this.model.date.getTime() + this.model.dateOffset);
    this.format12BoxElement.textContent = current
      .toLocaleString("en-US", {
        timeZone: this.model.timeZone,
        hour: "2-digit",
        formatMatcher: "best fit",
        hour12: this.model.format12,
      })
      .substring(2);
  };
}

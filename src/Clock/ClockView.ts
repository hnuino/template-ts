import { ClockModel } from "./ClockModel";
import {
  AbstactClockController,
  ClockSubscriber,
  EditMode,
  TIME_ZONES,
  timeZoneNumberToString,
} from "./Utils";

const DIGIT_EDITION_CSS_CLASS = "edition-in-progress";
const DISPLAY_LIGHT_CSS_CLASS = "enlight";
type DigitsType = "hours" | "minutes" | "seconds";
type Digits = { [D in DigitsType]: HTMLElement };

export class ClockView {
  private digits: Digits;
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
    this.displayElement = document.getElementById("display");
    this.digits = {
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds"),
    };
    this.modeElement = document.getElementById("mode-button");
    this.incrementElement = document.getElementById("increment-button");
    this.lightElement = document.getElementById("light-button");
    this.resetElement = document.getElementById("reset-button");
    this.timezoneElement = document.getElementById("timezone-select");
    this.format12BoxElement = document.getElementById("format-12-box");
    this.format12buttonElement = document.getElementById("format-12-button");
  }

  createHtmlElements(): void {
    const clocks = document.getElementById("clocks");

    const wrapper = document.createElement("div");
    wrapper.classList.add("clock-wrapper");
    clocks.appendChild(wrapper);

    const container = document.createElement("div");
    container.classList.add("clock-container");
    wrapper.appendChild(container);

    this.displayElement = document.createElement("div");
    this.displayElement.classList.add("clock-display");
    this.displayElement.title = "Clock display";
    container.appendChild(this.displayElement);

    ["hours", "minutes", "seconds"].forEach((digits: DigitsType) => {
      this.digits[digits] = document.createElement("span");
      this.digits[digits].classList.add("digits");
      this.displayElement.appendChild(this.digits[digits]);
      if (digits !== "seconds")
        this.displayElement.appendChild(document.createTextNode(":"));
    });
    this.format12BoxElement = document.createElement("div");
    this.format12BoxElement.classList.add("format-12-box");
    this.displayElement.appendChild(this.format12BoxElement);

    this.resetElement = document.createElement("div");
    this.resetElement.classList.add("button", "top-left");
    container.appendChild(this.resetElement);

    this.modeElement = document.createElement("div");
    this.modeElement.classList.add("button", "top-right");
    container.appendChild(this.modeElement);

    this.lightElement = document.createElement("div");
    this.lightElement.classList.add("button", "bottom-left");
    container.appendChild(this.lightElement);

    this.incrementElement = document.createElement("div");
    this.incrementElement.classList.add("button", "bottom-right");
    container.appendChild(this.incrementElement);

    this.incrementElement = document.createElement("div");
    this.incrementElement.classList.add("button", "bottom-right");
    container.appendChild(this.incrementElement);

    const buttomZone = document.createElement("div");
    buttomZone.classList.add("bottom-zone");
    container.append(buttomZone);

    this.timezoneElement = document.createElement("select");
    buttomZone.appendChild(this.timezoneElement);

    this.format12buttonElement = document.createElement("div");
    this.format12buttonElement.classList.add("format-button");
    this.format12buttonElement.textContent = "Change Format";
    buttomZone.appendChild(this.format12buttonElement);
    this.addTimeZoneOptions();
  }

  display(): void {
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
        Number((this.timezoneElement as HTMLSelectElement).value)
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
    TIME_ZONES.sort((a, b) => a - b).forEach((n) => {
      const option = document.createElement("option");
      option.text = timeZoneNumberToString(n);
      option.value = n.toString();
      this.timezoneElement.appendChild(option);
      if (n === this.model.timeZone) option.selected = true;
    });
  };

  private getCurrentDigits(digits: "hour" | "minute" | "second"): string {
    const current = new Date(this.model.date.getTime() + this.model.dateOffset);
    return current
      .toLocaleString("en-US", {
        timeZone: timeZoneNumberToString(this.model.timeZone),
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
        timeZone: timeZoneNumberToString(this.model.timeZone),
        hour: "2-digit",
        formatMatcher: "best fit",
        hour12: this.model.format12,
      })
      .substring(2);
  };
}

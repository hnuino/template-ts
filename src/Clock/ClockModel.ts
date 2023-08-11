import { ClockSubscriber, EditMode } from "./Types";

export class ClockModel {
  private subscribers: ClockSubscriber[] = [];

  private _timeZone: string = "GMT";
  private _date: Date = new Date();
  private _dateOffset: number = 0;
  private _editMode: EditMode = EditMode.NA;
  private _lightOn: boolean = false;
  private _format12: boolean = true;

  constructor() {}

  get dateOffset() {
    return this._dateOffset;
  }

  set dateOffset(value: number) {
    this._dateOffset = value;
    this.notifySubscribers();
  }

  get date() {
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
    this.notifySubscribers();
  }

  get editMode() {
    return this._editMode;
  }

  set editMode(value: EditMode) {
    this._editMode = value;
    this.notifySubscribers();
  }

  get lightOn() {
    return this._lightOn;
  }

  set lightOn(value: boolean) {
    this._lightOn = value;
    this.notifySubscribers();
  }

  get format12() {
    return this._format12;
  }

  set format12(value: boolean) {
    this._format12 = value;
    this.notifySubscribers();
  }

  get timeZone() {
    return this._timeZone;
  }

  set timeZone(value: string) {
    this._timeZone = value;
    this.notifySubscribers();
  }

  subscribe(subscriber: ClockSubscriber) {
    this.subscribers.push(subscriber);
  }

  private notifySubscribers() {
    this.subscribers.forEach((subscriber) => subscriber());
  }
}

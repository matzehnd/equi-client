import { timeOut } from "../helpers/timeOut";
import { Motor } from "../motor/motor";
import { IsMoovingError } from "./isMoovingError";

export class Door {
  private _motor: Motor;
  private _state: "closed" | "open" | "unknown" = "unknown";
  private _movingTime: number;

  constructor(pinMove: number, pinDirection: number, movingTinge: number) {
    this._motor = new Motor(pinMove, pinDirection);
    this._movingTime = movingTinge;
    this.forceClose();
  }

  public async open() {
    if (this._state === "open") {
      return;
    }
    this._state = "unknown";
    await this._motor.up();
    await timeOut(this._movingTime);
    this._motor.stop();
    this._state = "open";
  }

  public async close() {
    if (this._state === "closed") {
      return;
    }
    this._state = "unknown";
    await this._motor.down();
    await timeOut(this._movingTime);
    this._motor.stop();
    this._state = "closed";
  }

  public async forceClose() {
    this._motor.stop();
    await this._motor.down();
    await timeOut(2 * this._movingTime);
    this._motor.stop();
    this._state = "closed";
  }

  public get state() {
    return this._state;
  }

  public set movingTime(time: number) {
    this._movingTime = time;
  }

  public async switch() {
    if (this._state === "open") {
      return this.close();
    }

    return this.open();
  }
}

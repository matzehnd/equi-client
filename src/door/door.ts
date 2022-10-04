import { Socket } from "socket.io-client";
import { timeOut } from "../helpers/timeOut";
import { Motor } from "../motor/motor";
import { IsMoovingError } from "./isMoovingError";

export class Door {
  private _motor: Motor;
  private _state: "closed" | "open" | "unknown" = "unknown";
  private _movingTime: number;
  private _socket: Socket | undefined;

  constructor(
    pinMove: number,
    pinDirection: number,
    movingTinge: number,
    socket: Socket
  ) {
    this._motor = new Motor(pinMove, pinDirection);
    this._movingTime = movingTinge;
    this._socket = socket;
    this.forceClose();
  }

  public async open() {
    if (this._state === "open") {
      return;
    }
    this.setState("unknown");
    await this._motor.up();
    await timeOut(this._movingTime);
    this._motor.stop();
    this.setState("open");
  }

  public async close() {
    if (this._state === "closed") {
      return;
    }
    this.setState("unknown");
    await this._motor.down();
    await timeOut(this._movingTime);
    this._motor.stop();
    this.setState("closed");
  }

  public async forceClose() {
    this._motor.stop();
    await this._motor.down();
    await timeOut(2 * this._movingTime);
    this._motor.stop();
    this.setState("closed");
  }

  public get state() {
    return this._state;
  }

  private setState(state: "closed" | "open" | "unknown" = "unknown") {
    this._state = state;
    this._socket?.emit("stateChange", { state });
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

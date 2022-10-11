import { timeOut } from "../helpers/timeOut";
import { Motor } from "../motor/motor";
import { Socket } from "../Socket/Socket";

export class Door {
  private _motor: Motor;
  private _state: "closed" | "open" | "unknown" = "unknown";
  private _movingTime: number;
  private _socket: Socket;
  private _timeout: NodeJS.Timeout | undefined;

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
    this._timeout = setTimeout(async () => {
      await this._motor.stop();
      this.setState("open");
    }, this._movingTime);
  }

  public async close() {
    if (this._state === "closed") {
      return;
    }
    this.setState("unknown");
    await this._motor.down();
    this._timeout = setTimeout(async () => {
      await this._motor.stop();
      this.setState("closed");
    }, this._movingTime);
  }

  public async forceClose() {
    await this._motor.stop();
    await this._motor.down();
    await timeOut(2 * this._movingTime);
    await this._motor.stop();
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

  public stop() {
    clearTimeout(this._timeout);
    return this._motor.stop();
  }

  public async moveOrStop() {
    if (this._motor.isMoving) {
      return this.stop();
    }

    if (this._state === "closed") {
      return this.open();
    }

    return this.close();
  }
}

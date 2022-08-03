import { timeOut } from "../helpers/timeOut";
import { Motor } from "../motor/motor";

export class Door {
  private _motor: Motor;
  private _state: "closed" | "open" | "unknown" = "unknown";

  constructor(pinUp: number, pinDown: number) {
    this._motor = new Motor(pinUp, pinDown);
    this.close();
  }

  public async open() {
    if (this._motor.isMoving) {
      console.log("Door is mooving");
      return;
    }
    if (this._state === "open") {
      console.log("Door is allready open");
      return;
    }
    console.log("Door is opening");
    this._motor.up();
    await timeOut(5000);
    this._motor.stop();
    console.log("Door is open");
    this._state = "open";
  }

  public async close() {
    if (this._motor.isMoving) {
      console.log("Door is mooving");
      return;
    }
    if (this._state === "closed") {
      console.log("Door is allready closed");
      return;
    }
    console.log("Door is closing");
    this._motor.down();
    await timeOut(5000);
    this._motor.stop();
    console.log("Door is closed");
    this._state = "closed";
  }

  public get state() {
    return this._state;
  }
}

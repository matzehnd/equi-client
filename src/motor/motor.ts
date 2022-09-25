import { IsMoovingError } from "../door/isMoovingError";
import { timeOut } from "../helpers/timeOut";
import { Relay } from "../relay/relay";

export class Motor {
  private _relayMove: Relay;
  private _relayDirection: Relay;

  constructor(pinMove: number, pinDirection: number) {
    if (pinDirection === pinMove) {
      throw new Error("Relays must not be on same pin");
    }

    this._relayDirection = new Relay(pinDirection);
    this._relayMove = new Relay(pinMove);
  }

  public async up() {
    if (this.isMoving) {
      throw new IsMoovingError();
    }
    await this._relayDirection.close();
    await timeOut(200);
    return this._relayMove.close();
  }

  public async down() {
    if (this.isMoving) {
      throw new IsMoovingError();
    }
    await this._relayDirection.open();
    await timeOut(200);
    return this._relayMove.close();
  }

  public stop() {
    this._relayMove.open();
    this._relayDirection.open();
  }

  public get isMoving() {
    return this._relayMove.state === 0;
  }
}

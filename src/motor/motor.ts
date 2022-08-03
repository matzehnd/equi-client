import { Relay } from "../relay/relay";

export class Motor {
  private _relayUp: Relay;
  private _relayDown: Relay;

  constructor(pinUp: number, pinDown: number) {
    if (pinDown === pinUp) {
      throw new Error("Relays must not be on same pin");
    }

    this._relayDown = new Relay(pinDown);
    this._relayUp = new Relay(pinUp);
  }

  public up() {
    if (this.isMoving) {
      throw new Error("motor is mooving");
    }
    this._relayUp.close();
  }

  public down() {
    if (this.isMoving) {
      throw new Error("motor is mooving");
    }
    this._relayDown.close();
  }

  public stop() {
    this._relayDown.open();
    this._relayUp.open();
  }

  public get isMoving() {
    return this._relayDown.state || this._relayUp.state;
  }
}

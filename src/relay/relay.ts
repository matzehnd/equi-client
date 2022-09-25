import { Gpio } from "onoff";

export class Relay {
  private _state: 0 | 1 = 1;
  private _gpio: Gpio | undefined;
  private _pin: number;

  constructor(pin: number) {
    this._pin = pin;
    if (Gpio.accessible) {
      this._gpio = new Gpio(this._pin, "out");
      this.writeState();
      process.on("SIGINT", () => {
        this._gpio?.unexport();
      });
    }
  }

  public get state() {
    return this._state;
  }

  public async open() {
    await this.syncState();
    if (this._state === 1) {
      return;
    }
    this._state = 1;
    return this.writeState();
  }

  public async close() {
    await this.syncState();
    if (this._state === 0) {
      return;
    }
    this._state = 0;
    return this.writeState();
  }

  private async syncState() {
    if (!this._gpio) {
      return;
    }

    this._state = await this._gpio.read();
  }

  private writeState() {
    return this._gpio?.write(this._state);
  }
}

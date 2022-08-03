import { Gpio } from "onoff";

export class Relay {
  private _pin: number;
  private _stat: 0 | 1 = 0;
  private _gpio;

  constructor(pin: number) {
    this._pin = pin;
    if (Gpio.accessible) {
      this._gpio = new Gpio(pin, "out");
      process.on("SIGINT", () => {
        this._gpio?.unexport();
      });
    }
  }

  public get state() {
    return this._stat;
  }

  public open() {
    this.sync();
    if (this._stat === 0) {
      return;
    }
    this._stat = 0;
    this.writeSync();
  }

  public close() {
    this.sync();
    if (this._stat === 1) {
      return;
    }
    this._stat = 1;
    this.writeSync();
  }

  private sync() {
    if (!this._gpio) {
      return;
    }

    this._stat = this._gpio.readSync();
  }

  private writeSync() {
    console.log(`${this._stat ? "close" : "open"} relais on pin ${this._pin}`);
    this._gpio?.writeSync(this._stat);
  }
}

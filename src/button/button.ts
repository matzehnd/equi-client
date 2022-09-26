import { Gpio, ValueCallback } from "onoff";

export class Button {
  private _gpio: Gpio | undefined;
  private _pin: number;

  constructor(pin: number, callback: ValueCallback) {
    this._pin = pin;
    if (Gpio.accessible) {
      this._gpio = new Gpio(this._pin, "in", "rising", {
        debounceTimeout: 100,
      });
      this._gpio.watch(callback);
      process.on("SIGINT", () => {
        this._gpio?.unexport();
      });
    }
  }
}

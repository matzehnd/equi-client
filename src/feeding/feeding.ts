import { CronJob } from "cron";
import { Door } from "../door/door";

export class Feeding {
  private _feeding: {
    hour: number;
    minute: number;
    length: number;
  };
  private _openCron: CronJob | undefined;
  private _closeCron: CronJob | undefined;
  private _door: Door;

  constructor(
    feeding: {
      hour: number;
      minute: number;
      length: number;
    },
    door: Door
  ) {
    this._feeding = feeding;
    this._door = door;
  }

  public activate() {
    this.setCronJobs();
    console.log("activated :>> ", this.feedingInfo);
  }

  private setCronJobs() {
    this._openCron?.stop();
    this._closeCron?.stop();
    this._openCron = new CronJob(
      `0 ${this._feeding.minute} ${this._feeding.hour} * * *`,
      () => {
        this.openDoor();
      },
      undefined,
      true,
      "Europe/Zurich"
    );
    const closeTime = {
      hour:
        this._feeding.hour + Math.floor(Math.floor(this._feeding.length) / 60),
      minute: (this._feeding.minute + this._feeding.length) % 60,
    };
    this._closeCron = new CronJob(
      `0 ${closeTime.minute} ${closeTime.hour} * * *`,
      () => {
        this.closeDoor();
      },
      undefined,
      true,
      "Europe/Zurich"
    );
  }

  private openDoor() {
    try {
      this._door.open();
    } catch (error) {
      console.log("error :>> ", error);
    }
  }

  private closeDoor() {
    try {
      this._door.close();
    } catch (error) {
      console.log("error :>> ", error);
    }
  }

  public deactivate() {
    this._closeCron?.stop();
    this._openCron?.stop();
    console.log("deactivated :>> ", this.feedingInfo);
  }

  public get feedingInfo() {
    return this._feeding;
  }
}

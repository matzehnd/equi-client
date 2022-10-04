import { Feeding } from "./feeding";
import * as fs from "fs";
import { Door } from "../door/door";

export class Feedings {
  private _feedings: Feeding[] = [];
  private _door: Door;

  constructor(door: Door) {
    this._door = door;
    this.loadPersistedData();
  }

  public setFeedings(feedings: Feeding[]) {
    this.resetFeedings(feedings);
    this.persistData();
  }

  private resetFeedings(feedings: Feeding[]) {
    this._feedings.forEach((feeding) => feeding.deactivate());
    this._feedings.length = 0;
    this._feedings.push(...feedings);
    this._feedings.forEach((feeding) => feeding.activate());
  }

  private persistData() {
    fs.writeFile("feedingTimes.json", this.getFeedingsJson(), () => {});
  }

  private getFeedingsJson() {
    return JSON.stringify(this._feedings.map((feeding) => feeding.feedingInfo));
  }

  private loadPersistedData() {
    if (!fs.existsSync("feedingTimes.json")) {
      return;
    }
    const feedingTimes: { hour: number; minute: number; length: number }[] =
      JSON.parse(fs.readFileSync("feedingTimes.json", {}).toString());
    this.setFeedings(
      feedingTimes.map((feeding) => new Feeding(feeding, this._door))
    );
  }
}

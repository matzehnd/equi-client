import { CronJob } from "cron";
import { Button } from "./button/button";

import { Door } from "./door/door";
import { Feeding } from "./feeding/feeding";

const door = new Door(17, 4, 5000);
const button = new Button(27, async (err) => {
  if (err) {
    console.log("err :>> ", err);
    return;
  }
  try {
    await door.switch();
  } catch (error) {
    console.log("error :>> ", error);
  }
});

const feeding = new Feeding({ hour: 23, minute: 39, length: 1 }, door);
feeding.start();

process.stdin.addListener("data", async (data) => {
  console.log("data.toString() :>> ", data.toString());
  if (data.toString().replace(/[\n\r]/g, "") === "8") {
    console.log("Please open door");
    try {
      await door.open();
    } catch (error) {
      console.log("error :>> ", error);
    }
  }
  if (data.toString().replace(/[\n\r]/g, "") === "2") {
    console.log("Please close door");
    try {
      await door.close();
    } catch (error) {
      console.log("error :>> ", error);
    }
  }

  if (data.toString().replace(/[\n\r]/g, "") === "5") {
    console.log("Please move door");
    try {
      await door.switch();
    } catch (error) {
      console.log("error :>> ", error);
    }
  }
});

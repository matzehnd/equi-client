import { Button } from "./button/button";

import { Door } from "./door/door";
import { feedingTimeTO } from "./interfaces/feedingTimeTO";
import { Feeding } from "./feeding/feeding";
import { Feedings } from "./feeding/feedings";
import { Socket } from "./Socket/Socket";

const socket = new Socket("https://equi-management-staging.herokuapp.com/");

const door = new Door(17, 4, 5000, socket);
const button = new Button(27, async (err) => {
  if (err) {
    console.log("err :>> ", err);
    return;
  }
  try {
    await door.moveOrStop();
  } catch (error) {
    console.log("error :>> ", error);
  }
});

const feedings = new Feedings(door);

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("feedingTimes", (feedingTimes: feedingTimeTO[]) => {
  feedings.setFeedings(
    feedingTimes.map(
      (feedingTime) =>
        new Feeding(
          {
            hour: feedingTime.startHours,
            minute: feedingTime.startMinutes,
            length: feedingTime.length,
          },
          door
        )
    )
  );
});

socket.on("config", (data) => {
  console.log(data);
});

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
      await door.moveOrStop();
    } catch (error) {
      console.log("error :>> ", error);
    }
  }
});

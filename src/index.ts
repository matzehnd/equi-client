import { Door } from "./door/door";

const door = new Door(23, 24);

process.stdin.addListener("data", (data) => {
  console.log("data.toString() :>> ", data.toString());
  if (data.toString().replace(/[\n\r]/g, "") === "8") {
    console.log("Please open door");
    door.open();
  }
  if (data.toString().replace(/[\n\r]/g, "") === "2") {
    console.log("Please close door");
    door.close();
  }
});

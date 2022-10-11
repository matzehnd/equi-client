import { io, Socket as IOSocket } from "socket.io-client";

import { Buffer } from "../Buffer/Buffer";

export class Socket {
  private _socket: IOSocket;
  private _unsentMessages: Buffer<{ event: string; body: any }> = new Buffer(
    10
  );

  constructor(url: string) {
    this._socket = io(url, {
      auth: {
        token: "a1a5ef14-bb6d-45d2-8a4b-24a0776d7b3a",
      },
    });
    this._socket.on("connected", this.reEmit);
  }

  private reEmit() {
    while (!this._unsentMessages.isEmtpy && this._socket.connected) {
      const message = this._unsentMessages.shift();
      if (!message) {
        break;
      }
      this.emit(message.event, message.body);
    }
  }

  public emit(event: string, body: any) {
    if (!this._socket.connected) {
      this._unsentMessages.push({ event, body });
      return;
    }

    console.log("event :>> ", event, ": ", body);
    this._socket.emit(event, body);
  }

  public on(event: string, callback: (body: any) => void) {
    this._socket.on(event, callback);
  }

  public get id(): string {
    return this._socket.id;
  }
}

import { WebSocket } from "ws";

export class Socket {
  constructor (private readonly webSocket: WebSocket) {}

  public send(data: Record<string, any>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.webSocket.send(JSON.stringify(data), error => error ? reject(error) : resolve(null));
    });
  }
}

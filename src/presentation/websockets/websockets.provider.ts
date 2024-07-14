import { Injectable, Scope } from "@nestjs/common";
import { Socket } from "./socket";

@Injectable({ durable: true, scope: Scope.DEFAULT })
export class WebSocketsProvider {
  private static instance: WebSocketsProvider;

  private sockets: Map<number, Socket>;

  constructor () {
    this.sockets = new Map<number, Socket>();
  }

  public static getInstance() {
    if (!WebSocketsProvider.instance) {
      WebSocketsProvider.instance = new WebSocketsProvider();
    }

    return WebSocketsProvider.instance;
  }

  public set(id: number, socket: Socket) {
    this.sockets.set(id, socket);
  }

  public get(id: number) {
    return this.sockets.get(id);
  }

  public delete(id: number) {
    this.sockets.delete(id);
  }
}

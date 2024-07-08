import { Injectable, Scope } from "@nestjs/common";
import { WebSocket } from "ws";

@Injectable({ durable: true, scope: Scope.DEFAULT })
export class WebSocketsProvider {
  private static instance: WebSocketsProvider;

  private sockets: Map<number, WebSocket>;

  constructor () {
    this.sockets = new Map<number, WebSocket>();
  }

  public static getInstance() {
    if (!WebSocketsProvider.instance) {
      WebSocketsProvider.instance = new WebSocketsProvider();
    }

    return WebSocketsProvider.instance;
  }

  public set(id: number, socket: WebSocket) {
    this.sockets.set(id, socket);
  }

  public get(id: number) {
    return this.sockets.get(id);
  }

  public delete(id: number) {
    this.sockets.delete(id);
  }
}

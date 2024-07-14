import { IncomingMessage } from "node:http";

import { Inject, Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

import { WebSocket, WebSocketServer as WSS } from 'ws';
import { JwtProvider } from "@/app/interfaces/auth/jwt/jwt.provider";
import { Admin } from "@/domain/entities/admin";
import { Reader } from "@/domain/entities/reader";
import { User } from "@/domain/entities/user";
import { WebSocketsProvider } from "./websockets.provider";
import { Socket } from "./socket";

@WebSocketGateway()
export class WebSocketGatewayProvider implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(WebSocketGatewayProvider.name);

  constructor (
    @Inject(JwtProvider) private readonly jwtProvider: JwtProvider,
    private readonly socketsMap: WebSocketsProvider,
  ) {}

  afterInit(server: WSS) {
    Logger.log('Websocket server initialized');
  }

  async handleConnection(client: WebSocket, request: IncomingMessage) {
    Logger.log('Connected');

    const token = request.headers['authorization']?.split(' ').at(1);

    if (!token) {
      client.close();
      return;
    }

    let payload: User;

    try {
      payload = await this.jwtProvider.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      Logger.error('Error while authenticating', error);

      return client.close();
    }

    if (payload.type === 'reader') {
      payload = new Reader(payload);
    } else {
      payload = new Admin(payload);
    }

    const socketWrapper = new Socket(client);

    this.socketsMap.set(payload.id, socketWrapper);

    client.send(JSON.stringify({
      type: 'user-connected',
      data: {
        id: payload.id,
        name: payload.name,
        type: payload.type,
      },
    }))

    client.on('close', () => {
      this.socketsMap.delete(payload.id);
    });

    this.logger.log('Authenticated');
  }

  handleDisconnect(client: WebSocket) {
    this.logger.log('Disconnected');
  }
}

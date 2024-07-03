import { JwtProvider } from "@/app/interfaces/auth/jwt/jwt.provider";
import { Admin } from "@/domain/entities/admin";
import { Reader } from "@/domain/entities/reader";
import { User } from "@/domain/entities/user";
import { Inject, Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway } from "@nestjs/websockets";
import { IncomingMessage } from "http";

import { WebSocket } from 'ws';

@WebSocketGateway()
export class WebSocketGatewayProvider implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor (
    @Inject(JwtProvider) private readonly jwtProvider: JwtProvider,
  ) {}

  afterInit(server: any) {
    Logger.log('Websocket server initialized');
  }

  async handleConnection(client: WebSocket, message: IncomingMessage) {
    Logger.log('Connected');
  }

  handleDisconnect(client: WebSocket) {
    Logger.log('Disconnected');
  }
}

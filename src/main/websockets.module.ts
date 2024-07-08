import { JwtProvider } from "@/app/interfaces/auth/jwt/jwt.provider";
import { JwtProviderImpl } from "@/infra/auth/jwt/jwt.provider";
import { WebSocketsProvider } from "@/presentation/websockets/websockets.provider";
import { WebSocketGatewayProvider } from "@/presentation/websockets/websockets.gateway";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    {
      provide: JwtProvider,
      useClass: JwtProviderImpl,
    },
    {
      provide: WebSocketsProvider,
      useValue: WebSocketsProvider.getInstance(),
    },
    WebSocketGatewayProvider,
  ],
  exports: [
    WebSocketGatewayProvider,
  ],
})
export class WebSocketsModule {}

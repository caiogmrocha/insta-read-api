import { JwtProvider } from "@/app/interfaces/auth/jwt/jwt.provider";
import { JwtProviderImpl } from "@/infra/auth/jwt/jwt.provider";
import { WebSocketGatewayProvider } from "@/presentation/websockets/websockets.gateway";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    {
      provide: JwtProvider,
      useClass: JwtProviderImpl,
    },
    WebSocketGatewayProvider,
  ],
  exports: [
    WebSocketGatewayProvider,
  ],
})
export class WebSocketsModule {}

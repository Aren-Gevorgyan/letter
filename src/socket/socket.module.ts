import { Module } from '@nestjs/common';
import { MessengerGateway } from './socket.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [MessengerGateway],
})
export class SocketModule {}

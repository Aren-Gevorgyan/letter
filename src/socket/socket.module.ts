import { Module } from '@nestjs/common';
import { MessengerGateway } from './socket.gateway';
import { FirebaseAuthStrategy } from 'src/firebase/firebase-auth.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Messages, MessagesSchema } from 'src/schemas/messages.schema';
import { SocketService } from './socket.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Messages.name, schema: MessagesSchema },
    ]),
  ],
  controllers: [],
  providers: [MessengerGateway, FirebaseAuthStrategy, SocketService],
})
export class SocketModule {}

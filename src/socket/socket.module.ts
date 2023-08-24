import { Module } from '@nestjs/common';
import { MessengerGateway } from './socket.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Messages, MessagesSchema } from 'src/schemas/messages.schema';
import { SocketService } from './socket.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase-auth';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Messages.name, schema: MessagesSchema },
    ]),
  ],
  controllers: [],
  providers: [MessengerGateway, SocketService, FirebaseService],
})
export class SocketModule {}

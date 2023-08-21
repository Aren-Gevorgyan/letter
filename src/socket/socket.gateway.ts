import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';
import { FirebaseAuthStrategy } from 'src/firebase/firebase-auth.strategy';
import { SocketService } from './socket.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
@UseGuards(FirebaseAuthGuard)
export class MessengerGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly firebaseAuthStrategy: FirebaseAuthStrategy,
    private readonly socketService: SocketService,
  ) {}
  @WebSocketServer() server: Server;

  private connectedClients: Map<string, Socket> = new Map();

  afterInit() {
    console.log('WebSocket gateway initialized');
  }

  async handleConnection(client: any, ...args: any[]) {
    const authHeader = client.handshake.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split(' ')[1];

      try {
        const user = await this.firebaseAuthStrategy.defaultApp
          .auth()
          .verifyIdToken(idToken, true);
        console.log(user, 'user');

        this.connectedClients.set(client.id, client);

        // Proceed with socket connection
        // console.log('User authenticated:', decodedToken.uid);
      } catch (error) {
        // Reject socket connection
        console.error('Authentication failed:', error.message);
        client.disconnect(true);
      }
    } else {
      // Reject socket connection
      console.error('Missing or invalid authentication header');
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('newMessage')
  handleMessage(client: Socket, message: string) {
    console.log(`Received message from ${client.id}: ${message}`);
    this.socketService.create({
      text: message,
      writerId: 'sdsd454s5ds5d45s',
    });
    this.server.emit('message', message);
  }
}

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
} from '@nestjs/websockets';
import * as firebase from 'firebase-admin';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { FirebaseService } from 'src/firebase/firebase-auth';
import { MySocket } from 'src/common/interface';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class MessengerGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private auth: firebase.auth.Auth;
  constructor(
    private readonly socketService: SocketService,
    private firebaseApp: FirebaseService,
  ) {
    this.auth = firebaseApp.getAuth();
  }
  @WebSocketServer() server: Server;

  private connectedClients: Map<string, Socket> = new Map();

  afterInit() {
    console.log('WebSocket gateway initialized');
  }

  async handleConnection(client: MySocket) {
    const authHeader = client.handshake.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split(' ')[1];

      try {
        const user = await this.auth.verifyIdToken(idToken, true);
        client.user = user;
        this.connectedClients.set(client.id, client);
      } catch (error) {
        // Reject socket connection
        console.error('Authentication failed:', error.message);
        client.emit('connectionError', {
          message: 'Authentication token not provided',
        });
        client.disconnect(true);
      }
    } else {
      // Reject socket connection
      client.emit('connectionError', {
        message: 'Authentication token not provided',
      });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('newMessage')
  handleMessage(client: MySocket, message: string) {
    console.log(`Received message from ${client.id}: ${message}`);
    this.socketService.create({
      text: message,
      writerId: client?.user?.user_id,
    });
    this.server.emit('message', message);
  }
}

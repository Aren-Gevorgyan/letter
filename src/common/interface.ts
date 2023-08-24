import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { Socket } from 'socket.io';

export interface MySocket extends Socket {
  user?: DecodedIdToken;
}

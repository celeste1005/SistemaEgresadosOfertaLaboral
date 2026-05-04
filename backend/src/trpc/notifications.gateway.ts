import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('NotificationsGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribeToNotifications')
  handleSubscription(client: Socket, payload: { userId: string }) {
    client.join(`user_${payload.userId}`);
    return { event: 'subscribed', data: true };
  }

  // Método para enviar notificaciones desde otros servicios
  sendNotification(userId: string, notification: any) {
    this.server.to(`user_${userId}`).emit('notification', notification);
  }

  broadcastNotification(notification: any) {
    this.server.emit('broadcast', notification);
  }
}

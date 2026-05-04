import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    afterInit(server: Server): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    handleSubscription(client: Socket, payload: {
        userId: string;
    }): {
        event: string;
        data: boolean;
    };
    sendNotification(userId: string, notification: any): void;
    broadcastNotification(notification: any): void;
}

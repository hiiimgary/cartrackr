import { Injectable, Logger } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { PushNotification } from './types/push-notification.types';

@Injectable()
export class NotificationService {
  logger = new Logger('Notification');
  sendPushNotification(tokens: string[], payload: PushNotification) {
    this.logger.log(
      `Sending push notification to ${tokens.length} devices: ${payload.notification.title}, ${payload.notification.body}`
    );

    if (tokens.length === 0) {
      return;
    }

    firebase
      .messaging()
      .sendEach(tokens.map((t) => ({ token: t, ...payload })))
      .catch((error) => {
        this.logger.error(error);
      })
      .then((response) => {
        this.logger.log(response);
      });
  }
}

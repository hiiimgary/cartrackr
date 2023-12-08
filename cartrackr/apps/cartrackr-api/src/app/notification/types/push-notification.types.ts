export type PushNotification = {
  data?: {
    [key: string]: string;
    type: PushNotificationType;
  };
  notification: {
    title: string;
    body: string;
  };
};

export type PushNotificationType =
  | 'alert'
  | 'added_to_business'
  | 'service_notification';

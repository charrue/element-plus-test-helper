const NOTIFICATION_SELECTOR = ".el-notification";
type NotificationTypes = "success" | "info" | "warning" | "error"

export class ElNotificationTestUtils {
  getSelector = (type?: NotificationTypes) => `${NOTIFICATION_SELECTOR}${type ? ` > ${NOTIFICATION_SELECTOR}--${type}` : ""}`;

  getNotification = (type?: NotificationTypes) => {
    const selector = this.getSelector(type);
    return document.querySelector(selector);
  };
}

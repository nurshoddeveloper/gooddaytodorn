import fcmController from './fcm-controller';


let startTimer = null;

export function fcmStart() {

  fcmController.checkPermissions()
    .then(() => {
      console.log('notifications_permissions_OK');
      fcmController.registerListeners();
      startTimer = setTimeout(() => {
        fcmController.setUserId(gd.session.me.id);
        fcmController.sendTokensToGoodday();
        fcmController.createNotificationChannel();
        fcmController.checkAppStartedFromNotification();
      }, 2000);

    })
    .catch(() => {
      console.log('notifications_permissions_ERROR');
      clearTimeout(startTimer);
      startTimer = null;
    });

  if (false) fcmController.developerRemoveOldTokens();

}

export function fcmPause() {
  fcmController.setUserId(null);
}
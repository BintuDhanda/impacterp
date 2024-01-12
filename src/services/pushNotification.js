import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {Post as httpPost} from '../constants/httpService';
const channelId = 'default';
const usePushNotification = user => {
  const pushNotification = () => {
    PushNotification.createChannel({
      channelId: channelId, // (required)
      channelName: channelId, // (required)
    });
    // Request permission for receiving push notifications
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        getTokenAndStore();
      }
    };

    requestUserPermission();

    // Handle incoming notifications while the app is in the foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Notification received:', remoteMessage);
    });

    return () => {
      unsubscribe();
    };
  };

  const getTokenAndStore = async () => {
    try {
      const token = await messaging().getToken();
      console.log('Device token:', token);
      // Send the token to the server for storage
      sendTokenToServer(token);
    } catch (error) {
      console.log('Error getting device token:', error);
    }
  };

  const sendTokenToServer = async token => {
    // Make an API call to your .NET Core Web API to store the token
    if (user && user.userId > 0) {
      (
        await httpPost('User/UserDeviceToken', {
          UserId: user.userId,
          DeviceType: 'Android',
          UserToken: token,
        }).then(res => res)
      ).catch(err => {});
    }
  };
  return pushNotification;
};
export default usePushNotification;

export const backgroundPushNotificationHandler = () => {
  messaging().setBackgroundMessageHandler(message => {
    console.log(message);
  });
};

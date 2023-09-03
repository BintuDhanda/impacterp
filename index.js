/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
// import messaging from '@react-native-firebase/messaging';
// import firebase from '@react-native-firebase/app';


  // Initialize Firebase
// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
//   }


AppRegistry.registerComponent(appName, () => App);

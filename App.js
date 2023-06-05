import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import 'react-native-gesture-handler'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LogInScreen from './src/screens/loginScreen';
import VerifyOTPScreen from './src/screens/verifyOtpScreen';
import DrawerNavigator from './src/navigation/DrawerNavigator';


let isLogedIn = true;

const Stack = createStackNavigator();

function App() {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLogedIn ? (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={DrawerNavigator} />
            <Stack.Screen name="UserScreen" component={DrawerNavigator} />
            <Stack.Screen name="ManageRoleScreen" component={DrawerNavigator} />
            <Stack.Screen name="QualificationScreen" component={DrawerNavigator} />
            <Stack.Screen name="CountryScreen" component={DrawerNavigator} />
            <Stack.Screen name="StateScreen" component={DrawerNavigator} />
            <Stack.Screen name="CourseCategoryScreen" component={DrawerNavigator} />
            <Stack.Screen name="AddressTypeScreen" component={DrawerNavigator} />
            <Stack.Screen name="AccountScreen" component={DrawerNavigator} />
            <Stack.Screen name="AccountCategoryScreen" component={DrawerNavigator} />
            {/* <Stack.Screen name="StudentFormScreen" component={DrawerNavigator} /> */}
          </Stack.Navigator>
        </NavigationContainer>)
        :
        (<NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="logInScreen" component={LogInScreen} />
            <Stack.Screen name="VerifyOTPScreen" component={VerifyOTPScreen} />
          </Stack.Navigator>
        </NavigationContainer>)
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

});

export default App;

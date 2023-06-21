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
import HomeScreen from './src/screens/homeScreen';
import CountryScreen from './src/screens/countryScreen';
import UserScreen from './src/screens/userScreen';
import RoleScreen from './src/screens/roleScreen';
import QualificationScreen from './src/screens/qualificationScreen';
import StateScreen from './src/screens/stateScreen';
import CourseCategoryScreen from './src/screens/courseCategory';
import CourseScreen from './src/screens/courseScreen';
import AddressTypeScreen from './src/screens/addressTypeScreen';
import EnterAccountScreen from './src/screens/enterAccountScreen';
import AccountCategoryScreen from './src/screens/accountCategory';
import AccountScreen from './src/screens/accountScreen';
import DayBookScreen from './src/screens/dayBookScreen';
import CityScreen from './src/screens/cityScreen';
import StudentDetailsScreen from './src/screens/student/studentDetailsScreen';
import BatchScreen from './src/screens/batchScreen';
import StudentFormScreen from './src/screens/student/studentFormScreen';
import FeeTypeScreen from './src/screens/feeTypeScreen';
import StudentAddressFormScreen from './src/screens/student/studentAddressFormScreen';
import AddressScreen from './src/screens/student/studentAddressScreen';
import StudentQualificationScreen from './src/screens/student/qualification/studentQualificationScreen';
import StudentQualificationFormScreen from './src/screens/student/qualification/studentQualificationFormScreen';
import StudentTokenScreen from './src/screens/student/token/studentTokenScreen';


let isLogedIn = true;

const Stack = createStackNavigator();

function App() {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLogedIn ? (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: true }}>
            {/* <Stack.Screen name="HomeScreen" component={DrawerNavigator} /> */}
            <Stack.Screen name="HomeScreen" options={{ title: 'Home' }} component={HomeScreen} />
            <Stack.Screen name="UserScreen" options={{ title: 'User' }} component={UserScreen} />
            <Stack.Screen name="StudentFormScreen" options={{title: 'Student Form'}} component={StudentFormScreen} />
            <Stack.Screen name="RolesScreen" options={{ title: 'Roles' }} component={RoleScreen} />
            <Stack.Screen name="StudentDetailsScreen" options={{title: 'Student Detail'}} component={StudentDetailsScreen} />
            <Stack.Screen name="QualificationScreen" options={{ title: 'Qualification' }} component={QualificationScreen} />
            <Stack.Screen name="CountryScreen" options={{ title: 'Country' }} component={CountryScreen} />
            <Stack.Screen name="StateScreen" options={{ title: 'State' }} component={StateScreen} />
            <Stack.Screen name="CityScreen" options={{ title: 'City' }} component={CityScreen} />
            <Stack.Screen name="CourseCategoryScreen" options={{ title: 'Course Category' }} component={CourseCategoryScreen} />
            <Stack.Screen name="CourseScreen" options={{ title: 'Course' }} component={CourseScreen} />
            <Stack.Screen name="BatchScreen" options={{title: 'Batch'}} component={BatchScreen} />
            <Stack.Screen name="AddressTypeScreen" options={{ title: 'Address Type' }} component={AddressTypeScreen} />
            <Stack.Screen name="AddressScreen" options={{title: 'Student Address'}} component={AddressScreen} />
            <Stack.Screen name="StudentAddressFormScreen" options={{ title: 'Student Address Form'}} component={StudentAddressFormScreen} />
            <Stack.Screen name="StudentQualificationScreen" options={{title: 'Student Qualification'}} component={StudentQualificationScreen} />
            <Stack.Screen name="StudentQualificationFormScreen" options={{title: 'Student Qualification Form'}} component={StudentQualificationFormScreen} />
            <Stack.Screen name="StudentTokenScreen" options={{title: 'Student Token'}} component={StudentTokenScreen} />
            <Stack.Screen name="FeeTypeScreen" options={{ title: 'Fees Type'}} component={FeeTypeScreen} />
            <Stack.Screen name="EnterAccountScreen" options={{ title: 'Enter Account' }} component={EnterAccountScreen} />
            <Stack.Screen name="AccountCategoryScreen" options={{ title: 'Account Category' }} component={AccountCategoryScreen} />
            <Stack.Screen name="AccountScreen" options={{ title: 'Account' }} component={AccountScreen} />
            <Stack.Screen name="DayBookScreen" options={{ title: 'DayBook' }} component={DayBookScreen} />
          </Stack.Navigator>
        </NavigationContainer>)
        :
        (<NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="logInScreen" options={{ title: 'Log In' }} component={LogInScreen} />
            <Stack.Screen name="VerifyOTPScreen" options={{ title: 'Verify Otp' }} component={VerifyOTPScreen} />
          </Stack.Navigator>
        </NavigationContainer>)
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

});

export default App;

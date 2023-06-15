import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import DrawerContent from './DrawerContent';
import HomeScreen from '../screens/homeScreen';
import UserScreen from '../screens/userScreen';
import QualificationScreen from '../screens/qualificationScreen';
import RoleScreen from '../screens/roleScreen';
import CountryScreen from '../screens/countryScreen';
import CourseCategoryScreen from '../screens/courseCategory';
import AddressTypeScreen from '../screens/addressTypeScreen';
import EnterAccountScreen from '../screens/enterAccountScreen';
import AccountCategoryScreen from '../screens/accountCategory';
import AccountScreen from '../screens/accountScreen';
import CourseScreen from '../screens/courseScreen';
import DayBookScreen from '../screens/dayBookScreen';
import FeeTypeScreen from '../screens/feeTypeScreen';


const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (

    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="UserScreen" component={UserScreen} />
      <Drawer.Screen name="RolesScreen" component={RoleScreen} />
      <Drawer.Screen name="QualificationScreen" component={QualificationScreen} />
      <Drawer.Screen name="CountryScreen" component={CountryScreen} />
      <Drawer.Screen name="CourseCategoryScreen" component={CourseCategoryScreen} />
      <Drawer.Screen name="AddressTypeScreen" component={AddressTypeScreen} />
      <Drawer.Screen name="FeeTypeScreen" component={FeeTypeScreen} />
      <Drawer.Screen name="EnterAccountScreen" component={EnterAccountScreen} />
      <Drawer.Screen name="AccountCategoryScreen" component={AccountCategoryScreen} />
      <Drawer.Screen name="AccountScreen" component={AccountScreen} />
      <Drawer.Screen name="DayBookScreen" component={DayBookScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
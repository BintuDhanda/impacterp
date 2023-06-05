import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import DrawerContent from './DrawerContent';
import HomeScreen from '../screens/homeScreen';
import UserScreen from '../screens/userScreen';
import QualificationScreen from '../screens/qualificationScreen';
import ManageRoleScreen from '../screens/manageRoleScreen';
import CountryScreen from '../screens/countryScreen';
import CourseCategoryScreen from '../screens/courseCategory';
import AddressTypeScreen from '../screens/addressTypeScreen';
import AccountScreen from '../screens/accountScreen';
import AccountCategoryScreen from '../screens/accountCategory';
import StateScreen from '../screens/stateScreen';
import DropdownComponent from '../components/dropdownComponent';


const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
   
      <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen name="HomeScreen" component={HomeScreen} />
        <Drawer.Screen name="UserScreen" component={UserScreen} />
        <Drawer.Screen name="Roles" component={ManageRoleScreen} />
        <Drawer.Screen name="QualificationScreen" component={QualificationScreen} />
        <Drawer.Screen name="CountryScreen" component={CountryScreen} />
        <Drawer.Screen name="StateScreen" component={DropdownComponent} />
        <Drawer.Screen name="CourseCategoryScreen" component={CourseCategoryScreen} />
        <Drawer.Screen name="AddressTypeScreen" component={AddressTypeScreen} />
        <Drawer.Screen name="AccountScreen" component={AccountScreen} />
        <Drawer.Screen name="AccountCategoryScreen" component={AccountCategoryScreen} />
      </Drawer.Navigator>
  );
};

export default DrawerNavigator;
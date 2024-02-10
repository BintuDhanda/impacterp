import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Colors from '../../constants/Colors';
import {UserContext} from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {menus} from './constants';
import {Get as httpGet} from '../../constants/httpService';

const HomeScreen = () => {
  const {user, setUser} = useContext(UserContext);
  const navigation = useNavigation();
  const [userRoleList, setUserRoleList] = useState([]);

  const windowWidth = Dimensions.get('window').width;

  const handleIconPress = screenName => {
    navigation.navigate(screenName);
  };

  const handleLogOut = async () => {
    try {
      const savedUser = await AsyncStorage.clear();
    } catch (error) {
      console.log(error);
    }
    setUser(null);
  };
  const fetchUserRolesByUserId = async () => {
    try {
      const response = await httpGet(
        `UserRole/getUserRoleByUserId?UserId=${user?.userId}`,
      );
      setUserRoleList(response.data);
      console.log(userRoleList, 'UserRoleList');
    } catch (error) {
      console.error('Error fetching UserRoles:', error);
      Toast.show({
        type: 'error',
        text1: `${error}`,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };
  useFocusEffect(
    useCallback(() => {
      if (user?.userId) {
        fetchUserRolesByUserId();
      }
    }, [user?.userId]),
  );
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogOut}>
          <Text style={{color: '#1c8adb', fontSize: 16, marginRight: 10}}>
            Logout
          </Text>
        </TouchableOpacity>
      ),
    });
  });
  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          {menus?.map((item, index) => {
            if (
              !userRoleList
                ?.map(item => item?.roleName)
                ?.includes(item?.path) &&
              !userRoleList?.map(item => item?.roleName)?.includes('Admin')
            ) {
              return null;
            }
            return (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => handleIconPress(item?.path)}>
                <Icon
                  name={item?.icon}
                  size={50}
                  color={Colors.primary}
                  style={styles.icon}
                />
                {item?.icon2 && (
                  <Icon
                    name={item?.icon2}
                    size={30}
                    color={'white'}
                    style={{
                      ...styles.icon,
                      position: 'absolute',
                      right: 72,
                      bottom: 55,
                    }}
                  />
                )}
                <Text style={styles.title}>{item?.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  card: {
    width: (Dimensions.get('window').width - 60) / 2, // Adjust the card width based on the desired layout
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 10,
    shadowRadius: 40,
    elevation: 40,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const DrawerContent = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.2, paddingTop: 10, paddingHorizontal: 25, backgroundColor: '#FF0D0D', justifyContent: 'center' }}>
        <Image
          source={require('../icons/user.png')}
          style={{ height: 80, width: 80 }}
        />
        <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}>Guest, Welcome !</Text>
      </View>
      <View style={{ flex: 0.5 }}>
        <View style={styles.container}>

          <View style={styles.drawerItem}>
            <Icon name="rocket" size={20} color="#900" />
            <TouchableOpacity onPress={() => props.navigation.navigate('Home')}>
              <Text style={styles.title}>Home</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.drawerItem}>
            <Icon name="rocket" size={20} color="#900" />
            <TouchableOpacity onPress={() => props.navigation.navigate('UserScreen')}>
              <Text style={styles.title}>User</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.drawerItem}>
            <Icon name="rocket" size={20} color="#900" />
            <TouchableOpacity onPress={() => props.navigation.navigate('RolesScreen')}>
              <Text style={styles.title}>Roles</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.drawerItem}>
            <Icon name="rocket" size={20} color="#900" />
            <TouchableOpacity onPress={() => props.navigation.navigate('QualificationScreen')}>
              <Text style={styles.title}>Qualification</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.drawerItem}>
            <Icon name="rocket" size={20} color="#900" />
            <TouchableOpacity onPress={() => props.navigation.navigate('CountryScreen')}>
              <Text style={styles.title}>Country</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.drawerItem}>
            <Icon name="rocket" size={20} color="#900" />
            <TouchableOpacity onPress={() => props.navigation.navigate('StateScreen')}>
              <Text style={styles.title}>State</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.drawerItem}>
            <Icon name="rocket" size={20} color="#900" />
            <TouchableOpacity onPress={() => props.navigation.navigate('CityScreen')}>
              <Text style={styles.title}>City</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.drawerItem}>
            <Icon name="rocket" size={20} color="#900" />
            <TouchableOpacity onPress={() => props.navigation.navigate('CourseCategoryScreen')}>
              <Text style={styles.title}>Course Category</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.drawerItem}>
            <Icon name="rocket" size={20} color="#900" />
            <TouchableOpacity onPress={() => props.navigation.navigate('CourseScreen')}>
              <Text style={styles.title}>Course</Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>
      <View style={{ flex: 0.3, backgroundColor: '#ECC73D' }}>
        <View style={styles.container}>

          <View style={styles.drawerItem}>
            <Icon name="call" size={20} color="#900" />
            <TouchableOpacity onPress={() => props.navigation.navigate('AddressTypeScreen')}>
              <Text style={styles.title}>Address Type</Text>
            </TouchableOpacity>
          </View>


          <View style={styles.drawerItem}>
            <Icon name="rocket" size={20} color="#900" />
            <TouchableOpacity onPress={() => props.navigation.navigate('EnterAccountScreen')}>
              <Text style={styles.title}>Enter Account</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  drawerItem: {
    padding: 20,
    flexDirection: 'row',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16
  },
  title: {
    fontSize: 15,
    marginLeft: 10
  }
});


export default DrawerContent;

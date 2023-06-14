import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';

const HomeScreen = () => {
  const navigation = useNavigation();
  const windowWidth = Dimensions.get('window').width;

  const handleIconPress = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card} onPress={() => handleIconPress('UserScreen')}>
            <Icon name="users" size={50} color={Colors.primary} style={styles.icon} />
            <Text style={styles.title}>Users</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => handleIconPress('RolesScreen')}>
            <Icon name="key" size={50} color={Colors.primary} style={styles.icon} />
            <Text style={styles.title}>Roles</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => handleIconPress('StudentDetailsScreen')}>
            <Icon name="graduation-cap" size={50} color={Colors.primary} style={styles.icon} />
            <Text style={styles.title}>Students</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => handleIconPress('QualificationScreen')}>
            <Icon name="certificate" size={50} color={Colors.primary} style={styles.icon} />
            <Text style={styles.title}>Qualification</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => handleIconPress('CountryScreen')}>
            <Icon name="map-marker" size={50} color={Colors.primary} style={styles.icon} />
            <Text style={styles.title}>Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => handleIconPress('CourseCategoryScreen')}>
            <Icon name="book" size={50} color={Colors.primary} style={styles.icon} />
            <Text style={styles.title}>Course Category</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => handleIconPress('AddressTypeScreen')}>
            <Icon name="map" size={50} color={Colors.primary} style={styles.icon} />
            <Text style={styles.title}>Address Type</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => handleIconPress('EnterAccountScreen')}>
            <Icon name="bank" size={50} color={Colors.primary} style={styles.icon} />
            <Text style={styles.title}>Enter Account</Text>
          </TouchableOpacity>
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
    width: (Dimensions.get('window').width - 60) / 3, // Adjust the card width based on the desired layout
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 10, height: 10 },
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
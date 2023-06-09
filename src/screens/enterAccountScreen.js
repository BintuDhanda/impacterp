import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';

const EnterAccountScreen = () => {
  const navigation = useNavigation();
  const [isHorizontal, setIsHorizontal] = useState(Dimensions.get('window').width > Dimensions.get('window').height);

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsHorizontal(Dimensions.get('window').width > Dimensions.get('window').height);
    };

    Dimensions.addEventListener('change', handleOrientationChange);

    return () => {
      Dimensions.removeEventListener('change', handleOrientationChange);
    };
  }, []);

  const handleIconPress = (screenName) => {
    navigation.navigate(screenName);
  };

  const renderCards = () => {
    if (isHorizontal) {
      return (
        <View style={styles.horizontalLine}>
          <TouchableOpacity style={styles.card} onPress={() => handleIconPress('AccountCategoryScreen')}>
            <Icon name="folder" size={50} color={Colors.primary} style={styles.icon} />
            <Text style={styles.title}>Account Category</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => handleIconPress('AccountScreen')}>
            <Icon name="user-circle" size={50} color={Colors.primary} style={styles.icon} />
            <Text style={styles.title}>Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => handleIconPress('DayBookScreen')}>
            <Icon name="book" size={50} color={Colors.primary} style={styles.icon} />
            <Text style={styles.title}>DayBook</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.verticalLine}>
        <TouchableOpacity style={styles.card} onPress={() => handleIconPress('AccountCategoryScreen')}>
          <Icon name="folder" size={50} color={Colors.primary} style={styles.icon} />
          <Text style={styles.title}>Account Category</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => handleIconPress('AccountScreen')}>
          <Icon name="user-circle" size={50} color={Colors.primary} style={styles.icon} />
          <Text style={styles.title}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => handleIconPress('DayBookScreen')}>
          <Icon name="book" size={50} color={Colors.primary} style={styles.icon} />
          <Text style={styles.title}>DayBook</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {renderCards()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  verticalLine: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  horizontalLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    width: (Dimensions.get('window').width - 60) / 3,
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
    marginEnd: 10
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

export default EnterAccountScreen;
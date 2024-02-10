import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import Colors from '../../constants/Colors';
const {width} = Dimensions.get('window');

const imgWidth = width - 30;

const AcademyItem = ({item, onChoose}) => {
  const {academyName} = item;

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity onPress={() => onChoose(item)} style={styles.container}>
        <Image
          source={require('../../assets/impact.png')}
          style={{...styles.thumbnail, width: 40, height: 40}}
          PlaceholderContent={<ActivityIndicator color={Colors?.primary} />}
        />
        <Text numberOfLines={2} style={styles.title}>
          {academyName}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AcademyItem;

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 5,
  },
  container: {
    width: '100%',
    backgroundColor: 'white',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    borderRadius: 2,
  },
  title: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 20,
    paddingHorizontal: 10,
    width: imgWidth / 2,
  },
  thumbnail: {
    resizeMode: 'stretch',
    marginBottom: 10,
    minWidth: imgWidth / 2,
    width: imgWidth / 2,
    minHeight: (imgWidth - 90) / 2,
    maxHeight: (imgWidth - 90) / 2,
    height: (imgWidth - 90) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerHome: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    borderRadius: 5,
  },
  titleHome: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'justify',
    lineHeight: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: 150,
    maxWidth: imgWidth / 2,
  },
  thumbnailHome: {
    resizeMode: 'stretch',
    width: 60,
    height: 60,
    borderRadius: 50,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

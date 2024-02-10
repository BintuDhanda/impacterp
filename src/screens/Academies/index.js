import React, {useState, useEffect, useContext} from 'react';
import {FlatList} from 'react-native';
import AcademyItem from './AcademyItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Get as httpGet,
} from '../../constants/httpService';
import Toast from 'react-native-toast-message';
import {UserContext} from '../../../App';

const Academies = () => {
  const [data, setData] = useState([]);
  const {user, setUser} = useContext(UserContext);

  const fetchData = () => {
    httpGet('Academy/get')
      .then(result => {
        setData(result.data);
      })
      .catch(err => {
        console.log('Get AccountCategory error :', err);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onChoose = async item => {
    const newUserData = {
      ...user,
      academyId: item?.academyId,
      academyName: item?.academyName,
    };
    console.log(newUserData);
    setUser(newUserData);
    await AsyncStorage.setItem('user', JSON.stringify(newUserData));
  };

  return (
    <>
      <FlatList
        style={{paddingTop: 10, paddingHorizontal: 5}}
        numColumns={2}
        data={data}
        renderItem={({item}) => <AcademyItem item={item} onChoose={onChoose} />}
        keyExtractor={(_, index) => index?.toString()}
      />
    </>
  );
};

export default Academies;

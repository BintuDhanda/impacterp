import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import {FlatList} from '@src/components/flatlist';
import Colors from '../constants/Colors';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import {UserContext} from '../../App';
import {useContext} from 'react';
import {Get as httpGet, Post as httpPost} from '../constants/httpService';
import ShowError from '../constants/ShowError';

const CountryScreen = ({navigation}) => {
  const {user, setUser} = useContext(UserContext);
  const [country, setCountry] = useState({
    CountryId: 0,
    CountryName: '',
    IsActive: true,
    CreatedAt: null,
    CreatedBy: user.userId,
    LastUpdatedBy: null,
  });
  const [countryList, setCountryList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [countryDeleteId, setCountryDeleteId] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    GetCountryList();
  }, []);
  const GetCountryList = () => {
    httpGet('Country/get')
      .then(result => {
        console.log(result.data);
        setCountryList(result.data);
      })
      .catch(err => {
        console.log('Get Country error :', err);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };
  const handleAddCountry = () => {
    setCountry({
      CountryId: 0,
      CountryName: '',
      IsActive: true,
      CreatedAt: null,
      CreatedBy: user.userId,
      LastUpdatedBy: null,
    });
    setModalVisible(true);
  };

  const handleSaveCountry = () => {
    if (IsFormValid()) {
      try {
        if (country.CountryId !== 0) {
          httpPost('Country/put', country)
            .then(response => {
              if (response.status === 200) {
                GetCountryList();
                Alert.alert('Sucees', 'Update Country Successfully');
                setCountry({
                  CountryId: 0,
                  CountryName: '',
                  IsActive: true,
                  CreatedAt: null,
                  CreatedBy: user.userId,
                  LastUpdatedBy: null,
                });
              }
            })
            .catch(err => {
              console.log('Country update error : ', err);
              Toast.show({
                type: 'error',
                text1: `${err}`,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
              });
            });
        } else {
          httpPost('Country/post', country)
            .then(response => {
              if (response.status === 200) {
                GetCountryList();
                Alert.alert('Success', 'Add Country Successfully');
                setCountry({
                  CountryId: 0,
                  CountryName: '',
                  IsActive: true,
                  CreatedAt: null,
                  CreatedBy: user.userId,
                  LastUpdatedBy: null,
                });
              }
            })
            .catch(err => {
              console.log('Country Add error :', err);
              Toast.show({
                type: 'error',
                text1: `${err}`,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
              });
            });
        }
        setModalVisible(false);
      } catch (error) {
        console.log('Error saving Country:', error);
      }
    }
  };
  const IsFormValid = () => {
    if (country.CountryName.length == 0) {
      ShowError('Enter a Valid Country Name');
      return false;
    }

    return true;
  };
  const DeleteCountryIdConfirm = countryid => {
    setCountryDeleteId(countryid);
  };

  const DeleteCountryIdConfirmYes = () => {
    httpGet(`Country/delete?Id=${countryDeleteId}`)
      .then(result => {
        console.log(result);
        GetCountryList();
        setCountryDeleteId(0);
        setShowDelete(false);
      })
      .catch(error => {
        console.error('Delete Country error', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const DeleteCountryIdConfirmNo = () => {
    setCountryDeleteId(0);
    setShowDelete(false);
  };

  const handleNavigate = (countryId, countryName) => {
    navigation.navigate('StateScreen', {
      countryId: countryId,
      countryName: countryName,
    });
  };

  const handleEditCountry = countryId => {
    httpGet(`Country/getById?Id=${countryId}`)
      .then(response => {
        setCountry({
          CountryId: response.data.countryId,
          CountryName: response.data.countryName,
          IsActive: response.data.isActive,
          CreatedAt: response.data.createdAt,
          CreatedBy: response.data.createdBy,
          LastUpdatedBy: user.userId,
        });
      })
      .catch(error => {
        console.log('Country Get By Id :', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const renderCountryCard = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: Colors.background,
          borderRadius: 10,
          padding: 10,
          marginBottom: 10,
          shadowColor: Colors.shadow,
          shadowOffset: {width: 10, height: 2},
          shadowOpacity: 4,
          shadowRadius: 10,
          elevation: 10,
          borderWidth: 1.5,
          borderColor: Colors.primary,
        }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
          }}>
          {item.countryName}
        </Text>

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{marginRight: 10}}
            onPress={() => handleEditCountry(item.countryId)}>
            <Icon
              name="pencil"
              size={20}
              color={'#5a67f2'}
              style={{marginLeft: 8, textAlignVertical: 'center'}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginRight: 10}}
            onPress={() => handleNavigate(item.countryId, item.countryName)}>
            <Icon
              name="cogs"
              size={20}
              color={Colors.primary}
              style={{marginRight: 8, textAlignVertical: 'center'}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              DeleteCountryIdConfirm(item.countryId);
              setShowDelete(true);
            }}>
            <Icon
              name="trash"
              size={20}
              color={'#f25252'}
              style={{marginRight: 8, textAlignVertical: 'center'}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{flexGrow: 1}}>
      <View style={{flex: 1, padding: 20}}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
          onPress={handleAddCountry}>
          <Text
            style={{
              color: Colors.background,
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Add Country
          </Text>
        </TouchableOpacity>

        {showDelete && (
          <Modal transparent visible={showDelete}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: Colors.background,
                  borderRadius: 10,
                  padding: 28,
                  shadowColor: Colors.shadow,
                  width: '80%',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 5,
                    alignSelf: 'center',
                    fontWeight: 'bold',
                  }}>
                  Are You Sure You Want To Delete
                </Text>

                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.primary,
                      borderRadius: 5,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      marginTop: 10,
                      marginRight: 3,
                    }}
                    onPress={() => {
                      DeleteCountryIdConfirmYes();
                    }}>
                    <Text style={{fontSize: 16, color: Colors.background}}>
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#f25252',
                      borderRadius: 5,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      marginTop: 10,
                    }}
                    onPress={() => {
                      DeleteCountryIdConfirmNo();
                    }}>
                    <Text style={{fontSize: 16, color: Colors.background}}>
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                backgroundColor: Colors.background,
                borderRadius: 10,
                padding: 20,
                width: '80%',
                marginBottom: 20,
              }}>
              <TextInput
                style={{
                  width: '100%',
                  height: 40,
                  borderWidth: 1,
                  borderColor: Colors.primary,
                  marginBottom: 10,
                  paddingHorizontal: 10,
                }}
                placeholder="Country Name"
                value={country.CountryName}
                onChangeText={text =>
                  setCountry({...country, CountryName: text})
                }
              />

              <TouchableOpacity
                style={{
                  backgroundColor: Colors.primary,
                  borderRadius: 5,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  marginBottom: 10,
                }}
                onPress={handleSaveCountry}>
                <Text
                  style={{
                    color: Colors.background,
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {country.CountryId !== 0 ? 'Save' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#f25252',
                borderRadius: 5,
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}
              onPress={handleClose}>
              <Text
                style={{
                  color: Colors.background,
                  fontSize: 16,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <FlatList
          data={countryList}
          renderItem={renderCountryCard}
          keyExtractor={item => item.countryId.toString()}
          // contentContainerStyle={{ flexGrow: 1, }}
        />
      </View>
      <Toast ref={ref => Toast.setRef(ref)} />
    </ScrollView>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   addButton: {
//     backgroundColor: '#5a67f2',
//     borderRadius: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   addButtonLabel: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     padding: 20,
//     width: '80%',
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     height: 40,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
//   addModalButton: {
//     backgroundColor: '#5a67f2',
//     borderRadius: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginBottom: 10,
//   },
//   addModalButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   closeModalButton: {
//     backgroundColor: '#f25252',
//     borderRadius: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   closeModalButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   countryList: {
//     flexGrow: 1,
//   },
//   countryCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     padding: 20,
//     marginBottom: 10,
//     shadowColor: '#000000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   countryName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//   },
//   editButton: {
//     backgroundColor: '#5a67f2',
//     borderRadius: 5,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     marginRight: 10,
//   },
//   deleteButton: {
//     backgroundColor: '#f25252',
//     borderRadius: 5,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
// });

export default CountryScreen;

import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import Colors from '../../constants/Colors';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import {UserContext} from '../../../App';
import {useContext} from 'react';
import {Get as httpGet, Post as httpPost} from '../../constants/httpService';
import ShowError from '../../constants/ShowError';

const HostelScreen = ({navigation}) => {
  const {user, setUser} = useContext(UserContext);
  const [hostel, setHostel] = useState({
    HostelId: 0,
    HostelName: '',
    IsActive: true,
    CreatedAt: null,
    CreatedBy: user.userId,
    LastUpdatedBy: null,
  });
  const [hostelList, setHostelList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [hostelDeleteId, setHostelDeleteId] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    GetHostelList();
  }, []);
  const GetHostelList = () => {
    httpGet('Hostel/get')
      .then(result => {
        console.log(result.data);
        setHostelList(result.data);
      })
      .catch(err => {
        console.log('Get Hostel error :', err);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };
  const handleAddHostel = () => {
    setHostel({
      HostelId: 0,
      HostelName: '',
      IsActive: true,
      CreatedAt: null,
      CreatedBy: user.userId,
      LastUpdatedBy: null,
    });
    setModalVisible(true);
  };

  const handleSaveHostel = () => {
    if (IsFormValid()) {
      try {
        if (hostel.HostelId !== 0) {
          httpPost('Hostel/put', hostel)
            .then(response => {
              if (response.status === 200) {
                GetHostelList();
                Alert.alert('Sucees', 'Update Hostel Successfully');
                setHostel({
                  HostelId: 0,
                  HostelName: '',
                  IsActive: true,
                  CreatedAt: null,
                  CreatedBy: user.userId,
                  LastUpdatedBy: null,
                });
              }
            })
            .catch(err => {
              console.log('Hostel update error : ', err);
              Toast.show({
                type: 'error',
                text1: `${err}`,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
              });
            });
        } else {
          httpPost('Hostel/post', hostel)
            .then(response => {
              if (response.status === 200) {
                GetHostelList();
                Alert.alert('Success', 'Add Hostel Successfully');
                setHostel({
                  HostelId: 0,
                  HostelName: '',
                  IsActive: true,
                  CreatedAt: null,
                  CreatedBy: user.userId,
                  LastUpdatedBy: null,
                });
              }
            })
            .catch(err => {
              console.log('Hostel Add error :', err);
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
        console.log('Error saving Hostel:', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    }
  };
  const IsFormValid = () => {
    if (hostel.HostelName.length == 0) {
      ShowError('Enter a Valid Hostel Name');
      return false;
    }

    return true;
  };
  const DeleteHostelIdConfirm = hostelid => {
    setHostelDeleteId(hostelid);
  };

  const DeleteHostelIdConfirmYes = () => {
    httpGet(`Hostel/delete?Id=${hostelDeleteId}`)
      .then(result => {
        console.log(result);
        GetHostelList();
        setHostelDeleteId(0);
        setShowDelete(false);
      })
      .catch(error => {
        console.error('Delete Hostel error', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const DeleteHostelIdConfirmNo = () => {
    setHostelDeleteId(0);
    setShowDelete(false);
  };

  const handleEditHostel = hostelId => {
    httpGet(`Hostel/getById?Id=${hostelId}`)
      .then(response => {
        setHostel({
          HostelId: response.data.hostelId,
          HostelName: response.data.hostelName,
          IsActive: response.data.isActive,
          CreatedAt: response.data.createdAt,
          CreatedBy: response.data.createdBy,
          LastUpdatedBy: user.userId,
        });
      })
      .catch(error => {
        console.error('Hostel Get By Id :', error);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
    setModalVisible(true);
  };

  const handleNavigate = (hostelId, hostelName) => {
    navigation.navigate('HostelRooms', {
      hostelId: hostelId,
      hostelName: hostelName,
    });
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const renderHostelCard = ({item}) => {
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
          {item.hostelName}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{marginRight: 10}}
            onPress={() => handleEditHostel(item.hostelId)}>
            <Icon
              name="pencil"
              size={20}
              color={'#5a67f2'}
              style={{marginLeft: 8, textAlignVertical: 'center'}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginRight: 10}}
            onPress={() => handleNavigate(item.hostelId, item.hostelName)}>
            <Icon
              name="cogs"
              size={20}
              color={Colors.primary}
              style={{marginRight: 8, textAlignVertical: 'center'}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              DeleteHostelIdConfirm(item.hostelId);
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
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={{flex: 1, padding: 20}}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
          onPress={handleAddHostel}>
          <Text
            style={{
              color: Colors.background,
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Add Hostel
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
                      DeleteHostelIdConfirmYes();
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
                      DeleteHostelIdConfirmNo();
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
                placeholder="Hostel Name"
                value={hostel.HostelName}
                onChangeText={text =>
                  setHostel({
                    ...hostel,
                    HostelName: text,
                  })
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
                onPress={handleSaveHostel}>
                <Text
                  style={{
                    color: Colors.background,
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {hostel.HostelId !== 0 ? 'Save' : 'Add'}
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
          data={hostelList}
          renderItem={renderHostelCard}
          keyExtractor={item => item.hostelId.toString()}
        />
        <Toast ref={ref => Toast.setRef(ref)} />
      </View>
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
//   hostelList: {
//     flexGrow: 1,
//   },
//   hostelCard: {
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
//   hostelName: {
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

export default HostelScreen;

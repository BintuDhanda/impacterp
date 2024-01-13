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
import Colors from '../../../constants/Colors';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import {UserContext} from '../../../../App';
import {useContext} from 'react';
import {Get as httpGet, Post as httpPost} from '../../../constants/httpService';
import ShowError from '../../../constants/ShowError';
import {Picker} from '@react-native-picker/picker';

const HostelRoomBadStudentScreen = ({navigation}) => {
  const {user, setUser} = useContext(UserContext);
  const [hostelRoomBadStudent, setHostelRoomBadStudent] = useState({
    HostelRoomBadStudentId: 0,
    HostelId: 0,
    HostelRoomId: 0,
    HostelRoomBadId: 0,
    StudentId: 0,
    MonthlyRent: 0,
    IsRent: true,
    IsActive: true,
    CreatedAt: null,
    CreatedBy: user.userId,
    LastUpdatedBy: null,
  });
  const [hostelRoomBadStudentList, setHostelRoomBadStudentList] = useState([]);
  const [hostelList, setHostelList] = useState([]);
  const [hostelRoomList, setHostelRoomList] = useState([]);
  const [hostelRoomBadList, setHostelRoomBadList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [hostelDeleteId, setHostelRoomBadStudentDeleteId] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  useEffect(() => {
    GetHostelRoomBadStudentList();
  }, []);
  const GetHostelRoomBadStudentList = () => {
    httpGet('HostelRoomBadStudent/get')
      .then(result => {
        setHostelRoomBadStudentList(result.data);
      })
      .catch(err => {
        console.log('Get HostelRoomBadStudent error :', err);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };
  const handleAddHostelRoomBadStudent = () => {
    setHostelRoomBadStudent({
      HostelRoomBadStudentId: 0,
      HostelId: 0,
      HostelRoomId: 0,
      HostelRoomBadId: 0,
      StudentId: 0,
      MonthlyRent: 0,
      IsRent: true,
      IsActive: true,
      CreatedAt: null,
      CreatedBy: user.userId,
      LastUpdatedBy: null,
    });
    setModalVisible(true);
  };

  const handleSaveHostelRoomBadStudent = () => {
    if (IsFormValid()) {
      try {
        if (hostelRoomBadStudent.HostelRoomBadStudentId !== 0) {
          httpPost('HostelRoomBadStudent/put', hostelRoomBadStudent)
            .then(response => {
              if (response.status === 200) {
                GetHostelRoomBadStudentList();
                Alert.alert(
                  'Sucees',
                  'Update HostelRoomBadStudent Successfully',
                );
                setHostelRoomBadStudent({
                  HostelRoomBadStudentId: 0,
                  HostelId: 0,
                  HostelRoomId: 0,
                  HostelRoomBadId: 0,
                  StudentId: 0,
                  MonthlyRent: 0,
                  IsRent: true,
                  IsActive: true,
                  CreatedAt: null,
                  CreatedBy: user.userId,
                  LastUpdatedBy: null,
                });
              }
            })
            .catch(err => {
              console.log('HostelRoomBadStudent update error : ', err);
              Toast.show({
                type: 'error',
                text1: `${err}`,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
              });
            });
        } else {
          httpPost('HostelRoomBadStudent/post', hostelRoomBadStudent)
            .then(response => {
              if (response.status === 200) {
                GetHostelRoomBadStudentList();
                Alert.alert('Success', 'Add HostelRoomBadStudent Successfully');
                setHostelRoomBadStudent({
                  HostelRoomBadStudentId: 0,
                  HostelId: 0,
                  HostelRoomId: 0,
                  HostelRoomBadId: 0,
                  StudentId: 0,
                  MonthlyRent: 0,
                  IsRent: true,
                  IsActive: true,
                  CreatedAt: null,
                  CreatedBy: user.userId,
                  LastUpdatedBy: null,
                });
              }
            })
            .catch(err => {
              console.log('HostelRoomBadStudent Add error :', err);
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
        console.log('Error saving HostelRoomBadStudent:', error);
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
    if (hostelRoomBadStudent.StudentId.length == 0) {
      ShowError('Enter a Valid StudentId');
      return false;
    }

    return true;
  };
  const DeleteHostelRoomBadStudentIdConfirm = hostelRoomBadStudentId => {
    setHostelRoomBadStudentDeleteId(hostelRoomBadStudentId);
  };

  const DeleteHostelRoomBadStudentIdConfirmYes = () => {
    httpGet(`HostelRoomBadStudent/delete?Id=${hostelDeleteId}`)
      .then(result => {
        console.log(result);
        GetHostelRoomBadStudentList();
        setHostelRoomBadStudentDeleteId(0);
        setShowDelete(false);
      })
      .catch(error => {
        console.error('Delete HostelRoomBadStudent error', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const DeleteHostelRoomBadStudentIdConfirmNo = () => {
    setHostelRoomBadStudentDeleteId(0);
    setShowDelete(false);
  };

  const handleEditHostelRoomBadStudent = hostelRoomBadStudentId => {
    httpGet(`HostelRoomBadStudent/getById?Id=${hostelRoomBadStudentId}`)
      .then(response => {
        setHostelRoomBadStudent({
          HostelRoomBadStudentId: response.data.hostelRoomBadStudentId,
          HostelId: response.data.hostelId,
          HostelRoomId: response.data.hostelRoomId,
          HostelRoomBadId: response.data.hostelRoomBadId,
          StudentId: response?.data?.studentId,
          MonthlyRent: response?.data?.monthlyRent,
          IsRent: response?.data?.isRent,
          IsActive: response.data.isActive,
          CreatedAt: response.data.createdAt,
          CreatedBy: response.data.createdBy,
          LastUpdatedBy: user.userId,
        });
      })
      .catch(error => {
        console.error('HostelRoomBadStudent Get By Id :', error);
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

  const handleClose = () => {
    setModalVisible(false);
  };

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
  useEffect(() => {
    GetHostelList();
  }, []);

  const GetHostelRoomList = () => {
    httpGet(`HostelRoom/get?Id=${hostelRoomBadStudent?.HostelId}`)
      .then(result => {
        console.log(result.data);
        setHostelRoomList(result.data);
      })
      .catch(err => {
        console.log('Get Hostel Room error :', err);
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
    if (hostelRoomBadStudent?.HostelId) GetHostelRoomList();
  }, [hostelRoomBadStudent?.HostelId]);

  const GetHostelRoomBadList = () => {
    httpGet(`HostelRoomBad/get?Id=${hostelRoomBadStudent?.HostelRoomId}`)
      .then(result => {
        console.log(result.data);
        setHostelRoomBadList(result.data);
      })
      .catch(err => {
        console.log('Get Hostel Room Bad error :', err);
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
    if (hostelRoomBadStudent?.HostelRoomId) GetHostelRoomBadList();
  }, [hostelRoomBadStudent?.HostelRoomId]);

  const renderHostelRoomBadStudentCard = ({item}) => {
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
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            Student Id {item.studentId}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              maxWidth: '85%',
            }}>
            H/R/B {item.hostelRoomBad}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{marginRight: 10}}
            onPress={() =>
              handleEditHostelRoomBadStudent(item.hostelRoomBadStudentId)
            }>
            <Icon
              name="pencil"
              size={20}
              color={'#5a67f2'}
              style={{marginLeft: 8, textAlignVertical: 'center'}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              DeleteHostelRoomBadStudentIdConfirm(item.hostelRoomBadStudentId);
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
          onPress={handleAddHostelRoomBadStudent}>
          <Text
            style={{
              color: Colors.background,
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Allocate Hostel
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
                      DeleteHostelRoomBadStudentIdConfirmYes();
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
                      DeleteHostelRoomBadStudentIdConfirmNo();
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
              <Text>Hostel</Text>
              <Picker
                selectedValue={hostelRoomBadStudent?.HostelId}
                onValueChange={(itemValue, itemIndex) => {
                  setHostelRoomBadStudent({
                    ...hostelRoomBadStudent,
                    HostelId: itemValue,
                    HostelRoomId: 0,
                    HostelRoomBadId: 0,
                  });
                }}>
                <Picker.Item label={'--Select hostel--'} value={0} />
                {hostelList?.map((item, index) => (
                  <Picker.Item
                    key={index}
                    label={item?.hostelName}
                    value={item?.hostelId}
                  />
                ))}
              </Picker>
              <Text>Room</Text>
              <Picker
                selectedValue={hostelRoomBadStudent?.HostelRoomId}
                onValueChange={(itemValue, itemIndex) => {
                  setHostelRoomBadStudent({
                    ...hostelRoomBadStudent,
                    HostelRoomId: itemValue,
                    HostelRoomBadId: 0,
                  });
                }}>
                <Picker.Item label={'--Select room--'} value={0} />
                {hostelRoomList?.map((item, index) => (
                  <Picker.Item
                    key={index}
                    label={item?.hostelRoomNo}
                    value={item?.hostelRoomId}
                  />
                ))}
              </Picker>
              <Text>Bad</Text>
              <Picker
                selectedValue={hostelRoomBadStudent?.HostelRoomBadId}
                onValueChange={(itemValue, itemIndex) =>
                  setHostelRoomBadStudent({
                    ...hostelRoomBadStudent,
                    HostelRoomBadId: itemValue,
                  })
                }>
                <Picker.Item label={'--Select bad--'} value={0} />
                {hostelRoomBadList?.map((item, index) => (
                  <Picker.Item
                    key={index}
                    label={item?.hostelRoomBadNo}
                    value={item?.hostelRoomBadId}
                  />
                ))}
              </Picker>
              <Text style={{marginVertical: 10}}>
                Security/Rent:-{' '}
                {hostelRoomBadList?.find(
                  ele =>
                    ele?.hostelRoomBadId ==
                    hostelRoomBadStudent?.HostelRoomBadId,
                )?.hostelRoomBadSecurity || 0}
                /
                {hostelRoomBadList?.find(
                  ele =>
                    ele?.hostelRoomBadId ==
                    hostelRoomBadStudent?.HostelRoomBadId,
                )?.hostelRoomBadAmount || 0}
              </Text>
              <Text>Payment Type</Text>
              <Picker
                selectedValue={hostelRoomBadStudent?.IsRent}
                onValueChange={(itemValue, itemIndex) =>
                  setHostelRoomBadStudent({
                    ...hostelRoomBadStudent,
                    IsRent: itemValue,
                  })
                }>
                <Picker.Item label={'--Select type--'} value={0} />
                {[
                  {label: 'Security', value: false},
                  {label: 'Monthly Rent', value: true},
                ]?.map((item, index) => (
                  <Picker.Item
                    key={index}
                    label={item?.label}
                    value={item?.value}
                  />
                ))}
              </Picker>
              <TextInput
                style={{
                  width: '100%',
                  height: 40,
                  borderWidth: 1,
                  borderColor: Colors.primary,
                  marginBottom: 10,
                  paddingHorizontal: 10,
                }}
                keyboardType="number-pad"
                placeholder="Paid amount"
                value={hostelRoomBadStudent?.MonthlyRent?.toString()}
                onChangeText={text =>
                  setHostelRoomBadStudent({
                    ...hostelRoomBadStudent,
                    MonthlyRent: text,
                  })
                }
              />
              <TextInput
                style={{
                  width: '100%',
                  height: 40,
                  borderWidth: 1,
                  borderColor: Colors.primary,
                  marginBottom: 10,
                  paddingHorizontal: 10,
                }}
                placeholder="Student Registration No."
                value={hostelRoomBadStudent?.StudentId?.toString()}
                onChangeText={text =>
                  setHostelRoomBadStudent({
                    ...hostelRoomBadStudent,
                    StudentId: text,
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
                onPress={handleSaveHostelRoomBadStudent}>
                <Text
                  style={{
                    color: Colors.background,
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {hostelRoomBadStudent.HostelRoomBadStudentId !== 0
                    ? 'Save'
                    : 'Add'}
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
          data={hostelRoomBadStudentList}
          renderItem={renderHostelRoomBadStudentCard}
          keyExtractor={item => item.hostelRoomBadStudentId.toString()}
        />
        <Toast ref={ref => Toast.setRef(ref)} />
      </View>
      <Modal
        transparent
        visible={showQRScanner}
        onRequestClose={() => setShowQRScanner(false)}></Modal>
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
//   hostelRoomBadStudentList: {
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

export default HostelRoomBadStudentScreen;

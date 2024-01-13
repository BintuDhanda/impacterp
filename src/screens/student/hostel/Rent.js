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
import {Picker} from '@react-native-picker/picker';
import {months, paymentModes, paymentTypes} from './constants';

const HostelRoomBadStudentRentScreen = ({navigation, route}) => {
  const {hostelRoomBadStudentId} = route?.params;

  const {user, setUser} = useContext(UserContext);
  const [hostelRoomBadStudentRent, setHostelRoomBadStudentRent] = useState({
    HostelRoomBadStudentRentId: 0,
    HostelRoomBadStudentId: hostelRoomBadStudentId,
    Month: '',
    PaymentDate: '',
    PaymentMode: '',
    PaymentType: '',
    ReceivedAmount: '',
    RefundAmount: '',
    Remarks: '',
    IsActive: true,
    CreatedAt: null,
    CreatedBy: user.userId,
    LastUpdatedBy: null,
  });
  const [hostelRoomBadStudentRentList, setHostelRoomBadStudentRentList] =
    useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [
    hostelRoomBadStudentRentDeleteId,
    setHostelRoomBadStudentRentDeleteId,
  ] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    GetHostelRoomBadStudentRentList();
  }, []);
  const GetHostelRoomBadStudentRentList = () => {
    httpGet(`HostelRoomBadStudentRent/get?Id=${hostelRoomBadStudentId}`)
      .then(result => {
        console.log(result.data);
        setHostelRoomBadStudentRentList(result.data);
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
  const handleAddHostelRoomBadStudentRent = () => {
    setHostelRoomBadStudentRent({
      HostelRoomBadStudentRentId: 0,
      HostelRoomBadStudentId: hostelRoomBadStudentId,
      Month: '',
      PaymentDate: '',
      PaymentMode: '',
      PaymentType: '',
      ReceivedAmount: '',
      RefundAmount: '',
      Remarks: '',
      IsActive: true,
      CreatedAt: null,
      CreatedBy: user.userId,
      LastUpdatedBy: null,
    });
    setModalVisible(true);
  };

  const handleSaveHostelRoomBadStudentRent = () => {
    if (IsFormValid()) {
      try {
        if (hostelRoomBadStudentRent.HostelRoomBadStudentRentId !== 0) {
          httpPost('HostelRoomBadStudentRent/put', hostelRoomBadStudentRent)
            .then(response => {
              if (response.status === 200) {
                GetHostelRoomBadStudentRentList();
                Alert.alert('Sucees', 'Update Hostel Room Successfully');
                setHostelRoomBadStudentRent({
                  HostelRoomBadStudentRentId: 0,
                  HostelRoomBadStudentId: hostelRoomBadStudentId,
                  Month: '',
                  PaymentDate: '',
                  PaymentMode: '',
                  PaymentType: '',
                  ReceivedAmount: '',
                  RefundAmount: '',
                  Remarks: '',
                  IsActive: true,
                  CreatedAt: null,
                  CreatedBy: user.userId,
                  LastUpdatedBy: null,
                });
              }
            })
            .catch(err => {
              console.log('Hostel Room update error : ', err);
              Toast.show({
                type: 'error',
                text1: `${err}`,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
              });
            });
        } else {
          httpPost('HostelRoomBadStudentRent/post', hostelRoomBadStudentRent)
            .then(response => {
              if (response.status === 200) {
                GetHostelRoomBadStudentRentList();
                Alert.alert('Success', 'Add Hostel Room Successfully');
                setHostelRoomBadStudentRent({
                  HostelRoomBadStudentRentId: 0,
                  HostelRoomBadStudentId: hostelRoomBadStudentId,
                  Month: '',
                  PaymentDate: '',
                  PaymentMode: '',
                  PaymentType: '',
                  ReceivedAmount: '',
                  RefundAmount: '',
                  Remarks: '',
                  IsActive: true,
                  CreatedAt: null,
                  CreatedBy: user.userId,
                  LastUpdatedBy: null,
                });
              }
            })
            .catch(err => {
              console.log('Rent Add error :', err);
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
        console.log('Error saving HostelRoomBadStudentRent:', error);
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
    if (hostelRoomBadStudentRent.HostelRoomBadStudentRentNo.length == 0) {
      ShowError('Enter a Valid Hostel Room Name');
      return false;
    }

    return true;
  };
  const DeleteHostelRoomBadStudentRentIdConfirm =
    hostelRoomBadStudentRentid => {
      setHostelRoomBadStudentRentDeleteId(hostelRoomBadStudentRentid);
    };

  const DeleteHostelRoomBadStudentRentIdConfirmYes = () => {
    httpGet(
      `HostelRoomBadStudentRent/delete?Id=${hostelRoomBadStudentRentDeleteId}`,
    )
      .then(result => {
        console.log(result);
        GetHostelRoomBadStudentRentList();
        setHostelRoomBadStudentRentDeleteId(0);
        setShowDelete(false);
      })
      .catch(error => {
        console.error('Delete Hostel Room error', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const DeleteHostelRoomBadStudentRentIdConfirmNo = () => {
    setHostelRoomBadStudentRentDeleteId(0);
    setShowDelete(false);
  };

  const handleEditHostelRoomBadStudentRent = hostelRoomBadStudentRentId => {
    httpGet(`HostelRoomBadStudentRent/getById?Id=${hostelRoomBadStudentRentId}`)
      .then(response => {
        setHostelRoomBadStudentRent({
          HostelRoomBadStudentRentId: response.data.hostelRoomBadStudentRentId,
          HostelRoomBadStudentId: response.data.hostelRoomBadStudentId,
          PaymentMode: response.data.paymentMode,
          PaymentType: response.data.paymentType,
          PaymentDate: response.data.paymentDate,
          ReceivedAmount: response.data.receivedAmount,
          RefundAmount: response.data.refundAmount,
          Month: response.data.month,
          Remarks: response.data.remarks,
          IsActive: response.data.isActive,
          CreatedAt: response.data.createdAt,
          CreatedBy: response.data.createdBy,
          LastUpdatedBy: user.userId,
        });
      })
      .catch(error => {
        console.error('HostelRoomBadStudentRent Get By Id :', error);
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

  const handleNavigate = (
    hostelRoomBadStudentRentId,
    hostelRoomBadStudentRentNo,
  ) => {
    navigation.navigate('HostelRoomBadStudentRentBads', {
      hostelRoomBadStudentRentId: hostelRoomBadStudentRentId,
      hostelRoomBadStudentRentNo: hostelRoomBadStudentRentNo,
    });
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const renderHostelRoomBadStudentRentCard = ({item}) => {
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
          {item.hostelRoomBadStudentRentNo}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{marginRight: 10}}
            onPress={() =>
              handleEditHostelRoomBadStudentRent(
                item.hostelRoomBadStudentRentId,
              )
            }>
            <Icon
              name="pencil"
              size={20}
              color={'#5a67f2'}
              style={{marginLeft: 8, textAlignVertical: 'center'}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginRight: 10}}
            onPress={() =>
              handleNavigate(
                item.hostelRoomBadStudentRentId,
                item.hostelRoomBadStudentRentNo,
              )
            }>
            <Icon
              name="cogs"
              size={20}
              color={Colors.primary}
              style={{marginRight: 8, textAlignVertical: 'center'}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              DeleteHostelRoomBadStudentRentIdConfirm(
                item.hostelRoomBadStudentRentId,
              );
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
          onPress={handleAddHostelRoomBadStudentRent}>
          <Text
            style={{
              color: Colors.background,
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Add Hostel Room
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
                      DeleteHostelRoomBadStudentRentIdConfirmYes();
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
                      DeleteHostelRoomBadStudentRentIdConfirmNo();
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
              <Text>Payment Type</Text>
              <Picker
                selectedValue={hostelRoomBadStudentRent?.PaymentType}
                onValueChange={(itemValue, itemIndex) =>
                  setHostelRoomBadStudentRent({
                    ...hostelRoomBadStudentRent,
                    PaymentType: itemValue,
                  })
                }>
                <Picker.Item label={'--Select type--'} value={''} />
                {paymentTypes?.map((item, index) => (
                  <Picker.Item key={index} label={item} value={item} />
                ))}
              </Picker>
              <Text>Payment Mode</Text>
              <Picker
                selectedValue={hostelRoomBadStudentRent?.PaymentMode}
                onValueChange={(itemValue, itemIndex) =>
                  setHostelRoomBadStudentRent({
                    ...hostelRoomBadStudentRent,
                    PaymentMode: itemValue,
                  })
                }>
                <Picker.Item label={'--Select mode--'} value={''} />
                {paymentModes?.map((item, index) => (
                  <Picker.Item key={index} label={item} value={item} />
                ))}
              </Picker>
              <Text>Payment Month</Text>
              <Picker
                selectedValue={hostelRoomBadStudentRent?.Month}
                onValueChange={(itemValue, itemIndex) =>
                  setHostelRoomBadStudentRent({
                    ...hostelRoomBadStudentRent,
                    Month: itemValue,
                  })
                }>
                <Picker.Item label={'--Select month--'} value={0 || ''} />
                {months?.map((item, index) => (
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
                placeholder="Received Amount"
                value={hostelRoomBadStudentRent.ReceivedAmount}
                onChangeText={text =>
                  setHostelRoomBadStudentRent({
                    ...hostelRoomBadStudentRent,
                    ReceivedAmount: text,
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
                keyboardType="number-pad"
                placeholder="Refund Amount"
                value={hostelRoomBadStudentRent.RefundAmount}
                onChangeText={text =>
                  setHostelRoomBadStudentRent({
                    ...hostelRoomBadStudentRent,
                    RefundAmount: text,
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
                onPress={handleSaveHostelRoomBadStudentRent}>
                <Text
                  style={{
                    color: Colors.background,
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {hostelRoomBadStudentRent.HostelRoomBadStudentRentId !== 0
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
          data={hostelRoomBadStudentRentList}
          renderItem={renderHostelRoomBadStudentRentCard}
          keyExtractor={item => item.hostelRoomBadStudentRentId.toString()}
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
//   hostelRoomBadStudentRentList: {
//     flexGrow: 1,
//   },
//   hostelRoomBadStudentRentCard: {
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
//   hostelRoomBadStudentRentNo: {
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

export default HostelRoomBadStudentRentScreen;

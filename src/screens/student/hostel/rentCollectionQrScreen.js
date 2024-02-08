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
import {
  Get as httpGet,
  Post as httpPost,
  GetById as httpGetById,
} from '../../../constants/httpService';
import ShowError from '../../../constants/ShowError';
import {Picker} from '@react-native-picker/picker';
import {months, paymentModes, paymentTypes} from './constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import {getFormattedDate} from '../../../helpers';
import {Dropdown} from 'react-native-element-dropdown';
import QRCodeScanner from 'react-native-qrcode-scanner';

const RentCollectionQrScreen = () => {
  const {user, setUser} = useContext(UserContext);
  const [hostelRoomBadStudentId, setHostelRoomBadStudentId] = useState(0);
  const [hostelRoomBadStudentRent, setHostelRoomBadStudentRent] = useState({
    HostelRoomBadStudentRentId: 0,
    HostelRoomBadStudentId: hostelRoomBadStudentId,
    Month: 0,
    Year: new Date().getFullYear(),
    PaymentDate: new Date(),
    PaymentMode: '',
    PaymentType: '',
    ReceivedAmount: 0,
    RefundAmount: 0,
    Remarks: '',
    IsActive: true,
    CreatedAt: null,
    CreatedBy: user.userId,
    LastUpdatedBy: null,
  });
  const [hostelRoomBadStudentRentList, setHostelRoomBadStudentRentList] =
    useState([]);
  const [hostelRoomBadStudentList, setHostelRoomBadStudentList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [
    hostelRoomBadStudentRentDeleteId,
    setHostelRoomBadStudentRentDeleteId,
  ] = useState(0);
  const [showModal, setShowModal] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState({
    RegistrationNumber: '',
  });
  const [ishowQrCode, setIshowQrCode] = useState(false);

  useEffect(() => {
    // GetHostelRoomBadStudentRentList();
  }, []);
  const GetHostelRoomBadStudentRentList = () => {
    httpGet(`HostelRoomBadStudentRent/get?Id=${hostelRoomBadStudentId}`)
      .then(result => {
        console.log(result.data);
        setHostelRoomBadStudentRentList(result.data);
        setShowModal(false);
      })
      .catch(err => {
        console.log('Get Hostel Rent error :', err);
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
      Month: 0,
      Year: new Date().getFullYear(),
      PaymentDate: new Date(),
      PaymentMode: '',
      PaymentType: '',
      ReceivedAmount: 0,
      RefundAmount: 0,
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
                Alert.alert('Sucees', 'Update Hostel Rent Successfully');
                setHostelRoomBadStudentRent({
                  HostelRoomBadStudentRentId: 0,
                  HostelRoomBadStudentId: hostelRoomBadStudentId,
                  Month: 0,
                  Year: new Date().getFullYear(),
                  PaymentDate: new Date(),
                  PaymentMode: '',
                  PaymentType: '',
                  ReceivedAmount: 0,
                  RefundAmount: 0,
                  Remarks: '',
                  IsActive: true,
                  CreatedAt: null,
                  CreatedBy: user.userId,
                  LastUpdatedBy: null,
                });
              }
            })
            .catch(err => {
              console.log('Hostel Rent update error : ', err);
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
                Alert.alert('Success', 'Add Hostel Rent Successfully');
                setHostelRoomBadStudentRent({
                  HostelRoomBadStudentRentId: 0,
                  HostelRoomBadStudentId: hostelRoomBadStudentId,
                  Month: 0,
                  Year: new Date().getFullYear(),
                  PaymentDate: new Date(),
                  PaymentMode: '',
                  PaymentType: '',
                  ReceivedAmount: 0,
                  RefundAmount: 0,
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
    if (
      hostelRoomBadStudentRent.ReceivedAmount.length == 0 ||
      !hostelRoomBadStudentRent?.PaymentDate ||
      !hostelRoomBadStudentRent?.PaymentMode ||
      !hostelRoomBadStudentRent?.PaymentType
    ) {
      ShowError('Enter all required fields');
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
        console.error('Delete Hostel Rent error', error);
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
        console.log(response.data);
        setHostelRoomBadStudentRent({
          HostelRoomBadStudentRentId: response.data.hostelRoomBadStudentRentId,
          HostelRoomBadStudentId: response.data.hostelRoomBadStudentId,
          PaymentMode: response.data.paymentMode,
          PaymentType: response.data.paymentType,
          PaymentDate: response.data.paymentDate,
          ReceivedAmount: response.data.receivedAmount,
          RefundAmount: response.data.refundAmount,
          Month: response.data.month,
          Year: response.data.year,
          Remarks: response.data.remarks,
          IsActive: response.data.isActive,
          CreatedAt: response.data.createdAt,
          CreatedBy: response.data.createdBy,
          LastUpdatedBy: user.userId,
        });
      })
      .catch(error => {
        console.error('Hostel Room Bad Studen tRent Get By Id :', error);
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

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, date) => {
    if (date !== undefined) {
      setSelectToDate(date);
      setToDate(getFormattedDate(date));
    }
    setShowDatePicker(false);
  };

  const handleConfirmDatePicker = () => {
    setShowDatePicker(false);
  };

  const onSuccess = e => {
    setRegistrationNumber({RegistrationNumber: e.data});
    httpGetById(
      `StudentDetails/getStudentIdByRegistrationNumber?RegistrationNumber=${e.data}`,
    )
      .then(result => {
        if (result.data.studentId > 0) {
          httpGet(`HostelRoomBadStudent/get?Id=${result.data.studentId}`)
            .then(result => {
              setHostelRoomBadStudentList(result.data);
              setIshowQrCode(false);
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
        } else {
          ShowError('Enter a Valid RegistrationNumber');
        }
      })
      .catch(err => {
        console.log('GetStudentId By Registration Number error : ', err);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
    setIshowQrCode(false);
  };

  const handleSave = () => {
    if (
      registrationNumber.RegistrationNumber == '' &&
      hostelRoomBadStudentRent.HostelRoomBadStudentId == 0
    ) {
      ShowError('Please Fill RegistrationNumber and HostelRoomBad');
    } else {
      GetHostelRoomBadStudentRentList();
    }
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
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {item?.paymentType}:{' '}
            {months?.find(ele => ele?.value == item.month)?.label}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            Received Amount: {item?.receivedAmount}
          </Text>
          {item?.refundAmount ? (
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              Refunded: {item?.refundAmount}
            </Text>
          ) : null}
        </View>
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
      <Modal
        visible={ishowQrCode}
        transparent
        onRequestClose={() => setIshowQrCode(false)}>
        <QRCodeScanner
          onRead={onSuccess}
          reactivate={true}
          reactivateTimeout={500}
          showMarker={true}
        />
      </Modal>
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
            Add Hostel Rent
          </Text>
        </TouchableOpacity>
        {showModal && (
          <Modal transparent visible={showModal}>
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
                  padding: 10,
                  marginBottom: 10,
                  shadowColor: Colors.shadow,
                  width: '80%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    borderRadius: 10,
                    borderColor: Colors.primary,
                    borderWidth: 1,
                    fontSize: 16,
                    paddingHorizontal: 20,
                    marginBottom: 10,
                  }}>
                  <TouchableOpacity
                    style={{justifyContent: 'center'}}
                    onPress={() => {
                      setIshowQrCode(true);
                    }}>
                    <Icon name="qrcode" size={20} />
                  </TouchableOpacity>
                  <TextInput
                    style={{flex: 1, marginLeft: 10}}
                    placeholder="Enter Registration Number"
                    value={registrationNumber.RegistrationNumber}
                    keyboardType="numeric"
                    onChangeText={text => {
                      setRegistrationNumber({
                        ...registrationNumber,
                        RegistrationNumber: text,
                      });
                    }}
                  />
                  <TouchableOpacity
                    style={{justifyContent: 'center'}}
                    onPress={() => {
                      setRegistrationNumber({
                        ...registrationNumber,
                        RegistrationNumber: '',
                      });
                    }}>
                    <Icon name="trash" size={20} color="green" />
                  </TouchableOpacity>
                </View>
                <Dropdown
                  style={[
                    {
                      height: 50,
                      borderColor: Colors.primary,
                      borderWidth: 1.5,
                      borderRadius: 10,
                      paddingHorizontal: 8,
                    },
                  ]}
                  placeholderStyle={{fontSize: 16}}
                  selectedTextStyle={{fontSize: 16}}
                  inputSearchStyle={{
                    height: 40,
                    fontSize: 16,
                  }}
                  iconStyle={{
                    width: 20,
                    height: 20,
                  }}
                  data={hostelRoomBadStudentList}
                  search
                  maxHeight={300}
                  labelField="hostelRoomBad"
                  valueField="hostelRoomBadStudentId"
                  placeholder={'Select HostelRoomBad'}
                  searchPlaceholder="Search..."
                  value={hostelRoomBadStudentList?.find(
                    ele =>
                      ele?.hostelRoomBadStudentId ===
                      hostelRoomBadStudentRent?.HostelRoomBadStudentId,
                  )}
                  onChange={text => {
                    setHostelRoomBadStudentId(text.hostelRoomBadStudentId);
                  }}
                />
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
                      handleSave();
                    }}>
                    <Text style={{fontSize: 16, color: Colors.background}}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
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
              <Text>Payment Type*</Text>
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
              <Text>Payment Mode*</Text>
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
              {hostelRoomBadStudentRent.PaymentType !== 'Security' && (
                <>
                  <Text>Payment Month*</Text>
                  <Picker
                    selectedValue={hostelRoomBadStudentRent?.Month}
                    onValueChange={(itemValue, itemIndex) =>
                      setHostelRoomBadStudentRent({
                        ...hostelRoomBadStudentRent,
                        Month: itemValue,
                      })
                    }>
                    <Picker.Item label={'--Select month--'} value={0} />
                    {months?.map((item, index) => (
                      <Picker.Item
                        key={index}
                        label={item?.label}
                        value={item?.value}
                      />
                    ))}
                  </Picker>
                </>
              )}
              <Text style={{fontSize: 16, marginBottom: 5}}>Payment Date*</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderColor: Colors.primary,
                  borderRadius: 8,
                }}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Icon name={'calendar'} size={25} />
                </TouchableOpacity>
                <TextInput
                  style={{
                    marginLeft: 10,
                    fontSize: 16,
                    color: Colors.secondary,
                  }}
                  value={getFormattedDate(
                    hostelRoomBadStudentRent?.PaymentDate,
                  )}
                  placeholder="Select payment date"
                  editable={false}
                />
              </View>
              {showDatePicker && (
                <DateTimePicker
                  value={hostelRoomBadStudentRent?.PaymentDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  onConfirm={handleConfirmDatePicker}
                  onCancel={handleConfirmDatePicker}
                />
              )}
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
                placeholder="Received Amount*"
                value={
                  !hostelRoomBadStudentRent?.ReceivedAmount
                    ? ''
                    : hostelRoomBadStudentRent?.ReceivedAmount?.toString()
                }
                onChangeText={text =>
                  setHostelRoomBadStudentRent({
                    ...hostelRoomBadStudentRent,
                    ReceivedAmount: parseFloat(text),
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
                value={
                  !hostelRoomBadStudentRent.RefundAmount
                    ? ''
                    : hostelRoomBadStudentRent.RefundAmount?.toString()
                }
                onChangeText={text =>
                  setHostelRoomBadStudentRent({
                    ...hostelRoomBadStudentRent,
                    RefundAmount: parseFloat(text),
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
                placeholder="Remarks"
                value={hostelRoomBadStudentRent.Remarks}
                onChangeText={text =>
                  setHostelRoomBadStudentRent({
                    ...hostelRoomBadStudentRent,
                    Remarks: text,
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

export default RentCollectionQrScreen;

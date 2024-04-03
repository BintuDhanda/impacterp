import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import {FlatList} from 'components/flatlist';
import Toast from 'react-native-toast-message';
import Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {UserContext} from '../../App';
import {useContext} from 'react';
import {Post as httpPost} from '../constants/httpService';

const StudentTokenFeesScreen = ({navigation}) => {
  const {user, setUser} = useContext(UserContext);
  const [tokenNumber, setTokenNumber] = useState({TokenNumber: ''});
  const [studentTokenFeesDeposit, setStudentTokenFeesDeposit] = useState({
    StudentTokenFeesId: 0,
    TokenNumber: '',
    Particulars: '',
    Deposit: 0,
    Refund: 0,
    IsActive: true,
    CreatedBy: user.userId,
  });
  const [studentTokenFeesRefund, setStudentTokenFeesRefund] = useState({
    StudentTokenFeesId: 0,
    TokenNumber: '',
    Particulars: '',
    Deposit: 0,
    Refund: 0,
    IsActive: true,
    CreatedBy: user.userId,
  });
  const [studentTokenFeesList, setStudentTokenFeesList] = useState([]);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const moveToRight = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [loading, setLoading] = useState(false);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [isEndReached, setIsEndReached] = useState(true);

  const handleHistory = () => {
    setStudentTokenFeesList([]);
    setSkip(0);
    if (tokenNumber.TokenNumber === '') {
      Toast.show({
        type: 'error',
        text1: 'Enter Token Number after Search History',
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    } else {
      navigation.navigate('StudentTokenFeesHistoryScreen', {
        tokenNumber: tokenNumber.TokenNumber,
      });
    }
  };

  const GetStudentTokenFeesList = () => {
    setLoading(true);
    const filter = {
      TokenNumber: tokenNumber.TokenNumber,
      Take: take,
      Skip: skip,
    };
    httpPost('StudentTokenFees/getStudentTokenFeesByTokenNumber', filter)
      .then(response => {
        setLoading(false);
        if (response.data.length >= 0) {
          setIsEndReached(false);
          setStudentTokenFeesList(response.data);
        }
        if (response.data.length === 0) {
          setIsEndReached(true);
          Toast.show({
            type: 'info',
            text1: 'No records found',
            position: 'bottom',
            visibilityTime: 2000,
            autoHide: true,
          });
        }
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
      });
  };

  const handleAddDepositStudentTokenFees = () => {
    setDepositModalVisible(true);
  };
  const handleAddRefundStudentTokenFees = () => {
    setRefundModalVisible(true);
  };

  const handleSaveStudentTokenFeesDeposit = () => {
    const filter = {
      TokenNumber: tokenNumber.TokenNumber,
      Take: take,
      Skip: skip,
    };
    httpPost('StudentTokenFees/TokenIsExists', filter)
      .then(response => {
        if (response.data === false) {
          Toast.show({
            type: 'error',
            text1: 'This Token Number is Not Exist',
            position: 'bottom',
            visibilityTime: 2000,
            autoHide: true,
          });
        } else {
          httpPost('StudentTokenFees/post', studentTokenFeesDeposit).then(
            response => {
              if (response.status === 200) {
                setStudentTokenFeesList([]);
                setSkip(0);
                Alert.alert(
                  'Sucess',
                  'StudentTokenFees Deposit is Added Successfully',
                );
                setLoading(true);
                const filter = {
                  TokenNumber: tokenNumber.TokenNumber,
                  Take: take,
                  Skip: 0,
                };
                httpPost(
                  'StudentTokenFees/getStudentTokenFeesByTokenNumber',
                  filter,
                )
                  .then(response => {
                    setLoading(false);
                    if (response.data.length >= 0) {
                      setIsEndReached(false);
                      setStudentTokenFeesList(response.data);
                    }
                    if (response.data.length === 0) {
                      setIsEndReached(true);
                      Toast.show({
                        type: 'info',
                        text1: 'No records found',
                        position: 'bottom',
                        visibilityTime: 2000,
                        autoHide: true,
                      });
                    }
                  })
                  .catch(error => {
                    setLoading(false);
                    console.error(
                      'Add Deposit Get Student Token Fees By Token Number error',
                      error,
                    );
                    Toast.show({
                      type: 'error',
                      text1: `${error}`,
                      position: 'bottom',
                      visibilityTime: 2000,
                      autoHide: true,
                    });
                  });
              }
            },
          );
          setDepositModalVisible(false);
        }
      })
      .catch(err => {
        console.error('Error in Token IsExists', err);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const handleSaveStudentTokenFeesRefund = () => {
    const filter = {
      TokenNumber: tokenNumber.TokenNumber,
      Take: take,
      Skip: skip,
    };
    httpPost('StudentTokenFees/TokenIsExists', filter)
      .then(response => {
        if (response.data === false) {
          Toast.show({
            type: 'error',
            text1: 'This Token Number is Not Exist',
            position: 'bottom',
            visibilityTime: 2000,
            autoHide: true,
          });
        } else {
          httpPost('StudentTokenFees/post', studentTokenFeesRefund).then(
            response => {
              if (response.status === 200) {
                setStudentTokenFeesList([]);
                setSkip(0);
                Alert.alert(
                  'Sucess',
                  'StudentTokenFees Refund is Added Successfully',
                );
                setLoading(true);
                const filter = {
                  TokenNumber: tokenNumber.TokenNumber,
                  Take: take,
                  Skip: 0,
                };
                httpPost(
                  'StudentTokenFees/getStudentTokenFeesByTokenNumber',
                  filter,
                )
                  .then(response => {
                    setLoading(false);
                    if (response.data.length >= 0) {
                      setIsEndReached(false);
                      setStudentTokenFeesList(response.data);
                    }
                    if (response.data.length === 0) {
                      setIsEndReached(true);
                      Toast.show({
                        type: 'info',
                        text1: 'No records found',
                        position: 'bottom',
                        visibilityTime: 2000,
                        autoHide: true,
                      });
                    }
                  })
                  .catch(error => {
                    setLoading(false);
                    console.error(
                      'Add Refund Get Student Token Fees By Token Number error',
                      error,
                    );
                    Toast.show({
                      type: 'error',
                      text1: `${error}`,
                      position: 'bottom',
                      visibilityTime: 2000,
                      autoHide: true,
                    });
                  });
              }
            },
          );
          setRefundModalVisible(false);
        }
      })
      .catch(err => {
        console.error('Get Student Token Fees Token Exist', err);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const handleCloseModal = () => {
    setDepositModalVisible(false);
    setRefundModalVisible(false);
  };

  const getFormattedDate = datestring => {
    const datetimeString = datestring;
    const date = new Date(datetimeString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const convertToIndianTimee = datetimeString => {
    const utcDate = new Date(datetimeString);

    // Convert to IST (Indian Standard Time)
    // utcDate.setMinutes(utcDate.getMinutes() + 330); // IST is UTC+5:30

    const istDate = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // Use 12-hour format with AM/PM
    }).format(utcDate);

    return istDate;
  };

  const handleLoadMore = async () => {
    console.log('Execute Handle More function');
    if (!isEndReached) {
      Toast.show({
        type: 'info',
        text1: 'Get More records Search History',
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{paddingVertical: 20}}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  const renderStudentTokenFeesCard = ({item}) => (
    <View
      style={{
        backgroundColor: Colors.background,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        shadowColor: Colors.shadow,
        shadowOffset: {width: 10, height: 2},
        shadowOpacity: 4,
        shadowRadius: 10,
        elevation: 10,
        borderWidth: 1,
        borderColor: Colors.primary,
      }}>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Student Name : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.studentName}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Batch Name : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.batchName}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Mobile : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.mobile}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Token Number : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.studentTokenId}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Particulars : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.particulars}
        </Text>
      </View>
      {item.deposit !== 0 ? (
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 16}}>Deposit : </Text>
          <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
            {item.deposit}
          </Text>
        </View>
      ) : null}
      {item.refund !== 0 ? (
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 16}}>Refund : </Text>
          <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
            {item.refund}
          </Text>
        </View>
      ) : null}
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Created At : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {convertToIndianTimee(item.createdAt)}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={{flex: 1}}>
        <Animated.View
          style={{
            flex: 1,
            position: 'absolute',
            top: 0,
            padding: 16,
            right: 0,
            left: 0,
            bottom: 0,
            backgroundColor: Colors.background,
            transform: [{scale: scale}, {translateX: moveToRight}],
          }}>
          <View
            style={{
              flexDirection: 'row',
              borderRadius: 10,
              borderColor: Colors.primary,
              borderWidth: 1,
              fontSize: 16,
              paddingHorizontal: 20,
            }}>
            <Icon
              style={{textAlignVertical: 'center'}}
              name="search"
              size={20}
            />
            <TextInput
              style={{flex: 1, marginLeft: 10}}
              placeholder="Enter Token Number"
              value={tokenNumber.TokenNumber}
              keyboardType="numeric"
              onChangeText={text => {
                setTokenNumber({...tokenNumber, TokenNumber: text});
                setStudentTokenFeesDeposit({
                  ...studentTokenFeesDeposit,
                  TokenNumber: text,
                });
                setStudentTokenFeesRefund({
                  ...studentTokenFeesRefund,
                  TokenNumber: text,
                });
                setStudentTokenFeesList([]);
                setSkip(0);
              }}
            />
          </View>

          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: Colors.primary,
                borderRadius: 5,
                paddingVertical: 8,
                paddingHorizontal: 12,
                marginTop: 10,
                marginRight: 3,
              }}
              onPress={handleAddDepositStudentTokenFees}>
              <Text
                style={{
                  color: Colors.background,
                  fontSize: 14,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}>
                Deposit Entry
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: Colors.primary,
                borderRadius: 5,
                paddingVertical: 8,
                paddingHorizontal: 12,
                marginTop: 10,
                marginRight: 3,
              }}
              onPress={handleAddRefundStudentTokenFees}>
              <Text
                style={{
                  color: Colors.background,
                  fontSize: 14,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}>
                Refund Entry
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: Colors.primary,
                borderRadius: 5,
                paddingVertical: 8,
                paddingHorizontal: 12,
                marginTop: 10,
              }}
              onPress={handleHistory}>
              <Text
                style={{
                  color: Colors.background,
                  fontSize: 14,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}>
                History
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={studentTokenFeesList}
            keyExtractor={item => item.studentTokenFeesId.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={renderStudentTokenFeesCard}
            onEndReached={() => {
              handleLoadMore();
            }}
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={0.1}
          />

          <Toast ref={ref => Toast.setRef(ref)} />

          {depositModalVisible && (
            <Modal transparent visible={depositModalVisible}>
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
                    padding: 20,
                    width: '80%',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      marginBottom: 10,
                      fontWeight: 'bold',
                      color: Colors.shadow,
                    }}>
                    Deposit Entry
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.primary,
                      borderRadius: 10,
                      padding: 8,
                      marginBottom: 20,
                      height: 80,
                      textAlignVertical: 'top',
                    }}
                    placeholder="Particulars"
                    multiline
                    value={studentTokenFeesDeposit.Particulars}
                    onChangeText={text =>
                      setStudentTokenFeesDeposit({
                        ...studentTokenFeesDeposit,
                        Particulars: text,
                      })
                    }
                  />
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.primary,
                      borderRadius: 10,
                      padding: 8,
                      marginBottom: 20,
                    }}
                    placeholder="Deposit"
                    keyboardType="numeric"
                    value={studentTokenFeesDeposit.Deposit}
                    onChangeText={text =>
                      setStudentTokenFeesDeposit({
                        ...studentTokenFeesDeposit,
                        Deposit: text,
                      })
                    }
                  />
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.primary,
                        borderRadius: 5,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                      }}
                      onPress={handleSaveStudentTokenFeesDeposit}>
                      <Text
                        style={{
                          color: Colors.background,
                          fontSize: 14,
                          fontWeight: 'bold',
                        }}>
                        {studentTokenFeesDeposit.StudentTokenFeesId === 0
                          ? 'Add'
                          : 'Save'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#f25252',
                        borderRadius: 5,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        marginLeft: 10,
                      }}
                      onPress={handleCloseModal}>
                      <Text
                        style={{
                          color: Colors.background,
                          fontSize: 14,
                          fontWeight: 'bold',
                        }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <Toast ref={ref => Toast.setRef(ref)} />
            </Modal>
          )}
          {refundModalVisible && (
            <Modal transparent visible={refundModalVisible}>
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
                    padding: 20,
                    width: '80%',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      marginBottom: 10,
                      color: Colors.shadow,
                      fontWeight: 'bold',
                    }}>
                    Refund Entry
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.primary,
                      borderRadius: 10,
                      padding: 8,
                      marginBottom: 20,
                      height: 80,
                      textAlignVertical: 'top',
                    }}
                    placeholder="Particulars"
                    multiline
                    value={studentTokenFeesRefund.Particulars}
                    onChangeText={text =>
                      setStudentTokenFeesRefund({
                        ...studentTokenFeesRefund,
                        Particulars: text,
                      })
                    }
                  />
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.primary,
                      borderRadius: 10,
                      padding: 8,
                      marginBottom: 20,
                    }}
                    placeholder="Refund"
                    keyboardType="numeric"
                    value={studentTokenFeesRefund.Refund}
                    onChangeText={text =>
                      setStudentTokenFeesRefund({
                        ...studentTokenFeesRefund,
                        Refund: text,
                      })
                    }
                  />
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.primary,
                        borderRadius: 5,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                      }}
                      onPress={handleSaveStudentTokenFeesRefund}>
                      <Text
                        style={{
                          color: Colors.background,
                          fontSize: 14,
                          fontWeight: 'bold',
                        }}>
                        {studentTokenFeesRefund.StudentTokenFeesId === 0
                          ? 'Add'
                          : 'Save'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#f25252',
                        borderRadius: 5,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        marginLeft: 10,
                      }}
                      onPress={handleCloseModal}>
                      <Text
                        style={{
                          color: Colors.background,
                          fontSize: 14,
                          fontWeight: 'bold',
                        }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <Toast ref={ref => Toast.setRef(ref)} />
            </Modal>
          )}
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default StudentTokenFeesScreen;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: 'white',
//     padding: 16,
//     justifyContent: 'center'
//   },
//   dropdown: {
//     height: 50,
//     borderColor: 'gray',
//     borderWidth: 0.5,
//     borderRadius: 8,
//     paddingHorizontal: 8,
//   },
//   addButton: {
//     backgroundColor: '#5a67f2',
//     borderRadius: 5,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     marginTop: 10,
//     alignSelf: 'flex-start',
//   },
//   addButtonText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   icon: {
//     marginRight: 5,
//   },
//   label: {
//     position: 'absolute',
//     backgroundColor: 'white',
//     left: 22,
//     top: 8,
//     zIndex: 999,
//     paddingHorizontal: 8,
//     fontSize: 14,
//   },
//   placeholderStyle: {
//     fontSize: 16,
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//   },
//   iconStyle: {
//     width: 20,
//     height: 20,
//   },
//   inputSearchStyle: {
//     height: 40,
//     fontSize: 16,
//   },
//   studentTokenFeesCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#ccc',
//     borderRadius: 10,
//     padding: 20,
//     marginBottom: 10,
//     marginTop: 10,
//     shadowColor: '#000000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   studentTokenFeesName: {
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
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     padding: 20,
//     width: '80%',
//   },
//   modalTextInput: {
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 8,
//     padding: 8,
//     marginBottom: 20,
//   },
//   modalButtonContainer: {
//     marginTop: 10,
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//   },
//   modalSaveButton: {
//     backgroundColor: '#5a67f2',
//     borderRadius: 5,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   modalCancelButton: {
//     backgroundColor: '#f25252',
//     borderRadius: 5,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     marginLeft: 10
//   },
//   modalButtonText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
// });

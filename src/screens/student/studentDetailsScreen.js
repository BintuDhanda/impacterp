import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Animated,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Colors from '../../constants/Colors';
import {Post as httpPost} from '../../constants/httpService';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {News_URL} from '../../constants/constant';

const StudentDetailsScreen = ({navigation}) => {
  const ToDate = new Date();
  ToDate.setDate(ToDate.getDate() + 1);
  const FromDate = new Date();
  FromDate.setDate(FromDate.getDate() - 7);
  const [studentDetailsList, setStudentDetailsList] = useState([]);
  const moveToRight = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(
    FromDate.toISOString().slice(0, 10).toString(),
  );
  const [toDate, setToDate] = useState(
    ToDate.toISOString().slice(0, 10).toString(),
  );
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [mobile, setMobile] = useState('');
  const [isEndReached, setIsEndReached] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{marginRight: 15}}
          onPress={() => setShowSearch(true)}>
          <Icon name="search" size={20} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const [selectFromDate, setSelectFromDate] = useState(
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
  );
  const [selectToDate, setSelectToDate] = useState(
    new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [studentDeleteId, setStudentDeleteId] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  const handleFromDateChange = (event, date) => {
    if (date !== undefined) {
      setSelectFromDate(date);
      setFromDate(getFormattedDate(date));
    }
    setShowDatePicker(false);
  };

  const handleOpenFromDatePicker = () => {
    setShowDatePicker(true);
  };
  const handleConfirmFromDatePicker = () => {
    setShowDatePicker(false);
  };

  const handleToDateChange = (event, date) => {
    if (date !== undefined) {
      setSelectToDate(date);
      setToDate(getFormattedDate(date));
    }
    setShowToDatePicker(false);
  };

  const handleOpenToDatePicker = () => {
    setShowToDatePicker(true);
  };

  const handleConfirmToDatePicker = () => {
    setShowToDatePicker(false);
  };

  const handleSearch = () => {
    setStudentDetailsList([]);
    setSkip(0);
    GetStudentList();
    setShowSearch(false);
  };

  const DeleteStudentIdConfirm = studentid => {
    setStudentDeleteId(studentid);
  };

  const DeleteStudentIdConfirmYes = () => {
    httpGet(`StudentDetails/delete?Id=${studentDeleteId}`)
      .then(result => {
        console.log(result);
        GetStudentList();
        setStudentDeleteId(0);
        setShowDelete(false);
      })
      .catch(error => {
        console.error('Delete Student error', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const DeleteStudentIdConfirmNo = () => {
    setStudentDeleteId(0);
    setShowDelete(false);
  };

  const handleNavigate = studentId => {
    navigation.navigate('StudentFormScreen', {studentId: studentId});
  };

  const handleAddAddressNavigate = studentId => {
    navigation.navigate('AddressScreen', {studentId: studentId});
  };
  const handleAddStudentQualificationNavigate = studentId => {
    navigation.navigate('StudentQualificationScreen', {studentId: studentId});
  };
  const handleAddStudentTokenNavigate = (studentId, label) => {
    navigation.navigate('StudentTokenScreen', {
      studentId: studentId,
      studentName: label,
    });
  };
  const handleAddStudentBatchNavigate = studentId => {
    navigation.navigate('StudentBatchScreen', {studentId: studentId});
  };

  const GetStudentList = () => {
    setLoading(true);
    const filter = {
      From: fromDate,
      To: toDate,
      Take: take,
      Skip: skip,
      Mobile: mobile,
    };
    httpPost('StudentDetails/get', filter)
      .then(response => {
        console.log(response.data, 'StudentDetails list');
        const studentDetailsArray = response.data.map(studentDetails => ({
          value: studentDetails.studentId,
          studentImage: studentDetails.studentImage,
          label: studentDetails.firstName + ' ' + studentDetails.lastName,
          father: studentDetails.fatherName,
          mother: studentDetails.motherName,
          mobile: studentDetails.mobile,
          totalStudent: studentDetails.totalStudent,
        }));
        setLoading(false);
        if (studentDetailsArray.length >= 0) {
          setIsEndReached(false);
          setStudentDetailsList([
            ...studentDetailsList,
            ...studentDetailsArray,
          ]);
          setSkip(skip + 10);
        }
        if (studentDetailsArray.length === 0) {
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
        console.error(error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const getFormattedDate = datestring => {
    const datetimeString = datestring;
    const date = new Date(datetimeString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleLoadMore = async () => {
    console.log('Execute Handle More function');
    if (!isEndReached) {
      GetStudentList();
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

  const renderStudentDetailsCard = ({item}) => (
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
        borderWidth: 1.5,
        borderColor: Colors.primary,
      }}>
      <Image
        source={
          item.studentImage == null
            ? require('../../icons/user.png')
            : {uri: News_URL + item.studentImage}
        }
        style={{width: 100, height: 100, borderRadius: 50, marginBottom: 10}}
      />
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Student Name : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.label}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Father Name : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.father}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Mother Name : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.mother}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Mobile : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.mobile}
        </Text>
      </View>

      <View style={{flexDirection: 'row', marginTop: 10}}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: Colors.primary,
            borderRadius: 5,
            paddingVertical: 8,
            paddingHorizontal: 12,
            marginRight: 3,
          }}
          onPress={() => handleAddAddressNavigate(item.value)}>
          <Text
            style={{
              color: Colors.background,
              fontSize: 14,
              fontWeight: 'bold',
              alignSelf: 'center',
            }}>
            Address
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 5,
            paddingVertical: 8,
            paddingHorizontal: 5,
            marginRight: 3,
          }}
          onPress={() => handleAddStudentQualificationNavigate(item.value)}>
          <Text
            style={{
              color: Colors.background,
              fontSize: 14,
              fontWeight: 'bold',
              alignSelf: 'center',
            }}>
            Qualification
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: Colors.primary,
            borderRadius: 5,
            paddingVertical: 8,
            paddingHorizontal: 12,
            marginRight: 3,
          }}
          onPress={() => handleAddStudentTokenNavigate(item.value, item.label)}>
          <Text
            style={{
              color: Colors.background,
              fontSize: 14,
              fontWeight: 'bold',
              alignSelf: 'center',
            }}>
            Token
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: Colors.primary,
            borderRadius: 5,
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
          onPress={() => handleAddStudentBatchNavigate(item.value)}>
          <Text
            style={{
              color: Colors.background,
              fontSize: 14,
              fontWeight: 'bold',
              alignSelf: 'center',
            }}>
            Batch
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity
          style={{marginRight: 10}}
          onPress={() => {
            handleNavigate(item.value);
            setStudentDetailsList([]);
            setSkip(0);
          }}>
          <Icon
            name="pencil"
            size={20}
            color={'#5a67f2'}
            style={{marginLeft: 8, textAlignVertical: 'center'}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            DeleteStudentIdConfirm(item.value);
            setShowDelete(true);
            setStudentDetailsList([]);
            setSkip(0);
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
          {showSearch && (
            <Modal transparent visible={showSearch}>
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
                    borderWidth: 0.5,
                    borderColor: Colors.primary,
                  }}>
                  <Text style={{fontSize: 16, marginBottom: 5}}>
                    From Date :
                  </Text>
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
                    <TouchableOpacity onPress={handleOpenFromDatePicker}>
                      <Icon name={'calendar'} size={25} />
                    </TouchableOpacity>
                    <TextInput
                      style={{
                        marginLeft: 10,
                        fontSize: 16,
                        color: Colors.secondary,
                      }}
                      value={getFormattedDate(selectFromDate)}
                      placeholder="Select From date"
                      editable={false}
                    />
                  </View>
                  {showDatePicker && (
                    <DateTimePicker
                      value={selectFromDate}
                      mode="date"
                      display="default"
                      onChange={handleFromDateChange}
                      onConfirm={handleConfirmFromDatePicker}
                      onCancel={handleConfirmFromDatePicker}
                    />
                  )}

                  <Text style={{fontSize: 16, marginBottom: 5}}>To Date :</Text>
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
                    <TouchableOpacity onPress={handleOpenToDatePicker}>
                      <Icon name={'calendar'} size={25} />
                    </TouchableOpacity>
                    <TextInput
                      style={{
                        marginLeft: 10,
                        fontSize: 16,
                        color: Colors.secondary,
                      }}
                      value={getFormattedDate(selectToDate)}
                      placeholder="Select To date"
                      editable={false}
                    />
                  </View>
                  {showToDatePicker && (
                    <DateTimePicker
                      value={selectToDate}
                      mode="date"
                      display="default"
                      onChange={handleToDateChange}
                      onConfirm={handleConfirmToDatePicker}
                      onCancel={handleConfirmToDatePicker}
                    />
                  )}
                  <Text style={{fontSize: 20, marginBottom: 5}}>Or</Text>
                  <Text style={{fontSize: 16, marginBottom: 5}}>Mobile :</Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.primary,
                      borderRadius: 8,
                      marginBottom: 20,
                      padding: 8,
                    }}
                    placeholder="Enter Mobile"
                    value={mobile}
                    keyboardType="numeric"
                    maxLength={10}
                    onChangeText={text => setMobile(text)}
                  />
                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
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
                        handleSearch();
                      }}>
                      <Text style={{fontSize: 16, color: Colors.background}}>
                        Search
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
                        setShowSearch(false);
                      }}>
                      <Text style={{fontSize: 16, color: Colors.background}}>
                        Close
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

                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
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
                        DeleteStudentIdConfirmYes();
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
                        DeleteStudentIdConfirmNo();
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
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 18,
                marginBottom: 10,
                color: Colors.secondary,
              }}>
              Total Student :{' '}
              {studentDetailsList.length === 0
                ? null
                : studentDetailsList[0].totalStudent}
            </Text>
          </View>
          <FlatList
            data={studentDetailsList}
            keyExtractor={item => item.value.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={renderStudentDetailsCard}
            ListFooterComponent={renderFooter}
            onEndReached={() => {
              handleLoadMore();
            }}
            onEndReachedThreshold={0.1}
          />

          <Toast ref={ref => Toast.setRef(ref)} />
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default StudentDetailsScreen;

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
//   studentDetailsCard: {
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
//   studentDetailsName: {
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

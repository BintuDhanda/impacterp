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
import {Dropdown} from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import Colors from '../constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {UserContext} from '../../App';
import {useContext} from 'react';
import {Get as httpGet, Post as httpPost} from '../constants/httpService';

const DayBookScreen = () => {
  const {user, setUser} = useContext(UserContext);
  const ToDate = new Date();
  ToDate.setDate(ToDate.getDate() + 1);
  const FromDate = new Date();
  FromDate.setDate(FromDate.getDate() - 7);
  const [dayBookCredit, setDayBookCredit] = useState({
    DayBookId: 0,
    Particulars: '',
    Credit: 0,
    Debit: 0,
    IsActive: true,
    AccountId: '',
    CreatedAt: null,
    CreatedBy: user.userId,
    LastUpdatedBy: null,
  });
  const [dayBookDebit, setDayBookDebit] = useState({
    DayBookId: 0,
    Particulars: '',
    Credit: 0,
    Debit: 0,
    IsActive: true,
    AccountId: '',
    CreatedAt: null,
    CreatedBy: user.userId,
    LastUpdatedBy: null,
  });
  const [dayBookList, setDayBookList] = useState([]);
  const [creditModalVisible, setCreditModalVisible] = useState(false);
  const [debitModalVisible, setDebitModalVisible] = useState(false);
  const moveToRight = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [isFocus, setIsFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(
    FromDate.toISOString().slice(0, 10).toString(),
  );
  const [toDate, setToDate] = useState(
    ToDate.toISOString().slice(0, 10).toString(),
  );
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [accountList, setAccountList] = useState([]);
  const [isEndReached, setIsEndReached] = useState(true);

  const [selectFromDate, setSelectFromDate] = useState(
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
  );
  const [selectToDate, setSelectToDate] = useState(
    new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [sumCreditAndDebitDayBook, setSumCreditAndDebitDayBook] = useState({});
  const [dayBookDeleteId, setDayBookDeleteId] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  const GetSumDayBookCreditAndDebitDayBook = () => {
    const filter = {From: fromDate, To: toDate};
    httpPost('DayBook/sumCreditAndDebitDayBook', filter)
      .then(response => {
        setSumCreditAndDebitDayBook(response.data);
      })
      .catch(err => {
        console.error('Sum Credit And Debit DayBook', err);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const handleFromDateChange = (event, date) => {
    if (date !== undefined) {
      setSelectFromDate(date);
      setFromDate(getFormattedDate(date));
      setSkip(0);
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
      setSkip(0);
    }
    setShowToDatePicker(false);
  };

  const handleOpenToDatePicker = () => {
    setShowToDatePicker(true);
  };

  const handleConfirmToDatePicker = () => {
    setShowToDatePicker(false);
  };

  // Function to handle button press
  const handleSearch = () => {
    setDayBookList([]);
    setSkip(0);
    GetDayBookList();
    GetSumDayBookCreditAndDebitDayBook();
    setShowSearch(false);
  };

  useEffect(() => {
    if (accountList.length == 0) {
      GetAccountList();
    }
  }, []);

  const GetAccountList = () => {
    httpGet('Account/get')
      .then(response => {
        console.log(response.data, 'Account list');
        const accountArray = response.data.map(account => ({
          value: account.accountId,
          label: account.accountName,
        }));
        setAccountList(accountArray);
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
  const GetDayBookList = () => {
    setLoading(true);
    const filter = {
      From: fromDate,
      To: toDate,
      Take: take,
      Skip: skip,
      Mobile: '',
    };
    httpPost('DayBook/get', filter)
      .then(response => {
        setLoading(false);
        if (response.data.length >= 0) {
          setIsEndReached(false);
          setDayBookList([...dayBookList, ...response.data]);
          setSkip(skip + 10);
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
        console.error('Get DayBook List Error : ', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const handleAddCreditDayBook = () => {
    setDayBookCredit({
      DayBookId: 0,
      Particulars: '',
      Credit: 0,
      Debit: 0,
      IsActive: true,
      CreatedAt: null,
      AccountId: '',
      CreatedBy: user.userId,
      LastUpdatedBy: null,
    });
    setCreditModalVisible(true);
  };
  const handleAddDebitDayBook = () => {
    setDayBookDebit({
      DayBookId: 0,
      Particulars: '',
      Credit: 0,
      Debit: 0,
      IsActive: true,
      AccountId: '',
      CreatedAt: null,
      CreatedBy: user.userId,
      LastUpdatedBy: null,
    });
    setDebitModalVisible(true);
  };

  const DeleteDayBookIdConfirm = dayBookid => {
    setDayBookDeleteId(dayBookid);
  };

  const DeleteDayBookIdConfirmYes = () => {
    httpGet(`DayBook/delete?Id=${dayBookDeleteId}`)
      .then(result => {
        console.log(result);
        GetDayBookList();
        setSkip(0);
        setDayBookDeleteId(0);
        setShowDelete(false);
      })
      .catch(error => {
        console.error('Delete DayBook error', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const DeleteDayBookIdConfirmNo = () => {
    setDayBookDeleteId(0);
    setShowDelete(false);
  };

  const handleSaveDayBookCredit = async () => {
    try {
      if (dayBookCredit.Credit !== 0) {
        await httpPost('DayBook/post', dayBookCredit).then(response => {
          if (response.status === 200) {
            setDayBookList([]);
            setSkip(0);
            GetDayBookList();
            Alert.alert('Sucess', 'DayBook Credit is Added Successfully');
            setDayBookCredit({
              DayBookId: 0,
              Particulars: '',
              Credit: 0,
              Debit: 0,
              AccountId: '',
              IsActive: true,
              CreatedAt: null,
              CreatedBy: user.userId,
              LastUpdatedBy: null,
            });
          }
        });
      }
      setCreditModalVisible(false);
    } catch (error) {
      console.error('Error saving DayBook:', error);
      Toast.show({
        type: 'error',
        text1: `${error}`,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const handleSaveDayBookDebit = async () => {
    try {
      if (dayBookDebit.Debit !== 0) {
        await httpPost('DayBook/post', dayBookDebit).then(response => {
          if (response.status === 200) {
            setDayBookList([]);
            setSkip(0);
            GetDayBookList();
            Alert.alert('Sucess', 'DayBook Debit is Added Successfully');
            setDayBookDebit({
              DayBookId: 0,
              Particulars: '',
              Credit: 0,
              Debit: 0,
              AccountId: '',
              IsActive: true,
              CreatedAt: null,
              CreatedBy: user.userId,
              LastUpdatedBy: null,
            });
          }
        });
      }
      setDebitModalVisible(false);
    } catch (error) {
      console.error('Error saving DayBook:', error);
      Toast.show({
        type: 'error',
        text1: `${error}`,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const handleCloseModal = () => {
    setCreditModalVisible(false);
    setDebitModalVisible(false);
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

  const handleLoadMore = () => {
    console.log('Execute Handle More function');
    if (!isEndReached) {
      // setSkip(skip + 10)
      GetDayBookList();
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

  const renderDayBookCard = ({item}) => (
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
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Particulars : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.particulars}
        </Text>
      </View>
      {item.credit !== 0 ? (
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 16}}>Credit : </Text>
          <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
            {item.credit}
          </Text>
        </View>
      ) : null}
      {item.debit !== 0 ? (
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 16}}>Debit : </Text>
          <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
            {item.debit}
          </Text>
        </View>
      ) : null}
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Created At : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {convertToIndianTimee(item.createdAt)}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Account : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.account}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity
          onPress={() => {
            DeleteDayBookIdConfirm(item.dayBookId);
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 14,
                marginBottom: 10,
                marginRight: 10,
                fontWeight: 'bold',
                backgroundColor: Colors.primary,
                borderRadius: 5,
                paddingVertical: 8,
                paddingHorizontal: 12,
                flex: 1,
                color: Colors.background,
              }}>
              Total Credit : {sumCreditAndDebitDayBook.credit} Rs/-
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginBottom: 10,
                fontWeight: 'bold',
                backgroundColor: Colors.primary,
                borderRadius: 5,
                paddingVertical: 8,
                paddingHorizontal: 12,
                flex: 1,
                color: Colors.background,
              }}>
              Total Debit : {sumCreditAndDebitDayBook.debit} Rs/-
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setShowSearch(true);
              setDayBookList([]);
            }}>
            <View
              style={{
                flexDirection: 'row',
                borderRadius: 10,
                borderColor: Colors.primary,
                marginBottom: 10,
                borderWidth: 1.5,
                fontSize: 16,
                paddingHorizontal: 20,
              }}>
              <TextInput
                style={{flex: 1, fontWeight: 'bold'}}
                editable={false}
                placeholder="Search..."
              />
              <Icon
                style={{textAlignVertical: 'center'}}
                name="search"
                size={30}
              />
            </View>
          </TouchableOpacity>
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
              onPress={() => {
                handleAddCreditDayBook();
                setDayBookList([]);
                setSkip(0);
              }}>
              <Text
                style={{
                  color: Colors.background,
                  fontSize: 14,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}>
                Credit DayBook Entry
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
              onPress={() => {
                handleAddDebitDayBook();
                setDayBookList([]);
                setSkip(0);
              }}>
              <Text
                style={{
                  color: Colors.background,
                  fontSize: 14,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}>
                Debit DayBook Entry
              </Text>
            </TouchableOpacity>
          </View>
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
                        DeleteDayBookIdConfirmYes();
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
                        DeleteDayBookIdConfirmNo();
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

          <FlatList
            data={dayBookList}
            keyExtractor={item => item.dayBookId.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={renderDayBookCard}
            ListFooterComponent={renderFooter}
            onEndReached={() => {
              handleLoadMore();
            }}
            onEndReachedThreshold={0.1}
          />

          <Toast ref={ref => Toast.setRef(ref)} />

          {creditModalVisible && (
            <Modal transparent visible={creditModalVisible}>
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
                    Credit Entry
                  </Text>
                  <Dropdown
                    style={[
                      {
                        height: 50,
                        borderColor: Colors.primary,
                        borderWidth: 1,
                        borderRadius: 10,
                        paddingHorizontal: 8,
                        marginBottom: 20,
                      },
                      isFocus && {borderColor: 'blue'},
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
                    data={accountList}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Select Account' : '...'}
                    searchPlaceholder="Search..."
                    value={dayBookCredit.AccountId}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={value =>
                      setDayBookCredit({
                        ...dayBookCredit,
                        AccountId: value.value,
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
                      height: 80,
                      textAlignVertical: 'top',
                    }}
                    placeholder="Particulars"
                    multiline
                    value={dayBookCredit.Particulars}
                    onChangeText={text =>
                      setDayBookCredit({...dayBookCredit, Particulars: text})
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
                    placeholder="Credit"
                    keyboardType="numeric"
                    value={dayBookCredit.Credit}
                    onChangeText={text =>
                      setDayBookCredit({...dayBookCredit, Credit: text})
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
                      onPress={handleSaveDayBookCredit}>
                      <Text
                        style={{
                          color: Colors.background,
                          fontSize: 14,
                          fontWeight: 'bold',
                        }}>
                        {dayBookCredit.DayBookId === 0 ? 'Add' : 'Save'}
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
            </Modal>
          )}
          {debitModalVisible && (
            <Modal transparent visible={debitModalVisible}>
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
                    Debit Entry
                  </Text>
                  <Dropdown
                    style={[
                      {
                        height: 50,
                        borderColor: Colors.primary,
                        borderWidth: 1,
                        borderRadius: 10,
                        paddingHorizontal: 8,
                        marginBottom: 20,
                      },
                      isFocus && {borderColor: 'blue'},
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
                    data={accountList}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Select Account' : '...'}
                    searchPlaceholder="Search..."
                    value={setDayBookDebit.AccountId}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={value =>
                      setDayBookDebit({...dayBookDebit, AccountId: value.value})
                    }
                  />
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
                    value={dayBookDebit.Particulars}
                    onChangeText={text =>
                      setDayBookDebit({...dayBookDebit, Particulars: text})
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
                    placeholder="Debit"
                    keyboardType="numeric"
                    value={dayBookDebit.Debit}
                    onChangeText={text =>
                      setDayBookDebit({...dayBookDebit, Debit: text})
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
                      onPress={handleSaveDayBookDebit}>
                      <Text
                        style={{
                          color: Colors.background,
                          fontSize: 14,
                          fontWeight: 'bold',
                        }}>
                        {dayBookDebit.DayBookId === 0 ? 'Add' : 'Save'}
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
            </Modal>
          )}
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default DayBookScreen;

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
//   dayBookCard: {
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
//   dayBookName: {
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

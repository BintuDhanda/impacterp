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
import {FlatList} from '@src/components/flatlist';
import Toast from 'react-native-toast-message';
import Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';
import {Post as httpPost, Get as httpGet} from '../constants/httpService';

const StudentTokenFeesHistoryScreen = ({route, navigation}) => {
  const {tokenNumber} = route.params;
  const [studentTokenFeesList, setStudentTokenFeesList] = useState([]);
  const moveToRight = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [loading, setLoading] = useState(false);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [isEndReached, setIsEndReached] = useState(true);
  const [sumDepositAndRefund, setSumDepositAndRefund] = useState({});
  const [studentTokenFeesDeleteId, setStudentTokenFeesDeleteId] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      GetStudentTokenFeesList();
      GetSumStudentDepositAndRefund();
    }, []),
  );

  const GetSumStudentDepositAndRefund = () => {
    httpGet(
      `StudentTokenFees/sumDepositAndRefund?studentTokenId=${tokenNumber}`,
    )
      .then(response => {
        setSumDepositAndRefund(response.data);
      })
      .catch(err => {
        console.error('Sum Deposit And Refund Error : ', err);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const GetStudentTokenFeesList = () => {
    setLoading(true);
    const filter = {TokenNumber: tokenNumber, Take: take, Skip: skip};
    httpPost('StudentTokenFees/getStudentTokenFeesByTokenNumber', filter)
      .then(response => {
        console.log(studentTokenFeesList, 'StudentTokenFeesList');
        setLoading(false);
        if (response.data.length >= 0) {
          setIsEndReached(false);
          setStudentTokenFeesList([...studentTokenFeesList, ...response.data]);
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

  const DeleteStudentTokenFeesIdConfirm = studentTokenFeesid => {
    setStudentTokenFeesDeleteId(studentTokenFeesid);
  };

  const DeleteStudentTokenFeesIdConfirmYes = () => {
    httpGet(`StudentTokenFees/delete?Id=${studentTokenFeesDeleteId}`)
      .then(result => {
        console.log(result);
        navigation.goBack();
        setStudentTokenFeesDeleteId(0);
        setShowDelete(false);
      })
      .catch(error => {
        console.error('Delete StudentTokenFees error', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const DeleteStudentTokenFeesIdConfirmNo = () => {
    setStudentTokenFeesDeleteId(0);
    setShowDelete(false);
  };

  const handleLoadMore = async () => {
    console.log('Execute Handle More function');
    if (!isEndReached) {
      GetStudentTokenFeesList();
    }
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
        borderWidth: 1.5,
        borderColor: Colors.primary,
      }}>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Student Name : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.studentName}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Token Name : </Text>
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
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity
          onPress={() => {
            DeleteStudentTokenFeesIdConfirm(item.studentTokenFeesId);
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
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{flexGrow: 1}}>
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
              Total Deposit : {sumDepositAndRefund.deposit} Rs/-
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
              Total Refund : {sumDepositAndRefund.refund} Rs/-
            </Text>
          </View>

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
                        DeleteStudentTokenFeesIdConfirmYes();
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
                        DeleteStudentTokenFeesIdConfirmNo();
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
            data={studentTokenFeesList}
            keyExtractor={item => item.studentTokenFeesId.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={renderStudentTokenFeesCard}
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
export default StudentTokenFeesHistoryScreen;

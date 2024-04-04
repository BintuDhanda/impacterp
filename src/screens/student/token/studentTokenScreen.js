import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {FlatList} from '@src/components/flatlist';
import Colors from '../../../constants/Colors';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Get as httpGet} from '../../../constants/httpService';

const StudentTokenScreen = ({route, navigation}) => {
  const {studentId, studentName} = route.params;
  const [tokenList, setTokenList] = useState([]);
  const [studentTokenDeleteId, setStudentTokenDeleteId] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      GetStudentTokenByStudentId();
    }, []),
  );

  const GetStudentTokenByStudentId = async () => {
    try {
      console.log(studentId, 'studentId');
      const response = await httpGet(
        `StudentToken/getStudentTokenByStudentId?StudentId=${studentId}`,
      );
      console.log(response.data, 'response');
      setTokenList(response.data);
    } catch (error) {
      console.error('Error fetching Student Token List:', error);
      Toast.show({
        type: 'error',
        text1: `${error}`,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const DeleteStudentTokenIdConfirm = studentTokenid => {
    setStudentTokenDeleteId(studentTokenid);
  };

  const DeleteStudentTokenIdConfirmYes = () => {
    httpGet(`StudentToken/delete?Id=${studentTokenDeleteId}`)
      .then(result => {
        console.log(result);
        GetStudentTokenByStudentId();
        setStudentTokenDeleteId(0);
        setShowDelete(false);
      })
      .catch(error => {
        console.error('Delete Student Token error', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const DeleteStudentTokenIdConfirmNo = () => {
    setStudentTokenDeleteId(0);
    setShowDelete(false);
  };

  const handleAddStudentTokenNavigate = () => {
    navigation.navigate('StudentTokenFormScreen', {studentId: studentId});
  };

  const handleEditStudentTokenNavigate = (tokenId, batchName) => {
    navigation.navigate('StudentTokenFormScreen', {
      studentId: studentId,
      tokenId: tokenId,
      batchName: batchName,
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
  const renderTokenCard = ({item}) => (
    <View
      style={{
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
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Student Name : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {studentName}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Batch Name : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.batchName}
        </Text>
      </View>
      {item.validFrom === null ? null : (
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 16}}>Valid From : </Text>
          <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
            {convertToIndianTimee(item.validFrom)}
          </Text>
        </View>
      )}
      {item.validUpto === null ? null : (
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 16}}>Valid UpTo : </Text>
          <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
            {convertToIndianTimee(item.validUpto)}
          </Text>
        </View>
      )}
      {item.tokenFee === null ? null : (
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 16}}>Token Fee : </Text>
          <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
            {item.tokenFee +
              ' (' +
              'Total Deposit : ' +
              item.totalDeposit +
              ', Total Refund : ' +
              item.totalRefund +
              ' )'}
          </Text>
        </View>
      )}
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Token Status : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.tokenStatus === true ? 'Active' : 'InActive'}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Token Number : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.studentTokenId}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Is Valid For Admission : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.isValidForAdmissionNonMapped == 'False' ? 'No' : 'Yes'}
        </Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        {/* <TouchableOpacity style={{ marginRight: 10, }} onPress={() => handleEditStudentTokenNavigate(item.studentTokenId, item.batchName)}>
          <Icon name="pencil" size={20} color={'#5a67f2'} style={{ marginLeft: 8, textAlignVertical: 'center' }} />
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => {
            DeleteStudentTokenIdConfirm(item.studentTokenId);
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
      <View
        style={{
          padding: 16,
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
          onPress={handleAddStudentTokenNavigate}>
          <Text
            style={{
              color: Colors.background,
              fontSize: 14,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Apply Token
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
                      DeleteStudentTokenIdConfirmYes();
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
                      DeleteStudentTokenIdConfirmNo();
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
          data={tokenList}
          keyExtractor={item => item.studentTokenId.toString()}
          renderItem={renderTokenCard}
        />
        <Toast ref={ref => Toast.setRef(ref)} />
      </View>
    </ScrollView>
  );
};

export default StudentTokenScreen;

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
//   tokenCard: {
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
//   tokenName: {
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

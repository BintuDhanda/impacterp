import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {FlatList} from '@src/components/flatlist';
import Colors from '../../../constants/Colors';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';
import {Get as httpGet} from '../../../constants/httpService';

const StudentBatchScreen = ({route, navigation}) => {
  const {studentId} = route.params;
  const [batchList, setBatchList] = useState([]);
  const [studentBatchDeleteId, setStudentBatchDeleteId] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      GetStudentBatchByStudentId();
    }, []),
  );

  const GetStudentBatchByStudentId = () => {
    httpGet(`StudentBatch/getStudentBatchByStudentId?Id=${studentId}`)
      .then(response => {
        console.log(response.data);
        setBatchList(response.data);
      })
      .catch(error => {
        console.error(error, 'Get Student Batch By Student Id Error');
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const handleAddStudentBatchNavigate = () => {
    navigation.navigate('StudentBatchFormScreen', {studentId: studentId});
  };

  const handleEditStudentBatchNavigate = batchId => {
    navigation.navigate('StudentBatchFormScreen', {
      studentId: studentId,
      batchId: batchId,
    });
  };

  const handleStudentIdentitiesNavigate = studentBatchid => {
    navigation.navigate('StudentIdentitiesScreen', {
      studentBatchid: studentBatchid,
    });
  };

  const DeleteStudentBatchIdConfirm = studentBatchid => {
    setStudentBatchDeleteId(studentBatchid);
  };

  const DeleteStudentBatchIdConfirmYes = () => {
    httpGet(`StudentBatch/delete?Id=${studentBatchDeleteId}`)
      .then(result => {
        console.log(result);
        GetStudentBatchByStudentId();
        setStudentBatchDeleteId(0);
        setShowDelete(false);
      })
      .catch(error => {
        console.error('Delete Student Batch error', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const DeleteStudentBatchIdConfirmNo = () => {
    setStudentBatchDeleteId(0);
    setShowDelete(false);
  };

  const getFormattedDate = datestring => {
    const datetimeString = datestring;
    const date = new Date(datetimeString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const renderBatchCard = ({item}) => (
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
        <Text style={{fontSize: 16}}>Batch Name : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.batchName}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Date Of Join : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {getFormattedDate(item.dateOfJoin)}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Registration Number : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.registrationNumber}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Token Number : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.tokenNumber}
        </Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <TouchableOpacity
          style={{marginRight: 10}}
          onPress={() => handleEditStudentBatchNavigate(item.studentBatchId)}>
          <Icon
            name="pencil"
            size={20}
            color={'#5a67f2'}
            style={{marginLeft: 8, textAlignVertical: 'center'}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginRight: 10}}
          onPress={() => handleStudentIdentitiesNavigate(item.studentBatchId)}>
          <Icon
            name="file"
            size={20}
            color={'#006E33'}
            style={{marginLeft: 8, textAlignVertical: 'center'}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            DeleteStudentBatchIdConfirm(item.studentBatchId),
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
          onPress={handleAddStudentBatchNavigate}>
          <Text
            style={{
              color: Colors.background,
              fontSize: 14,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Add Batch
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
                      DeleteStudentBatchIdConfirmYes();
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
                      DeleteStudentBatchIdConfirmNo();
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
          data={batchList}
          keyExtractor={item => item.studentBatchId.toString()}
          renderItem={renderBatchCard}
        />
        <Toast ref={ref => Toast.setRef(ref)} />
      </View>
    </ScrollView>
  );
};

export default StudentBatchScreen;

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
//   batchCard: {
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
//   batchName: {
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

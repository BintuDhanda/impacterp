import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import {FlatList} from '@src/components/flatlist';
import Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import {UserContext} from '../../App';
import {useContext} from 'react';
import {
  Get as httpGet,
  Post as httpPost,
  Put as httpPut,
  Delete as httpDelete,
} from '../constants/httpService';

const QualificationScreen = () => {
  const {user, setUser} = useContext(UserContext);
  const [qualification, setQualification] = useState({
    QualificationId: 0,
    QualificationName: '',
    IsActive: true,
    CreatedAt: null,
    CreatedBy: user.userId,
    LastUpdatedBy: null,
  });
  const [qualificationList, setQualificationList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [qualificationDeleteId, setQualificationDeleteId] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    GetQualificationList();
  }, []);
  const GetQualificationList = () => {
    httpGet('Qualification/get')
      .then(result => {
        console.log(result.data);
        setQualificationList(result.data);
      })
      .catch(err => {
        console.log('Get Qualification error :', err);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };
  const handleAddQualification = () => {
    setQualification({
      QualificationId: 0,
      QualificationName: '',
      IsActive: true,
      CreatedAt: null,
      CreatedBy: user.userId,
      LastUpdatedBy: null,
    });
    setModalVisible(true);
  };

  const handleSaveQualification = () => {
    try {
      if (qualification.QualificationId !== 0) {
        httpPost('Qualification/put', qualification)
          .then(response => {
            if (response.status === 200) {
              GetQualificationList();
              Alert.alert('Sucees', 'Update Qualification Successfully');
              setQualification({
                QualificationId: 0,
                QualificationName: '',
                IsActive: true,
                CreatedAt: null,
                CreatedBy: user.userId,
                LastUpdatedBy: null,
              });
            }
          })
          .catch(err => {
            console.log('Qualification update error : ', err);
            Toast.show({
              type: 'error',
              text1: `${err}`,
              position: 'bottom',
              visibilityTime: 2000,
              autoHide: true,
            });
          });
      } else {
        httpPost('Qualification/post', qualification)
          .then(response => {
            if (response.status === 200) {
              GetQualificationList();
              Alert.alert('Success', 'Add Qualification Successfully');
              setQualification({
                QualificationId: 0,
                QualificationName: '',
                IsActive: true,
                CreatedAt: null,
                CreatedBy: user.userId,
                LastUpdatedBy: null,
              });
            }
          })
          .catch(err => {
            console.log('Qualification Add error :', err);
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
      console.log('Error saving Qualification:', error);
      Toast.show({
        type: 'error',
        text1: `${error}`,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const DeleteQualificationIdConfirm = qualificationid => {
    setQualificationDeleteId(qualificationid);
  };

  const DeleteQualificationIdConfirmYes = () => {
    httpGet(`Qualification/delete?Id=${qualificationDeleteId}`)
      .then(result => {
        console.log(result);
        GetQualificationList();
        setQualificationDeleteId(0);
        setShowDelete(false);
      })
      .catch(error => {
        console.error('Delete Qualification error', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const DeleteQualificationIdConfirmNo = () => {
    setQualificationDeleteId(0);
    setShowDelete(false);
  };

  const handleEditQualification = qualificationId => {
    httpGet(`Qualification/getById?Id=${qualificationId}`)
      .then(response => {
        setQualification({
          QualificationId: response.data.qualificationId,
          QualificationName: response.data.qualificationName,
          IsActive: response.data.isActive,
          CreatedAt: response.data.createdAt,
          CreatedBy: response.data.createdBy,
          LastUpdatedBy: user.userId,
        });
      })
      .catch(error => {
        console.log('Qualification Get By Id :', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
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

  const renderQualificationCard = ({item}) => {
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
          shadowOffset: {width: 10, height: 10},
          shadowOpacity: 10,
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
          {item.qualificationName}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{marginRight: 10}}
            onPress={() => handleEditQualification(item.qualificationId)}>
            <Icon
              name="pencil"
              size={20}
              color={'#5a67f2'}
              style={{marginLeft: 8, textAlignVertical: 'center'}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              DeleteQualificationIdConfirm(item.qualificationId);
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
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{flexGrow: 1}}>
      <View style={{flex: 1, padding: 20}}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
          onPress={handleAddQualification}>
          <Text
            style={{
              color: Colors.background,
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Add Qualification
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
                      DeleteQualificationIdConfirmYes();
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
                      DeleteQualificationIdConfirmNo();
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
                placeholder="Qualification Name"
                value={qualification.QualificationName}
                onChangeText={text =>
                  setQualification({...qualification, QualificationName: text})
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
                onPress={handleSaveQualification}>
                <Text
                  style={{
                    color: Colors.background,
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {qualification.QualificationId !== 0 ? 'Save' : 'Add'}
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
          data={qualificationList}
          renderItem={renderQualificationCard}
          keyExtractor={item => item.qualificationId.toString()}
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
//   qualificationList: {
//     flexGrow: 1,
//   },
//   qualificationCard: {
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
//   qualificationName: {
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

export default QualificationScreen;

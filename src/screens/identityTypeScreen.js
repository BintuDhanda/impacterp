import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Alert, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '../../App';
import { useContext } from 'react';
import { Get as httpGet, Post as httpPost } from '../constants/httpService';

const IdentityTypeScreen = () => {
  const { user, setUser } = useContext(UserContext);
  const [identityType, setIdentityType] = useState({ "IdentityTypeId": 0, "Name": "", "IsActive": true, "CreatedAt": null, "CreatedBy": user.userId, "LastUpdatedBy": null, });
  const [identityTypeList, setIdentityTypeList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [identityTypeDeleteId, setIdentityTypeDeleteId] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    GetIdentityTypeList();
  }, []);
  const GetIdentityTypeList = () => {
    httpGet("IdentityType/get")
      .then((result) => {
        console.log(result.data)
        setIdentityTypeList(result.data)
      })
      .catch((err) => {
        console.log('Get IdentityType error :', err);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      })
  }
  const handleAddIdentityType = () => {
    setIdentityType({
      IdentityTypeId: 0,
      Name: "",
      IsActive: true,
      CreatedAt: null,
      CreatedBy: user.userId,
      LastUpdatedBy: null,
    });
    setModalVisible(true);
  };

  const handleSaveIdentityType = () => {
    try {
      if (identityType.IdentityTypeId !== 0) {
        httpPost("IdentityType/put", identityType)
          .then((response) => {
            if (response.status === 200) {
              GetIdentityTypeList();
              Alert.alert('Sucees', 'Update IdentityType Successfully')
              setIdentityType({
                "IdentityTypeId": 0,
                "Name": "",
                "IsActive": true,
                "CreatedAt": null,
                "CreatedBy": user.userId,
                "LastUpdatedBy": null,
              })
            }
          })
          .catch((err) => {
            console.log("IdentityType update error : ", err);
            Toast.show({
              type: 'error',
              text1: `${err}`,
              position: 'bottom',
              visibilityTime: 2000,
              autoHide: true,
            });
          });
      }
      else {
        httpPost("IdentityType/post", identityType)
          .then((response) => {
            if (response.status === 200) {
              GetIdentityTypeList();
              Alert.alert('Success', 'Add IdentityType Successfully')
              setIdentityType({
                "IdentityTypeId": 0,
                "Name": "",
                "IsActive": true,
                "CreatedAt": null,
                "CreatedBy": user.userId,
                "LastUpdatedBy": null,
              })
            }
          })
          .catch((err) => {
            console.log('IdentityType Add error :', err);
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
    }
    catch (error) {
      console.log('Error saving IdentityType:', error);
      Toast.show({
        type: 'error',
        text1: `${error}`,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  }

  const DeleteIdentityTypeIdConfirm = (identityTypeid) => {
    setIdentityTypeDeleteId(identityTypeid);
  }

  const DeleteIdentityTypeIdConfirmYes = () => {
    httpGet(`IdentityType/delete?Id=${identityTypeDeleteId}`)
      .then((result) => {
        console.log(result);
        GetIdentityTypeList();
        setIdentityTypeDeleteId(0);
        setShowDelete(false);
      })
      .catch((error) => {
        console.error('Delete Identity Type error', error);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      })
  }

  const DeleteIdentityTypeIdConfirmNo = () => {
    setIdentityTypeDeleteId(0);
    setShowDelete(false);
  }

  const handleEditIdentityType = (identityTypeId) => {
    httpGet(`IdentityType/getById?Id=${identityTypeId}`)
      .then((response) => {
        setIdentityType({
          IdentityTypeId: response.data.identityTypeId,
          Name: response.data.name,
          IsActive: response.data.isActive,
          CreatedAt: response.data.createdAt,
          CreatedBy: response.data.createdBy,
          LastUpdatedBy: user.userId,
        })
      })
      .catch((error) => {
        console.log('IdentityType Get By Id :', error);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      })
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  }

  const renderIdentityTypeCard = ({ item }) => {
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.background,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 10, height: 2 },
        shadowOpacity: 4,
        shadowRadius: 10,
        elevation: 10,
        borderColor: Colors.primary,
        borderWidth: 1.5,
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold',
        }}>{item.name}</Text>
        <View style={{ flexDirection: 'row', }}>
          <TouchableOpacity style={{ marginRight: 10, }} onPress={() => handleEditIdentityType(item.identityTypeId)} >
            <Icon name="pencil" size={20} color={'#5a67f2'} style={{ marginLeft: 8, textAlignVertical: 'center' }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { DeleteIdentityTypeIdConfirm(item.identityTypeId); setShowDelete(true); }}>
            <Icon name="trash" size={20} color={'#f25252'} style={{ marginRight: 8, textAlignVertical: 'center' }} />
          </TouchableOpacity>
        </View>
      </View >
    );
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, padding: 20, }}>
        <TouchableOpacity style={{
          backgroundColor: Colors.primary,
          borderRadius: 5,
          paddingVertical: 10,
          paddingHorizontal: 20,
          marginBottom: 20,
        }} onPress={handleAddIdentityType}>
          <Text style={{
            color: Colors.background,
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>Add Identity Type</Text>
        </TouchableOpacity>

        {showDelete && (
          <Modal transparent visible={showDelete}>
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <View style={{
                backgroundColor: Colors.background,
                borderRadius: 10,
                padding: 28,
                shadowColor: Colors.shadow,
                width: '80%',
              }}>
                <Text style={{ fontSize: 18, marginBottom: 5, alignSelf: 'center', fontWeight: 'bold' }}>Are You Sure You Want To Delete</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                  <TouchableOpacity style={{
                    backgroundColor: Colors.primary,
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginTop: 10,
                    marginRight: 3,
                  }} onPress={() => {
                    DeleteIdentityTypeIdConfirmYes();
                  }}>
                    <Text style={{ fontSize: 16, color: Colors.background }}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{
                    backgroundColor: '#f25252',
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginTop: 10,
                  }} onPress={() => {
                    DeleteIdentityTypeIdConfirmNo();
                  }}>
                    <Text style={{ fontSize: 16, color: Colors.background }}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
            <View style={{
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
                placeholder="Identity Type Name"
                value={identityType.Name}
                onChangeText={(text) => setIdentityType({ ...identityType, Name: text })}
              />

              <TouchableOpacity style={{
                backgroundColor: Colors.primary,
                borderRadius: 5,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginBottom: 10,
              }} onPress={handleSaveIdentityType}>
                <Text style={{
                  color: Colors.background,
                  fontSize: 16,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>{identityType.IdentityTypeId !== 0 ? 'Save' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#f25252',
                borderRadius: 5,
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}
              onPress={handleClose}
            >
              <Text style={{
                color: Colors.background,
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <FlatList
          data={identityTypeList}
          renderItem={renderIdentityTypeCard}
          keyExtractor={(item) => item.identityTypeId.toString()}
          contentContainerStyle={{ flexGrow: 1, }}
        />
        <Toast ref={(ref) => Toast.setRef(ref)} />
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
//   identityTypeList: {
//     flexGrow: 1,
//   },
//   identityTypeCard: {
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
//   identityTypeName: {
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

export default IdentityTypeScreen;
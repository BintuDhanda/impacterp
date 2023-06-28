import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Alert, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import { Get as httpGet, Post as httpPost, Put as httpPut, Delete as httpDelete } from '../constants/httpService';

const FeeTypeScreen = () => {
  const [feeType, setFeeType] = useState({ "Id": 0, "FeeTypeName": "", "IsActive": true });
  const [feeTypeList, setFeeTypeList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    GetFeeTypeList();
  }, []);
  const GetFeeTypeList = () => {
    httpGet("FeeType/get")
      .then((result) => {
        console.log(result.data)
        setFeeTypeList(result.data)
      })
      .catch(err => console.log('Get FeeType error :', err))
  }
  const handleAddFeeType = () => {
    setFeeType({
      Id: 0,
      FeeTypeName: "",
      IsActive: true,
    });
    setModalVisible(true);
  };

  const handleSaveFeeType = () => {
    try {
      if (feeType.Id !== 0) {
        httpPut("FeeType/put", feeType)
          .then((response) => {
            if (response.status === 200) {
              GetFeeTypeList();
              Alert.alert('Sucees', 'Update FeeType Successfully')
              setFeeType({
                "Id": 0,
                "FeeTypeName": "",
                "IsActive": true
              })
            }
          })
          .catch(err => console.log("FeeType update error : ", err));
      }
      else {
        httpPost("FeeType/post", feeType)
          .then((response) => {
            if (response.status === 200) {
              GetFeeTypeList();
              Alert.alert('Success', 'Add FeeType Successfully')
              setFeeType({
                "Id": 0,
                "FeeTypeName": "",
                "IsActive": true
              })
            }
          })
          .catch(err => console.log('FeeType Add error :', err));
      }
      setModalVisible(false);
    }
    catch (error) {
      console.log('Error saving FeeType:', error);
    }
  }

  const handleDeleteFeeType = (feeTypeId) => {
    httpDelete(`FeeType/delete?Id=${feeTypeId}`)
      .then((result) => {
        console.log(result);
        GetFeeTypeList();
      })
      .catch(err => console.error("Delete Error", err));
  };

  const handleEditFeeType = (feeTypeId) => {
    httpGet(`FeeType/getById?Id=${feeTypeId}`)
      .then((response) => {
        setFeeType({
          Id: response.data.id,
          FeeTypeName: response.data.feeTypeName,
          IsActive: response.data.isActive
        })
      })
      .catch(error => console.log('FeeType Get By Id :', error))
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  }

  const renderFeeTypeCard = ({ item }) => {
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
        borderWidth: 0.5,
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold',
        }}>{item.feeTypeName}</Text>
        <View style={{ flexDirection: 'row', }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#5a67f2',
              borderRadius: 5,
              paddingVertical: 8,
              paddingHorizontal: 12,
              marginRight: 10,
            }} onPress={() => handleEditFeeType(item.id)} >
            <Text style={{
              color: Colors.background,
              fontSize: 14,
              fontWeight: 'bold',
            }}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#f25252',
              borderRadius: 5,
              paddingVertical: 8,
              paddingHorizontal: 12,
            }}
            onPress={() => handleDeleteFeeType(item.id)}
          >
            <Text style={{
              color: Colors.background,
              fontSize: 14,
              fontWeight: 'bold',
            }}>Delete</Text>
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
        }} onPress={handleAddFeeType}>
          <Text style={{
            color: Colors.background,
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>Add Fee Type</Text>
        </TouchableOpacity>

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
                placeholder="Fee Type Name"
                value={feeType.FeeTypeName}
                onChangeText={(text) => setFeeType({ ...feeType, FeeTypeName: text })}
              />

              <TouchableOpacity style={{
                backgroundColor: Colors.primary,
                borderRadius: 5,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginBottom: 10,
              }} onPress={handleSaveFeeType}>
                <Text style={{
                  color: Colors.background,
                  fontSize: 16,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>{feeType.Id !== 0 ? 'Save' : 'Add'}</Text>
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
          data={feeTypeList}
          renderItem={renderFeeTypeCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ flexGrow: 1, }}
        />
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
//   feeTypeList: {
//     flexGrow: 1,
//   },
//   feeTypeCard: {
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
//   feeTypeName: {
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

export default FeeTypeScreen;
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Alert, ScrollView } from 'react-native';
import Colors from '../constants/Colors';

const AddressTypeScreen = () => {
  const [addressType, setAddressType] = useState({ "Id": 0, "AddressTypeName": "", "IsActive": true });
  const [addressTypeList, setAddressTypeList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    GetAddressTypeList();
  }, []);
  const GetAddressTypeList = () => {
    axios.get("http://192.168.1.7:5291/api/AddressType/get", {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((result) => {
        console.log(result.data)
        setAddressTypeList(result.data)
      })
      .catch(err => console.log('Get AddressType error :', err))
  }
  const handleAddAddressType = () => {
    setAddressType({
      Id: 0,
      AddressTypeName: "",
      IsActive: true,
    });
    setModalVisible(true);
  };

  const handleSaveAddressType = () => {
    try {
      if (addressType.Id !== 0) {
        axios.put(`http://192.168.1.7:5291/api/AddressType/put`, JSON.stringify(addressType), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            if (response.status === 200) {
              GetAddressTypeList();
              Alert.alert('Sucees', 'Update AddressType Successfully')
              setAddressType({
                "Id": 0,
                "AddressTypeName": "",
                "IsActive": true
              })
            }
          })
          .catch(err => console.log("AddressType update error : ", err));
      }
      else {
        axios.post(`http://192.168.1.7:5291/api/AddressType/post`, JSON.stringify(addressType), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            if (response.status === 200) {
              GetAddressTypeList();
              Alert.alert('Success', 'Add AddressType Successfully')
              setAddressType({
                "Id": 0,
                "AddressTypeName": "",
                "IsActive": true
              })
            }
          })
          .catch(err => console.log('AddressType Add error :', err));
      }
      setModalVisible(false);
    }
    catch (error) {
      console.log('Error saving AddressType:', error);
    }
  }

  const handleDeleteAddressType = (addressTypeId) => {
    axios.delete(`http://192.168.1.7:5291/api/AddressType/delete?Id=${addressTypeId}`)
      .then((result) => {
        console.log(result);
        GetAddressTypeList();
      })
      .catch(err => console.error("Delete Error", err));
  };

  const handleEditAddressType = (addressTypeId) => {
    axios.get(`http://192.168.1.7:5291/api/AddressType/getById?Id=${addressTypeId}`)
      .then((response) => {
        setAddressType({
          Id: response.data.id,
          AddressTypeName: response.data.addressTypeName,
          IsActive: response.data.isActive
        })
      })
      .catch(error => console.log('AddressType Get By Id :', error))
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  }

  const renderAddressTypeCard = ({ item }) => {
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
        }}>{item.addressTypeName}</Text>
        <View style={{ flexDirection: 'row', }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#5a67f2',
              borderRadius: 5,
              paddingVertical: 8,
              paddingHorizontal: 12,
              marginRight: 10,
            }} onPress={() => handleEditAddressType(item.id)} >
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
            onPress={() => handleDeleteAddressType(item.id)}
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
        }} onPress={handleAddAddressType}>
          <Text style={{
            color: Colors.background,
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>Add Address Type</Text>
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
                placeholder="Address Type Name"
                value={addressType.AddressTypeName}
                onChangeText={(text) => setAddressType({ ...addressType, AddressTypeName: text })}
              />

              <TouchableOpacity style={{
                backgroundColor: Colors.primary,
                borderRadius: 5,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginBottom: 10,
              }} onPress={handleSaveAddressType}>
                <Text style={{
                  color: Colors.background,
                  fontSize: 16,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>{addressType.Id !== 0 ? 'Save' : 'Add'}</Text>
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
          data={addressTypeList}
          renderItem={renderAddressTypeCard}
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
//   addressTypeList: {
//     flexGrow: 1,
//   },
//   addressTypeCard: {
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
//   addressTypeName: {
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

export default AddressTypeScreen;
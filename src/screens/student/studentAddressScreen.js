import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Colors from '../../constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Get as httpGet } from '../../constants/httpService';

const AddressScreen = ({ route, navigation }) => {
  const { studentId } = route.params;
  const [addressList, setAddressList] = useState([]);
  const [studentAddressDeleteId, setStudentAddressDeleteId] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      GetStudentAddressByStudentId();
    }, [])
  )

  const GetStudentAddressByStudentId = () => {
    httpGet(`StudentAddress/getStudentAddressbyStudentId?Id=${studentId}`)
      .then((response) => {
        console.log(response.data);
        setAddressList(response.data);
      })
      .catch((error) => {
        console.error(error, "Get Student Address By Student Id Error");
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  }

  const DeleteStudentAddressIdConfirm = (studentAddressid) => {
    setStudentAddressDeleteId(studentAddressid);
  }

  const DeleteStudentAddressIdConfirmYes = () => {
    httpGet(`StudentAddress/delete?Id=${studentAddressDeleteId}`)
      .then((result) => {
        console.log(result);
        GetStudentAddressByStudentId();
        setStudentAddressDeleteId(0);
        setShowDelete(false);
      })
      .catch((error) => {
        console.error('Delete Student Address error', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      })
  }

  const DeleteStudentAddressIdConfirmNo = () => {
    setStudentAddressDeleteId(0);
    setShowDelete(false);
  }

  const handleAddAddressNavigate = () => {
    navigation.navigate('StudentAddressFormScreen', { studentId: studentId })
  }

  const handleEditAddressNavigate = (addressId) => {
    navigation.navigate('StudentAddressFormScreen', { studentId: studentId, addressId: addressId })
  }

  const renderTokenCard = ({ item }) => (
    <View style={{
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
      borderWidth: 1.5,
      borderColor: Colors.primary,
    }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 16 }}>Address Type : </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.addressType}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 16 }}>Address : </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.address}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 16 }}>Country : </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.country}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 16 }}>State : </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.state}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 16 }}>City : </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.city}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 16 }}>Pincode : </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.pincode}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <TouchableOpacity style={{ marginRight: 10, }} onPress={() => handleEditAddressNavigate(item.studentAddressId)}>
          <Icon name="pencil" size={20} color={'#5a67f2'} style={{ marginLeft: 8, textAlignVertical: 'center' }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { DeleteStudentAddressIdConfirm(item.studentAddressId); setShowDelete(true); }}>
          <Icon name="trash" size={20} color={'#f25252'} style={{ marginRight: 8, textAlignVertical: 'center' }} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{
        padding: 16,
        justifyContent: 'center'
      }}>
        <TouchableOpacity style={{
          backgroundColor: Colors.primary,
          borderRadius: 5,
          paddingVertical: 10,
          paddingHorizontal: 20,
          marginBottom: 20,
        }} onPress={handleAddAddressNavigate}>
          <Text style={{
            color: Colors.background,
            fontSize: 14,
            fontWeight: 'bold',
            textAlign: 'center'
          }}>Add Address</Text>
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
                    DeleteStudentAddressIdConfirmYes();
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
                    DeleteStudentAddressIdConfirmNo();
                  }}>
                    <Text style={{ fontSize: 16, color: Colors.background }}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        <FlatList
          data={addressList}
          keyExtractor={(item) => item.studentAddressId.toString()}
          renderItem={renderTokenCard}
        />
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </View>
    </ScrollView>
  );
};

export default AddressScreen;

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
//   addressCard: {
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
//   addressName: {
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
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Alert, ScrollView } from 'react-native';
import Colors from '../constants/Colors';

const UserScreen = ({navigation}) => {
  const [user, setUser] = useState({ "Id": 0, "UserMobile": "", "UserPassword": "", "IsActive": true });
  const [userList, setUserList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    GetUserList();
  }, []);

  const handleNavigate = (userId) => {
    navigation.navigate('StudentFormScreen', {userId : userId})
  }

  const GetUserList = () => {
    axios.get("http://192.168.1.7:5291/api/User/get", {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((result) => {
        console.log(result.data)
        setUserList(result.data)
      })
      .catch(err => console.error('Get User error :', err))
  }
  const handleAddUser = () => {
    setUser({
      Id: 0,
      UserMobile: "",
      UserPassword: "",
      IsActive: true,
    });
    setModalVisible(true);
  };

  const handleSaveUser = () => {
    try {
      if (user.Id !== 0) {
        axios.put(`http://192.168.1.7:5291/api/User/put`, JSON.stringify(user), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            if (response.status === 200) {
              GetUserList();
              Alert.alert('Sucees', 'Update User Successfully')
              setUser({
                "Id": 0,
                "UserMobile": "",
                "UserPassword": "",
                "IsActive": true
              })
            }
          })
          .catch(err => console.error("User update error : ", err));
      }
      else {
        axios.post(`http://192.168.1.7:5291/api/User/post`, JSON.stringify(user), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            if (response.status === 200) {
              GetUserList();
              Alert.alert('Success', 'Add User Successfully')
              setUser({
                "Id": 0,
                "UserMobile": "",
                "UserPassword": "",
                "IsActive": true
              })
            }
          })
          .catch(err => console.error('User Add error :', err));
      }
      setModalVisible(false);
    }
    catch (error) {
      console.error('Error saving User:', error);
    }
  }

  const handleDeleteUser = (userId) => {
    axios.delete(`http://192.168.1.7:5291/api/User/delete?Id=${userId}`)
      .then((result) => {
        console.log(result);
        GetUserList();
      })
      .catch(err => console.error("Delete Error", err));
  };

  const handleEditUser = (userId) => {
    axios.get(`http://192.168.1.7:5291/api/User/getById?Id=${userId}`)
      .then((response) => {
        setUser({
          Id: response.data.id,
          UserMobile: response.data.userMobile,
          UserPassword: response.data.userPassword,
          IsActive: response.data.isActive
        })
      })
      .catch(error => console.error('User Get By Id :', error))
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  }

  const renderUserCard = ({ item }) => {
    return (
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
        borderWidth: 0.5,
        borderColor: Colors.primary,
      }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 16 }}>User Password : </Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlignVertical: 'center' }}> ######## </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 16 }}>User Mobile : </Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.userMobile}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#5a67f2',
              borderRadius: 5,
              paddingVertical: 8,
              paddingHorizontal: 12,
              marginRight: 10,
            }} onPress={() => handleEditUser(item.id)} >
            <Text style={{
              color: Colors.background,
              fontSize: 14,
              fontWeight: 'bold',
            }}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#ffff80',
              borderRadius: 5,
              paddingVertical: 8,
              paddingHorizontal: 12,
              marginRight: 10,
            }} onPress={() => handleNavigate(item.id)} >
            <Text style={{
              color: Colors.primary,
              fontSize: 14,
              fontWeight: 'bold',
            }}>Manage</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#f25252',
              borderRadius: 5,
              paddingVertical: 8,
              paddingHorizontal: 12,
            }}
            onPress={() => handleDeleteUser(item.id)}
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
        }} onPress={handleAddUser}>
          <Text style={{
            color: Colors.background,
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>Add User</Text>
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
            }}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: Colors.primary,
                  borderRadius: 8,
                  marginBottom: 20,
                  padding: 8,
                }}
                placeholder="User Mobile"
                value={user.UserMobile}
                keyboardType='numeric'
                maxLength={10}
                onChangeText={(text) => setUser({ ...user, UserMobile: text })}
              />
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: Colors.primary,
                  borderRadius: 8,
                  marginBottom: 20,
                  padding: 8,
                }}
                placeholder="User Password"
                value={user.UserPassword}
                onChangeText={(text) => setUser({ ...user, UserPassword: text })}
              />
              <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity style={{
                  backgroundColor: Colors.primary,
                  borderRadius: 5,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                }} onPress={handleSaveUser}>
                  <Text style={{
                    color: Colors.background,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>{user.Id !== 0 ? 'Save' : 'Add'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#f25252',
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginLeft: 10,
                  }}
                  onPress={handleClose}
                >
                  <Text style={{
                    color: Colors.background,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <FlatList
          data={userList}
          renderItem={renderUserCard}
          keyExtractor={(item) => item.id.toString()}
        // contentContainerStyle={{ flexGrow: 1, }}
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
//   userList: {
//     flexGrow: 1,
//   },
//   userCard: {
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
//   userName: {
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

export default UserScreen;
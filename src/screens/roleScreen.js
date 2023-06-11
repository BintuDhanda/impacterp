import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Alert, ScrollView } from 'react-native';
import Colors from '../constants/Colors';

const RoleScreen = () => {
  const [role, setRole] = useState({ "Id": 0, "RoleName": "", "IsActive": true });
  const [roleList, setRoleList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    GetRoleList();
  }, []);
  const GetRoleList = () => {
    axios.get("http://192.168.1.7:5291/api/Role/get", {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((result) => {
        console.log(result.data)
        setRoleList(result.data)
      })
      .catch(err => console.log('Get Role error :', err))
  }
  const handleAddRole = () => {
    setRole({
      Id: 0,
      RoleName: "",
      IsActive: true,
    });
    setModalVisible(true);
  };

  const handleSaveRole = () => {
    try {
      if (role.Id !== 0) {
        axios.put(`http://192.168.1.7:5291/api/Role/put`, JSON.stringify(role), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            if (response.status === 200) {
              GetRoleList();
              Alert.alert('Sucees', 'Update Role Successfully')
              setRole({
                "Id": 0,
                "RoleName": "",
                "IsActive": true
              })
            }
          })
          .catch(err => console.log("Role update error : ", err));
      }
      else {
        axios.post(`http://192.168.1.7:5291/api/Role/post`, JSON.stringify(role), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            if (response.status === 200) {
              GetRoleList();
              Alert.alert('Success', 'Add Role Successfully')
              setRole({
                "Id": 0,
                "RoleName": "",
                "IsActive": true
              })
            }
          })
          .catch(err => console.log('Role Add error :', err));
      }
      setModalVisible(false);
    }
    catch (error) {
      console.log('Error saving Role:', error);
    }
  }

  const handleDeleteRole = (roleId) => {
    axios.delete(`http://192.168.1.7:5291/api/Role/delete?Id=${roleId}`)
      .then((result) => {
        console.log(result);
        GetRoleList();
      })
      .catch(err => console.error("Delete Error", err));
  };

  const handleEditRole = (roleId) => {
    axios.get(`http://192.168.1.7:5291/api/Role/getById?Id=${roleId}`)
      .then((response) => {
        setRole({
          Id: response.data.id,
          RoleName: response.data.roleName,
          IsActive: response.data.isActive
        })
      })
      .catch(error => console.log('Role Get By Id :', error))
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  }

  const renderRoleCard = ({ item }) => {
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
        shadowOpacity: 10,
        shadowRadius: 10,
        elevation: 10,
        borderWidth: 0.8,
        borderColor: Colors.primary
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold',
        }}>{item.roleName}</Text>
        <View style={{ flexDirection: 'row', }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#5a67f2',
              borderRadius: 5,
              paddingVertical: 8,
              paddingHorizontal: 12,
              marginRight: 10,
            }} onPress={() => handleEditRole(item.id)} >
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
            onPress={() => handleDeleteRole(item.id)}
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
        }} onPress={handleAddRole}>
          <Text style={{
            color: Colors.background,
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>Add Role</Text>
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
                placeholder="Role Name"
                value={role.RoleName}
                onChangeText={(text) => setRole({ ...role, RoleName: text })}
              />

              <TouchableOpacity style={{
                backgroundColor: Colors.primary,
                borderRadius: 5,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginBottom: 10,
              }} onPress={handleSaveRole}>
                <Text style={{
                  color: Colors.background,
                  fontSize: 16,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>{role.Id !== 0 ? 'Save' : 'Add'}</Text>
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
                color: '#ffffff',
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <FlatList
          data={roleList}
          renderItem={renderRoleCard}
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
//   roleList: {
//     flexGrow: 1,
//   },
//   roleCard: {
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
//   roleName: {
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

export default RoleScreen;
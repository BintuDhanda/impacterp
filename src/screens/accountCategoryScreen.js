import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Alert, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '../../App';
import { useContext } from 'react';
import { Get as httpGet, Put as httpPut, Post as httpPost, Delete as httpDelete } from '../constants/httpService';

const AccountCategoryScreen = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const [accountCategory, setAccountCategory] = useState({ "AccountCategoryId": 0, "AccCategoryName": "", "IsActive": true, "CreatedAt": null, "CreatedBy": user.userId, "LastUpdatedBy": null, });
  const [accountCategoryList, setAccountCategoryList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    GetAccountCategoryList();
  }, []);
  const GetAccountCategoryList = () => {
    httpGet("AccountCategory/get")
      .then((result) => {
        console.log(result.data)
        setAccountCategoryList(result.data)
      })
      .catch(err => console.log('Get AccountCategory error :', err))
  }
  const handleAddAccountCategory = () => {
    setAccountCategory({
      AccountCategoryId: 0,
      AccCategoryName: "",
      IsActive: true,
      CreatedAt: null,
      CreatedBy: user.userId,
      LastUpdatedBy: null,
    });
    setModalVisible(true);
  };

  const handleSaveAccountCategory = () => {
    try {
      if (accountCategory.AccountCategoryId !== 0) {
        httpPut("AccountCategory/put", accountCategory)
          .then((response) => {
            if (response.status === 200) {
              GetAccountCategoryList();
              Alert.alert('Sucees', 'Update Account Category Successfully')
              setAccountCategory({
                "AccountCategoryId": 0,
                "AccCategoryName": "",
                "IsActive": true,
                "CreatedAt": null,
                "CreatedBy": user.userId,
                "LastUpdatedBy": null,
              })
            }
          })
          .catch(err => console.log("Account Category update error : ", err));
      }
      else {
        httpPost("AccountCategory/post", accountCategory)
          .then((response) => {
            if (response.status === 200) {
              GetAccountCategoryList();
              Alert.alert('Success', 'Add Account Category Successfully')
              setAccountCategory({
                "AccountCategoryId": 0,
                "AccCategoryName": "",
                "IsActive": true,
                "CreatedAt": null,
                "CreatedBy": user.userId,
                "LastUpdatedBy": null,
              })
            }
          })
          .catch(err => console.log('Account Category Add error :', err));
      }
      setModalVisible(false);
    }
    catch (error) {
      console.log('Error saving AccountCategory:', error);
    }
  }

  const handleDeleteAccountCategory = (accountCategoryId) => {
    httpDelete(`AccountCategory/delete?Id=${accountCategoryId}`)
      .then((result) => {
        console.log(result);
        GetAccountCategoryList();
      })
      .catch(err => console.error("Delete Error", err));
  };

  const handleEditAccountCategory = (accountCategoryId) => {
    httpGet(`AccountCategory/getById?Id=${accountCategoryId}`)
      .then((response) => {
        setAccountCategory({
          AccountCategoryId: response.data.accountCategoryId,
          AccCategoryName: response.data.accCategoryName,
          IsActive: response.data.isActive,
          CreatedAt: response.data.createdAt,
          CreatedBy: response.data.createdBy,
          LastUpdatedBy: user.userId,
        })
      })
      .catch(error => console.log('AccountCategory Get By AccountCategoryId :', error))
    setModalVisible(true);
  };

  const handleNavigate = (accountCategoryId, accCategoryName) => {
    navigation.navigate('AccountScreen', { accountCategoryId: accountCategoryId, accCategoryName: accCategoryName })
  }

  const handleClose = () => {
    setModalVisible(false);
  }

  const renderAccountCategoryCard = ({ item }) => {
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
        borderWidth: 1.5,
        borderColor: Colors.primary,
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold',
        }}>{item.accCategoryName}</Text>
        <View style={{ flexDirection: 'row', }}>
          <TouchableOpacity style={{ marginRight: 10, }} onPress={() => handleEditAccountCategory(item.accountCategoryId)} >
            <Icon name="pencil" size={20} color={'#5a67f2'} style={{ marginLeft: 8, textAlignVertical: 'center' }} />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginRight: 10, }} onPress={() => handleNavigate(item.accountCategoryId, item.accCategoryName)} >
            <Icon name="cogs" size={20} color={Colors.primary} style={{ marginRight: 8, textAlignVertical: 'center' }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteAccountCategory(item.accountCategoryId)}>
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
        }} onPress={handleAddAccountCategory}>
          <Text style={{
            color: Colors.background,
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>Add Account Category</Text>
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
                placeholder="Account Category Name"
                value={accountCategory.AccCategoryName}
                onChangeText={(text) => setAccountCategory({ ...accountCategory, AccCategoryName: text })}
              />

              <TouchableOpacity style={{
                backgroundColor: Colors.primary,
                borderRadius: 5,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginBottom: 10,
              }} onPress={handleSaveAccountCategory}>
                <Text style={{
                  color: Colors.background,
                  fontSize: 16,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>{accountCategory.AccountCategoryId !== 0 ? 'Save' : 'Add'}</Text>
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
          data={accountCategoryList}
          renderItem={renderAccountCategoryCard}
          keyExtractor={(item) => item.accountCategoryId.toString()}
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
//   accountCategoryList: {
//     flexGrow: 1,
//   },
//   accountCategoryCard: {
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
//   accountCategoryName: {
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

export default AccountCategoryScreen;
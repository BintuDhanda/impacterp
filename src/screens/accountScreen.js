import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import Colors from '../constants/Colors';

const AccountScreen = () => {
  const [account, setAccount] = useState({ "Id": 0, "AccountName": "", "IsActive": true, "AccCategoryId": "" });
  const [accCategoryData, setAccCategoryData] = useState([]);
  const [accountList, setAccountList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  useEffect(() => {
    GetAccCategoryList();
  }, []);

  const GetAccCategoryList = () => {
    axios.get('http://192.168.1.7:5291/api/AccountCategory/get', {
      headers: {
        'Content-Type': 'application/json', // Example header
        'User-Agent': 'react-native/0.64.2', // Example User-Agent header
      },
    })
      .then((response) => {
        console.log(response.data);
        const AccCategoryArray = response.data.map((accCategory) => ({
          value: accCategory.id,
          label: accCategory.accCategoryName,
        }));
        setAccCategoryData(AccCategoryArray);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const fetchAccountsByAccCategoryId = async (accCategoryId) => {
    try {
      const response = await axios.get(`http://192.168.1.7:5291/api/Account/getAccountByAccountCategoryId?Id=${accCategoryId}`, {
        headers: {
          'Content-Type': 'application/json', // Example header
          'User-Agent': 'react-native/0.64.2', // Example User-Agent header
        },
      });
      setAccountList(response.data);
    } catch (error) {
      console.log('Error fetching Accounts:', error);
    }
  };
  const handleAccCategorySelect = (accCategory) => {
    setValue(accCategory.value);
    fetchAccountsByAccCategoryId(accCategory.value);
  };


  const handleAddAccount = () => {
    setAccount({
      Id: 0,
      AccountName: "",
      IsActive: true,
      AccCategoryId: ""
    });
    setModalVisible(true);
  };

  const handleEditAccount = (id) => {
    axios.get(`http://192.168.1.7:5291/api/Account/getById?Id=${id}`)
      .then((result) => {
        console.log(result);
        setAccount(
          {
            Id: result.data.id,
            AccountName: result.data.accountName,
            AccCategoryId: result.data.accCategoryId,
            IsActive: result.data.isActive
          }
        );
      })
      .catch(err => console.error("Get By Id Error", err));
    setModalVisible(true);
  };

  const handleDeleteAccount = (id) => {
    axios.delete(`http://192.168.1.7:5291/api/Account/delete?Id=${id}`)
      .then((result) => {
        console.log(result);
        fetchAccountsByAccCategoryId(result.data.accCategoryId)
      })
      .catch(err => console.error("Delete Error", err));
  }

  const handleSaveAccount = async () => {
    try {
      if (account.Id !== 0) {
        await axios.put(`http://192.168.1.7:5291/api/Account/put`, JSON.stringify(account), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            if (response.status === 200) {
              fetchAccountsByAccCategoryId(response.data.accCategoryId);
              Alert.alert('Sucess', 'Account Update successfully');
              setAccount({
                "Id": 0,
                "AccountName": "",
                "AccCategoryId": "",
                "IsActive": true
              });
            }
          })
          .catch(err => console.error("Post error in Account", err));
      } else {
        await axios.post('http://192.168.1.7:5291/api/Account/post', JSON.stringify(account), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            if (response.status === 200) {
              fetchAccountsByAccCategoryId(response.data.accCategoryId);
              Alert.alert('Sucess', 'Account is Added Successfully')
              setAccount({
                "Id": 0,
                "AccountName": "",
                "AccCategoryId": "",
                "IsActive": true
              });
            }
          })
      }
      setModalVisible(false);
    } catch (error) {
      console.log('Error saving Account:', error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };


  const renderAccountCard = ({ item }) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: Colors.background,
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      marginTop: 10,
      shadowColor: Colors.shadow,
      shadowOffset: { width: 10, height: 2 },
      shadowOpacity: 4,
      shadowRadius: 10,
      elevation: 10,
      borderWidth: 0.5,
      borderColor: Colors.primary,
    }}>
      <Text style={{
        fontSize: 16,
        fontWeight: 'bold',
      }}>{item.accountName}</Text>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={{
          backgroundColor: '#5a67f2',
          borderRadius: 5,
          paddingVertical: 8,
          paddingHorizontal: 12,
          marginRight: 10,
        }} onPress={() => handleEditAccount(item.id)}>
          <Text style={{
            color: Colors.background,
            fontSize: 14,
            fontWeight: 'bold',
          }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          backgroundColor: '#f25252',
          borderRadius: 5,
          paddingVertical: 8,
          paddingHorizontal: 12,
        }} onPress={() => handleDeleteAccount(item.id)}>
          <Text style={{
            color: Colors.background,
            fontSize: 14,
            fontWeight: 'bold',
          }}>Delete</Text>
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
        <Dropdown
          style={[{
            height: 50,
            borderColor: Colors.primary,
            borderWidth: 0.5,
            borderRadius: 10,
            paddingHorizontal: 8,
          }, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={{ fontSize: 16, }}
          selectedTextStyle={{ fontSize: 16, }}
          inputSearchStyle={{
            height: 40,
            fontSize: 16,
          }}
          iconStyle={{
            width: 20,
            height: 20,
          }}
          data={accCategoryData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select Account Category' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={handleAccCategorySelect}
        />
        <TouchableOpacity style={{
          backgroundColor: Colors.primary,
          borderRadius: 5,
          paddingVertical: 8,
          paddingHorizontal: 12,
          marginTop: 10,
          alignSelf: 'flex-start',
        }} onPress={handleAddAccount}>
          <Text style={{
            color: Colors.background,
            fontSize: 14,
            fontWeight: 'bold',
          }}>Add</Text>
        </TouchableOpacity>
        <FlatList
          data={accountList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAccountCard}
        />

        {modalVisible && (
          <Modal transparent visible={modalVisible}>
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
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
                    borderRadius: 10,
                    padding: 8,
                    marginBottom: 20,
                  }}
                  placeholder="Account Name"
                  value={account.AccountName}
                  onChangeText={(text) => setAccount({ ...account, AccountName: text })}
                />
                <Dropdown
                  style={[{
                    height: 50,
                    borderColor: Colors.primary,
                    borderWidth: 1,
                    borderRadius: 10,
                    paddingHorizontal: 8,
                  }, isFocus && { borderColor: 'blue' }]}
                  placeholderStyle={{ fontSize: 16, }}
                  selectedTextStyle={{ fontSize: 16, }}
                  inputSearchStyle={{
                    height: 40,
                    fontSize: 16,
                  }}
                  iconStyle={{
                    width: 20,
                    height: 20,
                  }}
                  data={accCategoryData}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? 'Select item' : '...'}
                  searchPlaceholder="Search..."
                  value={account.AccCategoryId}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(value) => setAccount({ ...account, AccCategoryId: value.value })}
                />
                <View style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>
                  <TouchableOpacity style={{
                    backgroundColor: Colors.primary,
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                  }} onPress={handleSaveAccount}>
                    <Text style={{
                      color: Colors.background,
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}>{account.Id === 0 ? 'Add' : 'Save'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{
                    backgroundColor: '#f25252',
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginLeft: 10
                  }} onPress={handleCloseModal}>
                    <Text style={{
                      color: Colors.background,
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </ScrollView>
  );
};

export default AccountScreen;

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
//   accountCard: {
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
//   accountName: {
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
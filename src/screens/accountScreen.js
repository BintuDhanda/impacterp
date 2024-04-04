import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
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
import ShowError from '../constants/ShowError';

const AccountScreen = ({route, navigation}) => {
  const {user, setUser} = useContext(UserContext);
  const {accountCategoryId, accCategoryName} = route.params;
  const [account, setAccount] = useState({
    AccountId: 0,
    AccountName: '',
    IsActive: true,
    AccCategoryId: accountCategoryId,
    CreatedAt: null,
    CreatedBy: user.userId,
    LastUpdatedBy: null,
  });
  const [accountList, setAccountList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [accountDeleteId, setAccountDeleteId] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    fetchAccountsByAccCategoryId();
  }, []);

  const fetchAccountsByAccCategoryId = async () => {
    try {
      const response = await httpGet(
        `Account/getAccountByAccountCategoryId?Id=${accountCategoryId}`,
      );
      setAccountList(response.data);
    } catch (error) {
      console.log('Error fetching Accounts:', error);
      Toast.show({
        type: 'error',
        text1: `${error}`,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const handleAddAccount = () => {
    setAccount({
      AccountId: 0,
      AccountName: '',
      IsActive: true,
      AccCategoryId: accountCategoryId,
      CreatedAt: null,
      CreatedBy: user.userId,
      LastUpdatedBy: null,
    });
    setModalVisible(true);
  };

  const handleEditAccount = id => {
    httpGet(`Account/getById?Id=${id}`)
      .then(result => {
        console.log(result);
        setAccount({
          AccountId: result.data.accountId,
          AccountName: result.data.accountName,
          AccCategoryId: result.data.accCategoryId,
          IsActive: result.data.isActive,
          CreatedAt: result.data.createdAt,
          CreatedBy: result.data.createdBy,
          LastUpdatedBy: user.userId,
        });
      })
      .catch(err => {
        console.error('Get By Id Error', err);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
    setModalVisible(true);
  };

  const DeleteAccountIdConfirm = accountid => {
    setAccountDeleteId(accountid);
  };

  const DeleteAccountIdConfirmYes = () => {
    httpGet(`Account/delete?Id=${accountDeleteId}`)
      .then(result => {
        console.log(result);
        fetchAccountsByAccCategoryId();
        setAccountDeleteId(0);
        setShowDelete(false);
      })
      .catch(error => {
        console.error('Delete Account error', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const DeleteAccountIdConfirmNo = () => {
    setAccountDeleteId(0);
    setShowDelete(false);
  };

  const handleNavigate = (accountId, accountName) => {
    navigation.navigate('AccountDaybookScreen', {
      accountId: accountId,
      accountName: accountName,
    });
  };

  const handleSaveAccount = async () => {
    if (IsFormValid()) {
      try {
        if (account.AccountId !== 0) {
          await httpPost('Account/put', account)
            .then(response => {
              if (response.status === 200) {
                fetchAccountsByAccCategoryId();
                Alert.alert('Sucess', 'Account Update successfully');
                setAccount({
                  AccountId: 0,
                  AccountName: '',
                  AccCategoryId: accountCategoryId,
                  IsActive: true,
                  CreatedAt: null,
                  CreatedBy: user.userId,
                  LastUpdatedBy: null,
                });
              }
            })
            .catch(err => {
              console.error('Post error in Account', err);
              Toast.show({
                type: 'error',
                text1: `${err}`,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
              });
            });
        } else {
          await httpPost('Account/post', account).then(response => {
            if (response.status === 200) {
              fetchAccountsByAccCategoryId();
              Alert.alert('Sucess', 'Account is Added Successfully');
              setAccount({
                AccountId: 0,
                AccountName: '',
                AccCategoryId: accountCategoryId,
                IsActive: true,
                CreatedAt: null,
                CreatedBy: user.userId,
                LastUpdatedBy: null,
              });
            }
          });
        }
        setModalVisible(false);
      } catch (error) {
        console.log('Error saving Account:', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    }
  };
  const IsFormValid = () => {
    if (account.AccountName.length == 0) {
      ShowError('Enter a Valid Account Name');
      return false;
    }
    if (account.AccCategoryId.length == 0) {
      ShowError('Select Account Category');
      return false;
    }
    if (account.Gender.length == 0) {
      ShowError('Select Gender');
      return false;
    }
    if (account.MotherName.length == 0) {
      ShowError('Enter Valid Mother Name');
      return false;
    }
    if (account.StudentHeight.length == 0) {
      ShowError('Enter a Valid Height');
      return false;
    }

    if (account.StudentWeight.length == 0) {
      ShowError('Enter a Valid Weight');
      return false;
    }

    if (account.BodyRemark.length == 0) {
      ShowError('Enter a Valid Body Remark');
      return false;
    }

    return true;
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const renderAccountCard = ({item}) => (
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
        <Text style={{fontSize: 16}}>Account Name : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.accountName}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity
          style={{marginRight: 10}}
          onPress={() => handleEditAccount(item.accountId)}>
          <Icon
            name="pencil"
            size={20}
            color={'#5a67f2'}
            style={{marginLeft: 8, textAlignVertical: 'center'}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginRight: 10}}
          onPress={() => handleNavigate(item.accountId, item.accountName)}>
          <Icon
            name="cogs"
            size={20}
            color={Colors.primary}
            style={{marginRight: 8, textAlignVertical: 'center'}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            DeleteAccountIdConfirm(item.accountId);
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
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{flexGrow: 1}}>
      <View
        style={{
          padding: 16,
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          Account Category Name : {accCategoryName}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginBottom: 20,
            marginTop: 10,
          }}
          onPress={handleAddAccount}>
          <Text
            style={{
              color: Colors.background,
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Add Account
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
                      DeleteAccountIdConfirmYes();
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
                      DeleteAccountIdConfirmNo();
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
          data={accountList}
          keyExtractor={item => item.accountId.toString()}
          renderItem={renderAccountCard}
        />

        {modalVisible && (
          <Modal transparent visible={modalVisible}>
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
                  onChangeText={text =>
                    setAccount({...account, AccountName: text})
                  }
                />

                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.primary,
                      borderRadius: 5,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                    }}
                    onPress={handleSaveAccount}>
                    <Text
                      style={{
                        color: Colors.background,
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}>
                      {account.AccountId === 0 ? 'Add' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#f25252',
                      borderRadius: 5,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      marginLeft: 10,
                    }}
                    onPress={handleCloseModal}>
                    <Text
                      style={{
                        color: Colors.background,
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
        <Toast ref={ref => Toast.setRef(ref)} />
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

import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Colors from '../constants/Colors';
import {Dropdown} from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import {UserContext} from '../../App';
import {useContext} from 'react';
import {Get as httpGet, Post as httpPost} from '../constants/httpService';
import {camelCaseToWords} from '../helpers';

const UserRoleScreen = ({route}) => {
  const {user, setUser} = useContext(UserContext);
  const {userId, userMobile} = route.params;
  const [userRole, setUserRole] = useState({
    UserRoleId: 0,
    RoleId: '',
    IsActive: true,
    UserId: userId,
    CreatedBy: user.userId,
  });
  const [userRoleList, setUserRoleList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [userRoleDeleteId, setUserRoleDeleteId] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    fetchUserRolesByUserId();
    GetRoleList();
  }, []);

  const fetchUserRolesByUserId = async () => {
    try {
      const response = await httpGet(
        `UserRole/getUserRoleByUserId?UserId=${userId}`,
      );
      setUserRoleList(response.data);
      console.log(userRoleList, 'UserRoleList');
    } catch (error) {
      console.error('Error fetching UserRoles:', error);
      Toast.show({
        type: 'error',
        text1: `${error}`,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const GetRoleList = () => {
    httpGet('Role/roleGet')
      .then(result => {
        console.log(result.data);
        setRoleList(
          result.data?.map(item => {
            return {...item, roleName: camelCaseToWords(item?.roleName)};
          }),
        );
      })
      .catch(err => {
        console.error('Get Role List error :', err);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const handleAddUserRole = () => {
    setModalVisible(true);
  };

  const DeleteUserRoleIdConfirm = userRoleid => {
    setUserRoleDeleteId(userRoleid);
  };

  const DeleteUserRoleIdConfirmYes = () => {
    httpGet(`UserRole/delete?Id=${userRoleDeleteId}`)
      .then(result => {
        console.log(result);
        fetchUserRolesByUserId();
        setUserRoleDeleteId(0);
        setShowDelete(false);
      })
      .catch(error => {
        console.error('Delete User Role error', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const DeleteUserRoleIdConfirmNo = () => {
    setUserRoleDeleteId(0);
    setShowDelete(false);
  };

  const handleSaveUserRole = async () => {
    await httpPost('UserRole/post', userRole)
      .then(response => {
        if (response.status === 200) {
          fetchUserRolesByUserId();
          Alert.alert('Sucess', 'User Role is Added Successfully');
          setUserRole({
            UserRoleId: 0,
            RoleId: '',
            UserId: userId,
            CreatedBy: user.userId,
            IsActive: true,
          });
          setModalVisible(false);
        }
      })
      .catch(err => {
        console.error('Add User Role Error', err);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const renderUserRoleCard = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.background,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        marginTop: 10,
        shadowColor: Colors.shadow,
        shadowOffset: {width: 10, height: 2},
        shadowOpacity: 4,
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
        {camelCaseToWords(item.roleName)}
      </Text>

      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            DeleteUserRoleIdConfirm(item.userRoleId);
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
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={{flex: 1, padding: 20}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          User Mobile : {userMobile}
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
          onPress={handleAddUserRole}>
          <Text
            style={{
              flex: 1,
              color: Colors.background,
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Add User Role
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
                      DeleteUserRoleIdConfirmYes();
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
                      DeleteUserRoleIdConfirmNo();
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
          data={userRoleList}
          keyExtractor={item => item.userRoleId.toString()}
          renderItem={renderUserRoleCard}
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
                <Dropdown
                  style={[
                    {
                      height: 50,
                      borderColor: Colors.primary,
                      borderWidth: 1.5,
                      borderRadius: 10,
                      paddingHorizontal: 8,
                    },
                    isFocus && {borderColor: 'blue'},
                  ]}
                  placeholderStyle={{fontSize: 16}}
                  selectedTextStyle={{fontSize: 16}}
                  inputSearchStyle={{
                    height: 40,
                    fontSize: 16,
                  }}
                  iconStyle={{
                    width: 20,
                    height: 20,
                  }}
                  data={roleList}
                  search
                  maxHeight={300}
                  labelField="roleName"
                  valueField="rolesId"
                  placeholder={!isFocus ? 'Select Role' : '...'}
                  searchPlaceholder="Search..."
                  value={value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={text => {
                    setUserRole({...userRole, RoleId: text.rolesId});
                  }}
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
                    onPress={handleSaveUserRole}>
                    <Text
                      style={{
                        color: Colors.background,
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}>
                      {userRole.UserRoleId === 0 ? 'Add' : 'Save'}
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

export default UserRoleScreen;

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
//   userRoleCard: {
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
//   roleId: {
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

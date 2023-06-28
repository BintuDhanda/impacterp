import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ActivityIndicator, Animated, FlatList, Alert, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Post as httpPost, Get as httpGet, Delete as httpDelete, Put as httpPut } from '../constants/httpService';

const UserScreen = ({ navigation }) => {
  const ToDate = new Date();
  ToDate.setDate(ToDate.getDate() + 1)
  const FromDate = new Date();
  FromDate.setDate(FromDate.getDate() - 7);
  const moveToRight = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [isFocus, setIsFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(FromDate.toISOString().slice(0, 10).toString());
  const [toDate, setToDate] = useState(ToDate.toISOString().slice(0, 10).toString());
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [mobile, setMobile] = useState("");
  const [isEndReached, setIsEndReached] = useState(true);

  const [selectFromDate, setSelectFromDate] = useState(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000));
  const [selectToDate, setSelectToDate] = useState(new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000))
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [showSearch, setShowSearch] = useState(true);

  const [user, setUser] = useState({ "Id": 0, "UserMobile": "", "UserPassword": "", "IsActive": true });
  const [userList, setUserList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  console.log(userList, "UserList")

  const handleFromDateChange = (event, date) => {
    if (date !== undefined) {
      setSelectFromDate(date);
      setFromDate(getFormattedDate(date));
    }
    setShowDatePicker(false);
  };

  const handleOpenFromDatePicker = () => {
    setShowDatePicker(true);
  };
  const handleConfirmFromDatePicker = () => {
    setShowDatePicker(false);
  };

  const handleToDateChange = (event, date) => {
    if (date !== undefined) {
      setSelectToDate(date);
      setToDate(getFormattedDate(date));
    }
    setShowToDatePicker(false);
  };

  const handleOpenToDatePicker = () => {
    setShowToDatePicker(true);
  };

  const handleConfirmToDatePicker = () => {
    setShowToDatePicker(false);
  };

  // Function to handle button press
  const handleSearch = () => {
    setUserList([]);
    setSkip(0);
    GetUserList();
    setShowSearch(false);
    console.log(selectFromDate, selectToDate, skip)
  };

  const handleNavigate = (userId) => {
    navigation.navigate('StudentFormScreen', { userId: userId })
  }
  const handleManageNavigate = (userId, userMobile) => {
    navigation.navigate('UserRoleScreen', { userId: userId, userMobile: userMobile })
  }

  const GetUserList = () => {
    setLoading(true);
    const filter = { "From": fromDate, "To": toDate, "Take": take, "Skip": skip, "Mobile": mobile }
    httpPost("User/get", filter)
      .then((result) => {
        setLoading(false);
        if (result.data.length >= 0) {
          setIsEndReached(false);
          setUserList([...userList, ...result.data])
          setSkip(skip + 10)
        }
        if (result.data.length === 0) {
          setIsEndReached(true);
          Toast.show({
            type: 'info',
            text1: 'No records found',
            position: 'bottom',
            visibilityTime: 2000,
            autoHide: true,
          });
        }
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
        httpPut("User/put", user)
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
        httpPost("User/post", user)
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
    httpDelete(`User/delete?Id=${userId}`)
      .then((result) => {
        console.log(result);
        GetUserList();
      })
      .catch(err => console.error("Delete Error", err));
  };

  const handleEditUser = (userId) => {
    httpGet(`User/getById?Id=${userId}`)
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

  const handleLoadMore = async () => {
    console.log("Execute Handle More function")
    if (!isEndReached) {
      GetUserList();
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  const getFormattedDate = (datestring) => {
    const datetimeString = datestring;
    const date = new Date(datetimeString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
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
        borderWidth: 1,
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
            }} onPress={() => handleManageNavigate(item.id, item.userMobile)} >
            <Text style={{
              color: Colors.primary,
              fontSize: 14,
              fontWeight: 'bold',
            }}>Manage</Text>
          </TouchableOpacity>
          {item.isStudentCreated !== true ? (<TouchableOpacity
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
            }}>Student Create</Text>
          </TouchableOpacity>) : null}
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
        <Animated.View style={{ flex: 1, position: 'absolute', top: 0, padding: 16, right: 0, left: 0, bottom: 0, backgroundColor: Colors.background, transform: [{ scale: scale }, { translateX: moveToRight }] }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{
              fontSize: 20,
              marginBottom: 10,
              fontWeight: 'bold',
              backgroundColor: Colors.accent,
              borderRadius: 5,
              paddingVertical: 8,
              paddingHorizontal: 12,
              flex: 1,
              color: Colors.secondary,
            }}>Total User : {userList.length === 0 ? null : userList[0].totalUser}</Text>
          </View>
          <TouchableOpacity onPress={() => { setShowSearch(true); }}>
            <View style={{ flexDirection: 'row', borderRadius: 10, borderColor: Colors.primary, marginBottom: 10, borderWidth: 1, fontSize: 16, paddingHorizontal: 20 }}>
              <TextInput style={{ flex: 1, fontWeight: 'bold' }} editable={false} placeholder="Search..." />
              <Icon style={{ textAlignVertical: 'center' }} name="search" size={30} />
            </View>
          </TouchableOpacity>
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

          {showSearch && (
            <Modal transparent visible={showSearch}>
              <View style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <View style={{
                  backgroundColor: Colors.background,
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 10,
                  shadowColor: Colors.shadow,
                  width: '80%',
                  borderWidth: 0.5,
                  borderColor: Colors.primary,
                }}>
                  <Text style={{ fontSize: 16, marginBottom: 5 }}>From Date :</Text>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: Colors.primary,
                    borderRadius: 8,
                  }}>
                    <TouchableOpacity onPress={handleOpenFromDatePicker}>
                      <Icon name={'calendar'} size={25} />
                    </TouchableOpacity>
                    <TextInput style={{ marginLeft: 10, fontSize: 16, color: Colors.secondary }}
                      value={getFormattedDate(selectFromDate)}
                      placeholder="Select From date"
                      editable={false}
                    />

                  </View>
                  {showDatePicker && (
                    <DateTimePicker
                      value={selectFromDate}
                      mode="date"
                      display="default"
                      onChange={handleFromDateChange}
                      onConfirm={handleConfirmFromDatePicker}
                      onCancel={handleConfirmFromDatePicker}
                    />
                  )}

                  <Text style={{ fontSize: 16, marginBottom: 5 }}>To Date :</Text>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: Colors.primary,
                    borderRadius: 8,
                  }}>
                    <TouchableOpacity onPress={handleOpenToDatePicker}>
                      <Icon name={'calendar'} size={25} />
                    </TouchableOpacity>
                    <TextInput
                      style={{ marginLeft: 10, fontSize: 16, color: Colors.secondary }}
                      value={getFormattedDate(selectToDate)}
                      placeholder="Select To date"
                      editable={false}
                    />

                  </View>
                  {showToDatePicker && (
                    <DateTimePicker
                      value={selectToDate}
                      mode="date"
                      display="default"
                      onChange={handleToDateChange}
                      onConfirm={handleConfirmToDatePicker}
                      onCancel={handleConfirmToDatePicker}
                    />
                  )}
                  <Text style={{ fontSize: 20, marginBottom: 5 }}>Or</Text>
                  <Text style={{ fontSize: 16, marginBottom: 5 }}>Mobile :</Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.primary,
                      borderRadius: 8,
                      marginBottom: 20,
                      padding: 8,
                    }}
                    placeholder="Enter Mobile"
                    value={mobile}
                    keyboardType='numeric'
                    maxLength={10}
                    onChangeText={(text) => setMobile(text)}
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                    <TouchableOpacity style={{
                      backgroundColor: Colors.primary,
                      borderRadius: 5,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      marginTop: 10,
                      marginRight: 3,
                    }} onPress={() => {
                      handleSearch();
                    }}>
                      <Text style={{ fontSize: 16, color: Colors.background }}>Search</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                      backgroundColor: '#f25252',
                      borderRadius: 5,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      marginTop: 10,
                    }} onPress={() => {
                      setShowSearch(false);
                    }}>
                      <Text style={{ fontSize: 16, color: Colors.background }}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}

          <FlatList
            data={userList}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={renderUserCard}
            ListFooterComponent={renderFooter}
            onEndReached={() => {
              handleLoadMore();
            }}
            onEndReachedThreshold={0.1}
          />

          <Toast ref={(ref) => Toast.setRef(ref)} />

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
        </Animated.View>
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
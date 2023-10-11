import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '../../App';
import { useContext } from 'react';
import { Get as httpGet, Post as httpPost } from '../constants/httpService';
import ShowError from '../constants/ShowError';

const StateScreen = ({ route, navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const { countryId, countryName } = route.params;
  const [state, setState] = useState({ "StateId": 0, "StateName": "", "IsActive": true, "CountryId": countryId, "CreatedAt": null, "CreatedBy": user.userId, "LastUpdatedBy": null, });
  const [stateList, setStateList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [stateDeleteId, setStateDeleteId] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    fetchStatesByCountryId();
  }, []);

  const handleNavigate = (stateId, stateName) => {
    navigation.navigate('CityScreen', { stateId: stateId, stateName: stateName })
  }

  const fetchStatesByCountryId = async () => {
    try {
      const response = await httpGet(`State/getStateByCountryId?Id=${countryId}`)
      setStateList(response.data);
      console.log(stateList, 'stateList')
    } catch (error) {
      console.log('Error fetching states:', error);
      Toast.show({
        type: 'error',
        text1: `${error}`,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const handleAddState = () => {
    setState({
      StateId: 0,
      StateName: "",
      IsActive: true,
      CountryId: countryId,
      CreatedAt: null,
      CreatedBy: user.userId,
      LastUpdatedBy: null,
    });
    setModalVisible(true);
  };

  const handleEditState = (id) => {
    httpGet(`State/getById?Id=${id}`)
      .then((result) => {
        console.log(result);
        setState(
          {
            StateId: result.data.stateId,
            StateName: result.data.stateName,
            CountryId: result.data.countryId,
            IsActive: result.data.isActive,
            CreatedAt: result.data.createdAt,
            CreatedBy: result.data.createdBy,
            LastUpdatedBy: user.userId,
          }
        );
      })
      .catch((err) => {
        console.error("Get By Id Error", err);
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

  const DeleteStateIdConfirm = (stateid) => {
    setStateDeleteId(stateid);
  }

  const DeleteStateIdConfirmYes = () => {
    httpGet(`State/delete?Id=${stateDeleteId}`)
      .then((result) => {
        console.log(result);
        fetchStatesByCountryId();
        setStateDeleteId(0);
        setShowDelete(false);
      })
      .catch((error) => {
        console.error('Delete State error', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      })
  }

  const DeleteStateIdConfirmNo = () => {
    setStateDeleteId(0);
    setShowDelete(false);
  }

  const handleSaveState = async () => {
    if(IsFormValid()){try {
      if (state.StateId !== 0) {
        await httpPost("State/put", state)
          .then((response) => {
            if (response.status === 200) {
              fetchStatesByCountryId();
              Alert.alert('Sucess', 'State Update successfully');
              setState({
                "StateId": 0,
                "StateName": "",
                "CountryId": countryId,
                "IsActive": true,
                "CreatedAt": null,
                "CreatedBy": user.userId,
                "LastUpdatedBy": null,
              });
            }
          })
          .catch((err) => {
            console.error("Post error in state", err);
            Toast.show({
              type: 'error',
              text1: `${err}`,
              position: 'bottom',
              visibilityTime: 2000,
              autoHide: true,
            });
          });
      } else {
        await httpPost("State/post", state)
          .then((response) => {
            if (response.status === 200) {
              fetchStatesByCountryId();
              Alert.alert('Sucess', 'State is Added Successfully')
              setState({
                "StateId": 0,
                "StateName": "",
                "CountryId": countryId,
                "IsActive": true,
                "CreatedAt": null,
                "CreatedBy": user.userId,
                "LastUpdatedBy": null,
              });
            }
          })
      }
      setModalVisible(false);
    } catch (error) {
      console.log('Error saving state:', error);
      Toast.show({
        type: 'error',
        text1: `${error}`,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }}
  };
  const IsFormValid=()=>{
    if(state.StateName.length==0)
    {
       ShowError("Enter a Valid State Name");
       return false;
    }

    return true;
   }
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const renderStateCard = ({ item }) => (
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
      borderColor: Colors.primary
    }}>

      <Text style={{
        fontSize: 16,
        fontWeight: 'bold',
      }}>{item.stateName}</Text>

      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={{ marginRight: 10, }} onPress={() => handleEditState(item.stateId)}>
          <Icon name="pencil" size={20} color={'#5a67f2'} style={{ marginLeft: 8, textAlignVertical: 'center' }} />
        </TouchableOpacity>

        <TouchableOpacity style={{ marginRight: 10, }} onPress={() => handleNavigate(item.stateId, item.stateName)} >
          <Icon name="cogs" size={20} color={Colors.primary} style={{ marginRight: 8, textAlignVertical: 'center' }} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { DeleteStateIdConfirm(item.stateId); setShowDelete(true); }}>
          <Icon name="trash" size={20} color={'#f25252'} style={{ marginRight: 8, textAlignVertical: 'center' }} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, padding: 20, }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Country Name : {countryName}</Text>
        <TouchableOpacity style={{
          backgroundColor: Colors.primary,
          borderRadius: 5,
          paddingVertical: 10,
          paddingHorizontal: 20,
          marginBottom: 20,
          marginTop: 10,
        }} onPress={handleAddState}>
          <Text style={{
            color: Colors.background,
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>Add State</Text>
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
                    DeleteStateIdConfirmYes();
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
                    DeleteStateIdConfirmNo();
                  }}>
                    <Text style={{ fontSize: 16, color: Colors.background }}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        <FlatList
          data={stateList}
          keyExtractor={(item) => item.stateId.toString()}
          renderItem={renderStateCard}
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
                    borderRadius: 8,
                    padding: 8,
                    marginBottom: 20,
                  }}
                  placeholder="State Name"
                  value={state.StateName}
                  onChangeText={(text) => setState({ ...state, StateName: text })}
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
                  }} onPress={handleSaveState}>

                    <Text style={{
                      color: Colors.background,
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}>{state.StateId === 0 ? 'Add' : 'Save'}</Text>

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
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </View>
    </ScrollView>
  );
};

export default StateScreen;

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
//   stateCard: {
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
//   stateName: {
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
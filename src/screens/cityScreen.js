import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import Colors from '../constants/Colors';

const CityScreen = ({ route }) => {
    const { stateId, stateName } = route.params;
    const [city, setCity] = useState({ "Id": 0, "CityName": "", "IsActive": true, "StateId": stateId });
    const [cityList, setCityList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchCityByStateId(stateId);
    }, []);

    const fetchCityByStateId = async () => {
        try {
            const response = await axios.get(`http://192.168.1.7:5291/api/City/getCityByStateId?Id=${stateId}`, {
                headers: {
                    'Content-Type': 'application/json', // Example header
                    'User-Agent': 'react-native/0.64.2', // Example User-Agent header
                },
            });
            setCityList(response.data);
            console.log(cityList, 'cityList')
        } catch (error) {
            console.log('Error fetching citys:', error);
        }
    };

    const handleAddCity = () => {
        setCity({
            Id: 0,
            CityName: "",
            IsActive: true,
            StateId: stateId
        });
        setModalVisible(true);
    };

    const handleEditCity = (id) => {
        axios.get(`http://192.168.1.7:5291/api/City/getById?Id=${id}`)
            .then((result) => {
                console.log(result);
                setCity(
                    {
                        Id: result.data.id,
                        CityName: result.data.cityName,
                        StateId: result.data.stateId,
                        IsActive: result.data.isActive
                    }
                );
            })
            .catch(err => console.error("Get By Id Error", err));
        setModalVisible(true);
    };

    const handleDeleteCity = (id) => {
        axios.delete(`http://192.168.1.7:5291/api/City/delete?Id=${id}`)
            .then((result) => {
                console.log(result);
                fetchCityByStateId(result.data.stateId)
            })
            .catch(err => console.error("Delete Error", err));
    }

    const handleSaveCity = async () => {
        try {
            if (city.Id !== 0) {
                await axios.put(`http://192.168.1.7:5291/api/City/put`, JSON.stringify(city), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {
                        if (response.status === 200) {
                            fetchCityByStateId(response.data.stateId);
                            Alert.alert('Success', 'City Update successfully');
                            setCity({
                                "Id": 0,
                                "CityName": "",
                                "StateId": stateId,
                                "IsActive": true
                            });
                        }
                    })
                    .catch(err => console.error("Update error in City", err));
            } else {
                await axios.post('http://192.168.1.7:5291/api/City/post', JSON.stringify(city), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {
                        if (response.status === 200) {
                            fetchCityByStateId(response.data.stateId);
                            Alert.alert('Success', 'City is Added Successfully')
                            setCity({
                                "Id": 0,
                                "CityName": "",
                                "StateId": stateId,
                                "IsActive": true
                            });
                        }
                    })
            }
            setModalVisible(false);
        } catch (error) {
            console.log('Error saving City:', error);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };


    const renderCityCard = ({ item }) => (
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
            borderColor: Colors.primary
        }}>
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
            }}>{item.cityName}</Text>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{
                    backgroundColor: '#5a67f2',
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginRight: 10,
                }} onPress={() => handleEditCity(item.id)}>
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
                }} onPress={() => handleDeleteCity(item.id)}>
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
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>State Name : {stateName}</Text>
                <TouchableOpacity style={{
                    backgroundColor: Colors.primary,
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginTop: 10,
                    alignSelf: 'flex-start',
                }} onPress={handleAddCity}>
                    <Text style={{
                        color: Colors.background,
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}>Add City</Text>
                </TouchableOpacity>
                <FlatList
                    data={cityList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCityCard}
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
                                    }}
                                    placeholder="City Name"
                                    value={city.CityName}
                                    onChangeText={(text) => setCity({ ...city, CityName: text })}
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
                                    }} onPress={handleSaveCity}>
                                        <Text style={{
                                            color: Colors.background,
                                            fontSize: 14,
                                            fontWeight: 'bold',
                                        }}>{city.Id === 0 ? 'Add' : 'Save'}</Text>
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

export default CityScreen;

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
//   cityCard: {
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
//   cityName: {
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
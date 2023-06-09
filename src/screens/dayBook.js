import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import Colors from '../constants/Colors';

const DayBookScreen = () => {
    const [dayBook, setDayBook] = useState({ "Id": 0, "Particulars": "", "Credit": 0, "Debit": 0, "IsActive": true, "AccountId": "" });
    const [accountData, setAccountData] = useState([]);
    const [dayBookList, setDayBookList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    console.log(dayBook, "DAyBook")
    useEffect(() => {
        GetAccountList();
    }, []);
    const GetAccountList = () => {
        axios.get('http://192.168.1.11:5291/api/Account/get', {
            headers: {
                'Content-Type': 'application/json', // Example header
                'User-Agent': 'react-native/0.64.2', // Example User-Agent header
            },
        })
            .then((response) => {
                console.log(response.data);
                const AccountArray = response.data.map((account) => ({
                    value: account.id,
                    label: account.accountName,
                }));
                setAccountData(AccountArray);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const fetchDayBooksByAccountId = async (accountId) => {
        try {
            const response = await axios.get(`http://192.168.1.11:5291/api/DayBook/getDayBookByAccountId?Id=${accountId}`, {
                headers: {
                    'Content-Type': 'application/json', // Example header
                    'User-Agent': 'react-native/0.64.2', // Example User-Agent header
                },
            });
            setDayBookList(response.data);
        } catch (error) {
            console.log('Error fetching DayBooks:', error);
        }
    };
    const handleAccountSelect = (account) => {
        console.log(account, "Account")
        setValue(account.value);
        fetchDayBooksByAccountId(account.value);
    };


    const handleAddDayBook = () => {
        setDayBook({
            Id: 0,
            Particulars: "",
            Credit: 0,
            Debit: 0,
            IsActive: true,
            AccountId: "",
        });
        setModalVisible(true);
    };

    const handleDeleteDayBook = (id) => {
        axios.delete(`http://192.168.1.11:5291/api/DayBook/delete?Id=${id}`)
            .then((result) => {
                console.log(result);
                fetchDayBooksByAccountId(result.data.accountId)
            })
            .catch(err => console.error("Delete Error", err));
    }

    const handleSaveDayBook = async () => {
        try {
            // if (dayBook.Id !== 0) {
            //     await axios.put(`http://192.168.1.11:5291/api/DayBook/put`, JSON.stringify(dayBook), {
            //         headers: {
            //             'Content-Type': 'application/json'
            //         }
            //     })
            //         .then((response) => {
            //             if (response.status === 200) {
            //                 fetchDayBooksByAccountId(response.data.accountId);
            //                 Alert.alert('Sucess', 'DayBook Update successfully');
            //                 setDayBook([{
            //                     "Id": 0,
            //                     "Particulars": "",
            //                     "Credit": 0,
            //                     "Debit": 0,
            //                     "AccountId": "",
            //                     "IsActive": true
            //                 }]);
            //             }
            //         })
            //         .catch(err => console.error("Update error in DayBook", err));
            // } else {
            await axios.post('http://192.168.1.11:5291/api/DayBook/post', JSON.stringify(dayBook), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        fetchDayBooksByAccountId(response.data.accountId);
                        Alert.alert('Sucess', 'DayBook is Added Successfully')
                        setDayBook({
                            "Id": 0,
                            "Particulars": "",
                            "Credit": 0,
                            "Debit": 0,
                            "AccountId": "",
                            "IsActive": true,
                        });
                    }
                })
            // }
            setModalVisible(false);
        } catch (error) {
            console.log('Error saving DayBook:', error);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };


    const renderDayBookCard = ({ item }) => (
        <View style={{
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
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Particulars : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.particulars}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Credit : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.credit}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Debit : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.debit}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Created At : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.createdAt}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Account : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.account}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
                <TouchableOpacity style={{
                    backgroundColor: '#f25252',
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                }} onPress={() => handleDeleteDayBook(item.id)}>
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
                    data={accountData}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Select item' : '...'}
                    searchPlaceholder="Search..."
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={handleAccountSelect}
                />
                <TouchableOpacity style={{
                    backgroundColor: Colors.primary,
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginTop: 10,
                    alignSelf: 'flex-start',
                }} onPress={handleAddDayBook}>
                    <Text style={{
                        color: Colors.background,
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}>Add DayBook</Text>
                </TouchableOpacity>
                <FlatList
                    data={dayBookList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderDayBookCard}
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
                                        height: 80,
                                        textAlignVertical: 'top',
                                    }}
                                    placeholder="Particulars"
                                    multiline
                                    value={dayBook.Particulars}
                                    onChangeText={(text) => setDayBook({ ...dayBook, Particulars: text })}
                                />
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: Colors.primary,
                                        borderRadius: 10,
                                        padding: 8,
                                        marginBottom: 20,
                                    }}
                                    placeholder="Credit"
                                    keyboardType='numeric'
                                    value={dayBook.Credit}
                                    onChangeText={(text) => setDayBook({ ...dayBook, Credit: text })}
                                />
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: Colors.primary,
                                        borderRadius: 10,
                                        padding: 8,
                                        marginBottom: 20,
                                    }}
                                    placeholder="Debit"
                                    keyboardType='numeric'
                                    value={dayBook.Debit}
                                    onChangeText={(text) => setDayBook({ ...dayBook, Debit: text })}
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
                                    data={accountData}
                                    search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocus ? 'Select item' : '...'}
                                    searchPlaceholder="Search..."
                                    value={dayBook.AccountId}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={(value) => setDayBook({ ...dayBook, AccountId: value.value })}
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
                                    }} onPress={handleSaveDayBook}>
                                        <Text style={{
                                            color: Colors.background,
                                            fontSize: 14,
                                            fontWeight: 'bold',
                                        }}>{dayBook.Id === 0 ? 'Add' : 'Save'}</Text>
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

export default DayBookScreen;

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
//   dayBookCard: {
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
//   dayBookName: {
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
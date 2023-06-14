import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import Colors from '../constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

const BatchScreen = ({ route }) => {
    const { courseId, courseName } = route.params;
    const [batch, setBatch] = useState({ "Id": 0, "BatchName": "", "Code": "", "StartDate": "", "EndDate": "", "IsActive": true, "CourseId": courseId });
    const [batchList, setBatchList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [selectStartDate, setSelectStartDate] = useState(new Date());
    const [selectEndDate, setSelectEndDate] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    console.log(batch, "Batch")

    const handleStartDateChange = (event, date) => {
        if (date !== undefined) {
            setSelectStartDate(date);
            setBatch({ ...batch, StartDate: date })
        }
        setShowDatePicker(false);
    };

    const handleOpenStartDatePicker = () => {
        setShowDatePicker(true);
    };
    const handleConfirmStartDatePicker = () => {
        setShowDatePicker(false);
    };

    const handleToDateChange = (event, date) => {
        if (date !== undefined) {
            setSelectEndDate(date);
            setBatch({ ...batch, EndDate: date })
        }
        setShowEndDatePicker(false);
    };

    const handleOpenEndDatePicker = () => {
        setShowEndDatePicker(true);
    };

    const handleConfirmToDatePicker = () => {
        setShowEndDatePicker(false);
    };

    useEffect(() => {
        fetchBatchByCourseId(courseId);
    }, []);

    const fetchBatchByCourseId = async () => {
        try {
            const response = await axios.get(`http://192.168.1.7:5291/api/Batch/getBatchByCourseId?Id=${courseId}`, {
                headers: {
                    'Content-Type': 'application/json', // Example header
                    'User-Agent': 'react-native/0.64.2', // Example User-Agent header
                },
            });
            setBatchList(response.data);
            console.log(batchList, 'BatchList')
        } catch (error) {
            console.error('Error fetching Batch:', error);
        }
    };

    const handleAddBatch = () => {
        setBatch({
            Id: 0,
            BatchName: "",
            Code: "",
            StartDate: "",
            EndDate: "",
            IsActive: true,
            CourseId: courseId
        });
        setModalVisible(true);
    };

    const handleEditBatch = (id) => {
        axios.get(`http://192.168.1.7:5291/api/Batch/getById?Id=${id}`)
            .then((result) => {
                console.log(result);
                setBatch(
                    {
                        Id: result.data.id,
                        BatchName: result.data.batchName,
                        Code: result.data.code,
                        StartDate: result.data.startDate,
                        EndDate: result.data.endDate,
                        CourseId: result.data.courseId,
                        IsActive: result.data.isActive
                    }
                );
            })
            .catch(err => console.error("Get By Id Error", err));
        setModalVisible(true);
    };

    const handleDeleteBatch = (id) => {
        axios.delete(`http://192.168.1.7:5291/api/Batch/delete?Id=${id}`)
            .then((result) => {
                console.log(result);
                fetchBatchByCourseId(result.data.courseId)
            })
            .catch(err => console.error("Delete Error", err));
    }

    const handleSaveBatch = async () => {
        try {
            if (batch.Id !== 0) {
                await axios.put(`http://192.168.1.7:5291/api/Batch/put`, JSON.stringify(batch), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {
                        if (response.status === 200) {
                            fetchBatchByCourseId(response.data.courseId);
                            Alert.alert('Success', 'Batch Update successfully');
                            setBatch({
                                "Id": 0,
                                "BatchName": "",
                                "Code": "",
                                "StartDate": "",
                                "EndDate": "",
                                "CourseId": courseId,
                                "IsActive": true
                            });
                        }
                    })
                    .catch(err => console.error("Update error in Batch", err));
            } else {
                await axios.post('http://192.168.1.7:5291/api/Batch/post', JSON.stringify(batch), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {
                        if (response.status === 200) {
                            fetchBatchByCourseId(response.data.courseId);
                            Alert.alert('Success', 'Batch is Added Successfully')
                            setBatch({
                                "Id": 0,
                                "BatchName": "",
                                "Code": "",
                                "StartDate": "",
                                "EndDate": "",
                                "CourseId": courseId,
                                "IsActive": true
                            });
                        }
                    })
            }
            setModalVisible(false);
        } catch (error) {
            console.error('Error saving Batch:', error);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const getFormattedDate = (datestring) => {
        const datetimeString = datestring;
        const date = new Date(datetimeString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    const renderBatchCard = ({ item }) => (
        <View style={{
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
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Batch Name : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.batchName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Batch Code : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.code}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Start Date : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{getFormattedDate(item.startDate)}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>End Date : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{getFormattedDate(item.endDate)}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' }}>
                <TouchableOpacity style={{
                    backgroundColor: '#5a67f2',
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginRight: 10,
                }} onPress={() => handleEditBatch(item.id)}>
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
                }} onPress={() => handleDeleteBatch(item.id)}>
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
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Course Name : {courseName}</Text>
                <TouchableOpacity style={{
                    backgroundColor: Colors.primary,
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginTop: 10,
                    alignSelf: 'flex-start',
                }} onPress={handleAddBatch}>
                    <Text style={{
                        color: Colors.background,
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}>Add Batch</Text>
                </TouchableOpacity>
                <FlatList
                    data={batchList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderBatchCard}
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
                                        marginBottom: 10,
                                    }}
                                    placeholder="Batch Name"
                                    value={batch.BatchName}
                                    onChangeText={(text) => setBatch({ ...batch, BatchName: text })}
                                />
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: Colors.primary,
                                        borderRadius: 8,
                                        padding: 8,
                                        marginBottom: 10,
                                    }}
                                    placeholder="Batch Code"
                                    value={batch.Code.toString()}
                                    keyboardType='numeric'
                                    onChangeText={(text) => setBatch({ ...batch, Code: text })}
                                />
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 10,
                                    paddingHorizontal: 10,
                                    borderWidth: 1,
                                    borderColor: Colors.primary,
                                    borderRadius: 8,
                                }}>
                                    <TouchableOpacity onPress={handleOpenStartDatePicker}>
                                        <Icon name={'calendar'} size={25} />
                                    </TouchableOpacity>
                                    <TextInput style={{ marginLeft: 10, fontSize: 16, color: Colors.secondary }}
                                        value={batch.StartDate === "" ? ("Select Start Date") : (getFormattedDate(batch.StartDate))}
                                        placeholder="Select Start date"
                                        editable={false}
                                    />

                                </View>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={selectStartDate}
                                        mode="date"
                                        display="default"
                                        onChange={handleStartDateChange}
                                        onConfirm={handleConfirmStartDatePicker}
                                        onCancel={handleConfirmStartDatePicker}
                                    />
                                )}
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 10,
                                    paddingHorizontal: 10,
                                    borderWidth: 1,
                                    borderColor: Colors.primary,
                                    borderRadius: 8,
                                }}>
                                    <TouchableOpacity onPress={handleOpenEndDatePicker}>
                                        <Icon name={'calendar'} size={25} />
                                    </TouchableOpacity>
                                    <TextInput
                                        style={{ marginLeft: 10, fontSize: 16, color: Colors.secondary }}
                                        value={batch.EndDate === "" ? "Select End Date" : getFormattedDate(batch.EndDate)}
                                        placeholder="Select End date"
                                        editable={false}
                                    />

                                </View>
                                {showEndDatePicker && (
                                    <DateTimePicker
                                        value={selectEndDate}
                                        mode="date"
                                        display="default"
                                        onChange={handleToDateChange}
                                        onConfirm={handleConfirmToDatePicker}
                                        onCancel={handleConfirmToDatePicker}
                                    />
                                )}
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
                                    }} onPress={handleSaveBatch}>
                                        <Text style={{
                                            color: Colors.background,
                                            fontSize: 14,
                                            fontWeight: 'bold',
                                        }}>{batch.Id === 0 ? 'Add' : 'Save'}</Text>
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

export default BatchScreen;

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
//   batchCard: {
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
//   batchName: {
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
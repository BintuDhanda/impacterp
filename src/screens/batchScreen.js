import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '../../App';
import { useContext } from 'react';
import { Get as httpGet, Post as httpPost } from '../constants/httpService';

const BatchScreen = ({ route }) => {
    const { user, setUser } = useContext(UserContext);
    const { courseId, courseName } = route.params;
    const [batch, setBatch] = useState({ "BatchId": 0, "BatchName": "", "Code": "", "StartDate": "", "EndDate": "", "IsActive": true, "CourseId": courseId, "CreatedAt": null, "CreatedBy": user.userId, "LastUpdatedBy": null, });
    const [batchList, setBatchList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [selectStartDate, setSelectStartDate] = useState(new Date());
    const [selectEndDate, setSelectEndDate] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [batchDeleteId, setBatchDeleteId] = useState(0);
    const [showDelete, setShowDelete] = useState(false);

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
        fetchBatchByCourseId();
    }, []);

    const fetchBatchByCourseId = async () => {
        try {
            const response = await httpGet(`Batch/getBatchByCourseId?Id=${courseId}`)
            setBatchList(response.data);
            console.log(batchList, 'BatchList')
        } catch (error) {
            console.error('Error fetching Batch:', error);
            Toast.show({
                type: 'error',
                text1: `${error}`,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
            });
        }
    };

    const handleAddBatch = () => {
        setBatch({
            BatchId: 0,
            BatchName: "",
            Code: "",
            StartDate: "",
            EndDate: "",
            IsActive: true,
            CourseId: courseId,
            CreatedAt: null,
            CreatedBy: user.userId,
            LastUpdatedBy: null,
        });
        setModalVisible(true);
    };

    const handleEditBatch = (id) => {
        httpGet(`Batch/getById?Id=${id}`)
            .then((result) => {
                console.log(result);
                setBatch(
                    {
                        BatchId: result.data.batchId,
                        BatchName: result.data.batchName,
                        Code: result.data.code,
                        StartDate: result.data.startDate,
                        EndDate: result.data.endDate,
                        CourseId: result.data.courseId,
                        IsActive: result.data.isActive,
                        CreatedAt: result.data.createdAt,
                        CreatedBy: result.data.createdBy,
                        LastUpdatedBy: user.userId
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

    const DeleteBatchIdConfirm = (batchid) => {
        setBatchDeleteId(batchid);
    }

    const DeleteBatchIdConfirmYes = () => {
        httpGet(`Batch/delete?Id=${batchDeleteId}`)
            .then((result) => {
                console.log(result);
                fetchBatchByCourseId();
                setBatchDeleteId(0);
                setShowDelete(false);
            })
            .catch((error) => {
                console.error('Delete Batch error', error);
                Toast.show({
                    type: 'error',
                    text1: `${error}`,
                    position: 'bottom',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            })
    }

    const DeleteBatchIdConfirmNo = () => {
        setBatchDeleteId(0);
        setShowDelete(false);
    }

    const handleSaveBatch = async () => {
        try {
            if (batch.BatchId !== 0) {
                await httpPost("Batch/put", batch)
                    .then((response) => {
                        if (response.status === 200) {
                            fetchBatchByCourseId();
                            Alert.alert('Success', 'Batch Update successfully');
                            setBatch({
                                "BatchId": 0,
                                "BatchName": "",
                                "Code": "",
                                "StartDate": "",
                                "EndDate": "",
                                "CourseId": courseId,
                                "IsActive": true,
                                "CreatedAt": null,
                                "CreatedBy": user.userId,
                                "LastUpdatedBy": null,
                            });
                        }
                    })
                    .catch((err) => {
                        console.error("Update error in Batch", err);
                        Toast.show({
                            type: 'error',
                            text1: `${err}`,
                            position: 'bottom',
                            visibilityTime: 2000,
                            autoHide: true,
                        });
                    });
            } else {
                await httpPost("Batch/post", batch)
                    .then((response) => {
                        if (response.status === 200) {
                            fetchBatchByCourseId();
                            Alert.alert('Success', 'Batch is Added Successfully')
                            setBatch({
                                "BatchId": 0,
                                "BatchName": "",
                                "Code": "",
                                "StartDate": "",
                                "EndDate": "",
                                "CourseId": courseId,
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
            console.error('Error saving Batch:', error);
            Toast.show({
                type: 'error',
                text1: `${error}`,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
            });
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
            borderWidth: 1.5,
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
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Duration : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.duration}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' }}>
                <TouchableOpacity style={{ marginRight: 10, }} onPress={() => handleEditBatch(item.batchId)}>
                    <Icon name="pencil" size={20} color={'#5a67f2'} style={{ marginLeft: 8, textAlignVertical: 'center' }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { DeleteBatchIdConfirm(item.batchId); setShowDelete(true); }}>
                    <Icon name="trash" size={20} color={'#f25252'} style={{ marginRight: 8, textAlignVertical: 'center' }} />
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
                    flex: 1,
                    backgroundColor: Colors.primary,
                    borderRadius: 5,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    marginTop: 10,
                }} onPress={handleAddBatch}>
                    <Text style={{
                        color: Colors.background,
                        fontSize: 16,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}>Add Batch</Text>
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
                                        DeleteBatchIdConfirmYes();
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
                                        DeleteBatchIdConfirmNo();
                                    }}>
                                        <Text style={{ fontSize: 16, color: Colors.background }}>No</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}

                <FlatList
                    data={batchList}
                    keyExtractor={(item) => item.batchId.toString()}
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
                                        }}>{batch.BatchId === 0 ? 'Add' : 'Save'}</Text>
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
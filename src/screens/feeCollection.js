import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Animated } from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import Colors from '../constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Post as httpPost } from '../constants/httpService';

const StudentBatchFeesScreen = () => {
    // const ToDate = new Date();
    // ToDate.setDate(ToDate.getDate() + 1)
    // const FromDate = new Date();
    // FromDate.setDate(FromDate.getDate() - 7);
    const [studentBatchFeesDeposit, setStudentBatchFeesDeposit] = useState({ "Id": 0,  "Particulars": "", "Deposit": 0, "Refund": 0, "IsActive": true, });
    const [studentBatchFeesRefund, setStudentBatchFeesRefund] = useState({ "Id": 0,  "Particulars": "", "Deposit": 0, "Refund": 0, "IsActive": true, });
    const [registrationNumber, setRegistrationNumber] = useState({"RegistrationNumber": ""})
    const [studentBatchFeesList, setStudentBatchFeesList] = useState([]);
    const [depositModalVisible, setDepositModalVisible] = useState(false);
    const [refundModalVisible, setRefundModalVisible] = useState(false);
    const moveToRight = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const [loading, setLoading] = useState(false);
    // const [fromDate, setFromDate] = useState(FromDate.toISOString().slice(0, 10).toString());
    // const [toDate, setToDate] = useState(ToDate.toISOString().slice(0, 10).toString());
    const [take, setTake] = useState(10);
    const [skip, setSkip] = useState(0);
    const [isEndReached, setIsEndReached] = useState(true);

    // const [selectFromDate, setSelectFromDate] = useState(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000));
    // const [selectToDate, setSelectToDate] = useState(new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000))
    // const [showDatePicker, setShowDatePicker] = useState(false);
    // const [showToDatePicker, setShowToDatePicker] = useState(false);
    // const [showSearch, setShowSearch] = useState(false);

    // const handleFromDateChange = (event, date) => {
    //     if (date !== undefined) {
    //         setSelectFromDate(date);
    //     }
    //     setShowDatePicker(false);
    // };

    // const handleOpenFromDatePicker = () => {
    //     setShowDatePicker(true);
    // };
    // const handleConfirmFromDatePicker = () => {
    //     setShowDatePicker(false);
    // };

    // const handleToDateChange = (event, date) => {
    //     if (date !== undefined) {
    //         setSelectToDate(date);
    //     }
    //     setShowToDatePicker(false);
    // };

    // const handleOpenToDatePicker = () => {
    //     setShowToDatePicker(true);
    // };

    // const handleConfirmToDatePicker = () => {
    //     setShowToDatePicker(false);
    // };

    // Function to handle button press
    const handleHistory = () => {
        setStudentBatchFeesList([]);
        setSkip(0);
        if (registrationNumber.RegistrationNumber === "") {
            Toast.show({
                type: 'error',
                text1: 'Enter Registration Number after Search History',
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
            });
        }
        else {
            GetStudentBatchFeesList();
        }
    };

    // useEffect(() => {
    //     setLoading(true);
    //     GetStudentBatchFeesList();
    // }, [skip])

    const GetStudentBatchFeesList = () => {
        setLoading(true);
        const filter = { "RegistrationNumber": registrationNumber.RegistrationNumber , "Take": take, "Skip": skip }
        // axios.post(`http://192.168.1.5:5291/api/StudentBatchFees/getStudentBatchFeesByRegistrationNumber`, JSON.stringify(filter), {
        //     headers: {
        //         'Content-Type': 'application/json', // Example header
        //         'User-Agent': 'react-native/0.64.2', // Example User-Agent header
        //     },
        // })
        httpPost("StudentBatchFees/getStudentBatchFeesByRegistrationNumber", filter)
            .then((response) => {
                setLoading(false);
                if (response.data.length >= 0) {
                    setIsEndReached(false);
                    setStudentBatchFeesList([...studentBatchFeesList, ...response.data])
                    setSkip(skip + 10);
                }
                if (response.data.length === 0) {
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
            .catch((error) => {
                setLoading(false);
                console.error(error);
            });
    }

    const handleAddDepositStudentBatchFees = () => {
        setStudentBatchFeesDeposit({
            Id: 0,
            Particulars: "",
            Deposit: 0,
            Refund: 0,
            IsActive: true,
        });
        setDepositModalVisible(true);
    };
    const handleAddRefundStudentBatchFees = () => {
        setStudentBatchFeesRefund({
            Id: 0,
            Particulars: "",
            Deposit: 0,
            Refund: 0,
            IsActive: true,
        });
        setRefundModalVisible(true);
    };

    const handleDeleteStudentBatchFees = (id) => {
        axios.delete(`http://192.168.1.3:5291/api/StudentBatchFees/delete?Id=${id}`)
            .then((result) => {
                console.log(result);
                setStudentBatchFeesList([]);
                setSkip(0);
            })
            .catch(err => console.error("Delete Error", err));
    }

    const handleSaveStudentBatchFeesDeposit = () => {
        const filter = { "RegistrationNumber": registrationNumber.RegistrationNumber, "Take": take, "Skip": skip }
        httpPost("Attendance/RegistrationIsExists", filter).then((response) => {
            if (response.data === false) {
                Toast.show({
                    type: 'error',
                    text1: 'This Registration Number is Not Exist',
                    position: 'bottom',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            }
            else {
                if (studentBatchFeesDeposit.Deposit !== 0) {
                    httpPost("StudentBatchFees/post", studentBatchFeesDeposit)
                        .then((response) => {
                            if (response.status === 200) {
                                setStudentBatchFeesList([]);
                                setSkip(0);
                                Alert.alert('Sucess', 'StudentBatchFees Deposit is Added Successfully')
                                setLoading(true);
                                const filter = { "RegistrationNumber": registrationNumber.RegistrationNumber, "Take": take, "Skip": 0 }
                                httpPost("StudentBatchFees/getStudentBatchFeesByRegistrationNumber", filter)
                                    .then((response) => {
                                        setLoading(false);
                                        if (response.data.length >= 0) {
                                            setIsEndReached(false);
                                            setStudentBatchFeesList(response.data)
                                        }
                                        if (response.data.length === 0) {
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
                                    .catch((error) => {
                                        setLoading(false);
                                        console.error("Add Deposit Get Student Batch Fees By Registration Number error", error);
                                    });
                                setStudentBatchFeesDeposit({
                                    "Id": 0,
                                    "Particulars": "",
                                    "Deposit": 0,
                                    "Refund": 0,
                                    "IsActive": true,
                                });
                            }
                        })
                }
                setDepositModalVisible(false);
            }
        })
            .catch(err => console.error('Error in Registration IsExists', err))
    };

    const handleSaveStudentBatchFeesRefund = () => {
        const filter = { "RegistrationNumber": registrationNumber.RegistrationNumber, "Take": take, "Skip": skip }
        httpPost("Attendance/RegistrationIsExists", filter).then((response) => {
            if (response.data === false) {
                Toast.show({
                    type: 'error',
                    text1: 'This Registration Number is Not Exist',
                    position: 'bottom',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            }
            else {
            if (studentBatchFeesRefund.Refund !== 0) {
                httpPost("StudentBatchFees/post", studentBatchFeesRefund)
                    .then((response) => {
                        if (response.status === 200) {
                            setStudentBatchFeesList([]);
                            setSkip(0);
                            Alert.alert('Sucess', 'StudentBatchFees Refund is Added Successfully')
                            setLoading(true);
                                const filter = { "RegistrationNumber": registrationNumber.RegistrationNumber, "Take": take, "Skip": 0 }
                                httpPost("StudentBatchFees/getStudentBatchFeesByRegistrationNumber", filter)
                                    .then((response) => {
                                        setLoading(false);
                                        if (response.data.length >= 0) {
                                            setIsEndReached(false);
                                            setStudentBatchFeesList(response.data)
                                        }
                                        if (response.data.length === 0) {
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
                                    .catch((error) => {
                                        setLoading(false);
                                        console.error("Add Refund Get Student Batch Fees By Registration Number error", error);
                                    });
                            setStudentBatchFeesRefund({
                                "Id": 0,
                                "Particulars": "",
                                "Deposit": 0,
                                "Refund": 0,
                                "IsActive": true,
                            });
                        }
                    })
            }
            setRefundModalVisible(false);
        }
    })

    };

    const handleCloseModal = () => {
        setDepositModalVisible(false);
        setRefundModalVisible(false);
    };

    const getFormattedDate = (datestring) => {
        const datetimeString = datestring;
        const date = new Date(datetimeString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    const handleLoadMore = async () => {
        console.log("Execute Handle More function")
        if (!isEndReached) {
            GetStudentBatchFeesList();
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

    const renderStudentBatchFeesCard = ({ item }) => (
        <View style={{
            backgroundColor: Colors.background,
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
            marginTop: 20,
            shadowColor: Colors.shadow,
            shadowOffset: { width: 10, height: 2 },
            shadowOpacity: 4,
            shadowRadius: 10,
            elevation: 10,
            borderWidth: 0.5,
            borderColor: Colors.primary,
        }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Student Name : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.studentName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Batch Name : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.batchName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Mobile : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.mobile}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Particulars : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.particulars}</Text>
            </View>
            {item.deposit !== 0 ? (<View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Deposit : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.deposit}</Text>
            </View>) : null}
            {item.refund !== 0 ? (<View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Refund : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.refund}</Text>
            </View>) : null}
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Created At : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{getFormattedDate(item.createdAt)}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
                <TouchableOpacity style={{
                    backgroundColor: '#f25252',
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                }} onPress={() => handleDeleteStudentBatchFees(item.studentBatchFeesId)}>
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
            <View style={{ flex: 1 }}>
                <Animated.View style={{ flex: 1, position: 'absolute', top: 0, padding: 16, right: 0, left: 0, bottom: 0, backgroundColor: Colors.background, transform: [{ scale: scale }, { translateX: moveToRight }] }}>

                    <View style={{ flexDirection: 'row', borderRadius: 10, borderColor: Colors.primary, borderWidth: 0.5, fontSize: 16, paddingHorizontal: 20 }}>
                        <Icon style={{ textAlignVertical: 'center' }} name="search" size={20} />
                        <TextInput style={{ flex: 1, marginLeft: 10 }} 
                        placeholder="Enter Registration Number" 
                        value={registrationNumber.RegistrationNumber}
                        keyboardType='numeric'
                        onChangeText={(text)=> {
                            setRegistrationNumber({...registrationNumber, RegistrationNumber: text})
                            setStudentBatchFeesList([]);
                            setSkip(0);
                        }}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <TouchableOpacity style={{
                            flex: 1,
                            backgroundColor: Colors.primary,
                            borderRadius: 5,
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            marginTop: 10,
                            marginRight: 3,
                        }} onPress={handleAddDepositStudentBatchFees}>
                            <Text style={{
                                color: Colors.background,
                                fontSize: 14,
                                fontWeight: 'bold',
                                alignSelf: 'center',
                            }}>Deposit Entry</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flex: 1,
                            backgroundColor: Colors.primary,
                            borderRadius: 5,
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            marginTop: 10,
                            marginRight: 3,
                        }} onPress={handleAddRefundStudentBatchFees}>
                            <Text style={{
                                color: Colors.background,
                                fontSize: 14,
                                fontWeight: 'bold',
                                alignSelf: 'center',
                            }}>Refund Entry</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flex: 1,
                            backgroundColor: Colors.primary,
                            borderRadius: 5,
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            marginTop: 10,
                        }} onPress={handleHistory}>
                            <Text style={{
                                color: Colors.background,
                                fontSize: 14,
                                fontWeight: 'bold',
                                alignSelf: 'center'
                            }}>History</Text>
                        </TouchableOpacity>
                    </View>
                    {/* {showSearch && (
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
                    )} */}

                    <FlatList
                        data={studentBatchFeesList}
                        keyExtractor={(item) => item.studentBatchFeesId.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderStudentBatchFeesCard}
                        ListFooterComponent={renderFooter}
                        onEndReached={() => {
                            handleLoadMore();
                        }}
                        onEndReachedThreshold={0.1}
                    />

                    <Toast ref={(ref) => Toast.setRef(ref)} />

                    {depositModalVisible && (
                        <Modal transparent visible={depositModalVisible}>
                            <View style={{
                                flex: 1,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <View style={{ backgroundColor: Colors.background, borderRadius: 10, padding: 20, width: '80%', }}>
                                    <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: 'bold', color: Colors.shadow }}>Deposit Entry</Text>
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
                                        value={studentBatchFeesDeposit.Particulars}
                                        onChangeText={(text) => setStudentBatchFeesDeposit({ ...studentBatchFeesDeposit, Particulars: text })}
                                    />
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: Colors.primary,
                                            borderRadius: 10,
                                            padding: 8,
                                            marginBottom: 20,
                                        }}
                                        placeholder="Deposit"
                                        keyboardType='numeric'
                                        value={studentBatchFeesDeposit.Deposit}
                                        onChangeText={(text) => setStudentBatchFeesDeposit({ ...studentBatchFeesDeposit, Deposit: text })}
                                    />
                                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end', }}>
                                        <TouchableOpacity style={{
                                            backgroundColor: Colors.primary,
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                        }} onPress={handleSaveStudentBatchFeesDeposit}>
                                            <Text style={{
                                                color: Colors.background,
                                                fontSize: 14,
                                                fontWeight: 'bold',
                                            }}>{studentBatchFeesDeposit.Id === 0 ? 'Add' : 'Save'}</Text>
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
                            <Toast ref={(ref) => Toast.setRef(ref)} />
                        </Modal>
                    )}
                    {refundModalVisible && (
                        <Modal transparent visible={refundModalVisible}>
                            <View style={{
                                flex: 1,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <View style={{ backgroundColor: Colors.background, borderRadius: 10, padding: 20, width: '80%', }}>
                                    <Text style={{ fontSize: 20, marginBottom: 10, color: Colors.shadow, fontWeight: 'bold' }}>Refund Entry</Text>
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
                                        value={studentBatchFeesRefund.Particulars}
                                        onChangeText={(text) => setStudentBatchFeesRefund({ ...studentBatchFeesRefund, Particulars: text })}
                                    />
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: Colors.primary,
                                            borderRadius: 10,
                                            padding: 8,
                                            marginBottom: 20,
                                        }}
                                        placeholder="Refund"
                                        keyboardType='numeric'
                                        value={studentBatchFeesRefund.Refund}
                                        onChangeText={(text) => setStudentBatchFeesRefund({ ...studentBatchFeesRefund, Refund: text })}
                                    />
                                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end', }}>
                                        <TouchableOpacity style={{
                                            backgroundColor: Colors.primary,
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                        }} onPress={handleSaveStudentBatchFeesRefund}>
                                            <Text style={{
                                                color: Colors.background,
                                                fontSize: 14,
                                                fontWeight: 'bold',
                                            }}>{studentBatchFeesRefund.Id === 0 ? 'Add' : 'Save'}</Text>
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
                            <Toast ref={(ref) => Toast.setRef(ref)} />
                        </Modal>
                    )}
                </Animated.View>
            </View>
        </ScrollView>
    );
};

export default StudentBatchFeesScreen;

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
//   studentBatchFeesCard: {
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
//   studentBatchFeesName: {
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
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Animated } from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Post as httpPost,Delete as httpDelete } from '../constants/httpService';

const AttendanceScreen = ({navigation}) => {
    const [attendance, setAttendance] = useState({ "Id": 0, "AttendanceType": "", "RegistrationNumber": "", "IsActive": true });
    const [attendanceList, setAttendanceList] = useState([]);
    const moveToRight = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const [loading, setLoading] = useState(false);
    const [take, setTake] = useState(10);
    const [skip, setSkip] = useState(0);
    const [isEndReached, setIsEndReached] = useState(true);

    const handleHistory = () => {
        if (attendance.RegistrationNumber === "") {
            Toast.show({
                type: 'error',
                text1: 'Enter Registration Number after Search History',
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
            });
        }
        else {
            navigation.navigate("AttendanceHistoryScreen", {registrationNumber: attendance.RegistrationNumber})
        }
    };

    const GetAttendanceList = () => {
        setLoading(true);
        const filter = { "RegistrationNumber": attendance.RegistrationNumber, "Take": take, "Skip": skip }
        httpPost("Attendance/getAttendanceByRegistrationNumber", filter)
            .then((response) => {
                console.log(attendanceList, "AttendanceList")
                setLoading(false);
                if (response.data.length >= 0) {
                    setIsEndReached(false);
                    setAttendanceList([...attendanceList, ...response.data]);
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

    const handleAddCheckedInAttendance = () => {
        const filter = { "RegistrationNumber": attendance.RegistrationNumber, "Take": take, "Skip": skip }
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
                httpPost("Attendance/post", { "Id": 0, "AttendanceType": "CheckedIn", "RegistrationNumber": attendance.RegistrationNumber, "IsActive": true })
                    .then((response) => {
                        if (response.status === 200) {
                            setAttendanceList([]);
                            setSkip(0);
                            Alert.alert('Sucess', 'Attendance is Added Successfully')
                            setLoading(true);
                            httpPost("Attendance/getAttendanceByRegistrationNumber", { "RegistrationNumber": attendance.RegistrationNumber, "Take": take, "Skip": 0 })
                                .then((response) => {
                                    console.log(attendanceList, "AttendanceList")
                                    setLoading(false);
                                    if (response.data.length >= 0) {
                                        setIsEndReached(false);
                                        setAttendanceList(response.data);
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
                                    console.error('Error in Get Attendance after Add CheckedIn',error);
                                });
                        }
                    })
                    .catch(err => console.error('Error saving Attendance:', err))
            }
        })
            .catch(err => console.error('Error in Registration IsExists', err))
    };
    const handleAddCheckedOutAttendance = () => {
        const filter = { "RegistrationNumber": attendance.RegistrationNumber, "Take": take, "Skip": skip }
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
                httpPost("Attendance/post", { "Id": 0, "AttendanceType": "CheckedOut", "RegistrationNumber": attendance.RegistrationNumber, "IsActive": true })
                    .then((response) => {
                        if (response.status === 200) {
                            setAttendanceList([]);
                            setSkip(0);
                            Alert.alert('Sucess', 'Attendance is Added Successfully')
                            setLoading(true);
                            httpPost("Attendance/getAttendanceByRegistrationNumber", { "RegistrationNumber": attendance.RegistrationNumber, "Take": take, "Skip": 0 })
                                .then((response) => {
                                    console.log(attendanceList, "AttendanceList")
                                    setLoading(false);
                                    if (response.data.length >= 0) {
                                        setIsEndReached(false);
                                        setAttendanceList(response.data);
                                        setSkip(skip+10)
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
                                    console.error('Error in Get Attendance after Add CheckedOut', error);
                                });
                        }
                    })
                    .catch(err => console.error('Error saving Attendance:', err))
            }
        })
            .catch(err => console.error('Error in Registration IsExists', err))
    };

    const handleDeleteAttendance = (id) => {
        httpDelete(`Attendance/delete?Id=${id}`)
            .then((result) => {
                console.log(result);
                setAttendanceList([]);
                setSkip(0);
                setLoading(true);
                httpPost("Attendance/getAttendanceByRegistrationNumber", { "RegistrationNumber": attendance.RegistrationNumber, "Take": take, "Skip": 0 })
                    .then((response) => {
                        console.log(attendanceList, "AttendanceList")
                        setLoading(false);
                        if (response.data.length >= 0) {
                            setAttendanceList([]);
                            setIsEndReached(false);
                            setAttendanceList(response.data);
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
            })
            .catch(err => console.error("Delete Error", err));
    }

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
            GetAttendanceList();
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

    const renderAttendanceCard = ({ item }) => (
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
                <Text style={{ fontSize: 16 }}>BatchName : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.batchName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Attendance Type : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.attendanceType}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Punch Time : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{getFormattedDate(item.punchTime)}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Registration Number : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.registrationNumber}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Student Name : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.studentName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Mobile : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.mobile}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
                <TouchableOpacity style={{
                    backgroundColor: '#f25252',
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                }} onPress={() => {
                    handleDeleteAttendance(item.attendanceId)
                    setSkip(0);
                    }}>
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
                            value={attendance.RegistrationNumber}
                            keyboardType='numeric'
                            onChangeText={(text) => {
                                setAttendance({ ...attendance, RegistrationNumber: text })
                                setAttendanceList([]);
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
                        }} onPress={() => {
                            setAttendanceList([]);
                            setSkip(0);
                            handleAddCheckedInAttendance();
                            }}>
                            <Text style={{
                                color: Colors.background,
                                fontSize: 14,
                                fontWeight: 'bold',
                                alignSelf: 'center'
                            }}>Checked-In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flex: 1,
                            backgroundColor: Colors.primary,
                            borderRadius: 5,
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            marginTop: 10,
                            marginRight: 3
                        }} onPress={() => {
                            setAttendanceList([]);
                            setSkip(0);
                            handleAddCheckedOutAttendance();
                            }}>
                            <Text style={{
                                color: Colors.background,
                                fontSize: 14,
                                fontWeight: 'bold',
                                alignSelf: 'center'
                            }}>Checked-Out</Text>
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

                    <FlatList
                        data={attendanceList}
                        keyExtractor={(item) => item.attendanceId.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderAttendanceCard}
                        ListFooterComponent={renderFooter}
                        onEndReachedThreshold={0.1}
                    />

                    <Toast ref={(ref) => Toast.setRef(ref)} />
                </Animated.View>
            </View>
        </ScrollView>
    );
};

export default AttendanceScreen;

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
//   attendanceCard: {
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
//   attendanceName: {
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
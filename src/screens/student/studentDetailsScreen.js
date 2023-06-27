import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Animated } from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import Colors from '../../constants/Colors';
import { Get as httpGet } from '../../constants/httpService';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

const StudentDetailsScreen = ({ navigation }) => {
    const [studentDetailsList, setStudentDetailsList] = useState([]);
    const moveToRight = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        GetStudentList();
    }, [])

    const handleNavigate = (studentId) => {
        navigation.navigate('StudentFormScreen', { studentId: studentId })
    }

    const handleAddAddressNavigate = (studentId) => {
        navigation.navigate('AddressScreen', { studentId: studentId })
    }
    const handleAddStudentQualificationNavigate = (studentId) => {
        navigation.navigate('StudentQualificationScreen', { studentId: studentId })
    }
    const handleAddStudentTokenNavigate = (studentId) => {
        navigation.navigate('StudentTokenScreen', { studentId: studentId })
    }
    const handleAddStudentBatchNavigate = (studentId) => {
        navigation.navigate('StudentBatchScreen', { studentId: studentId })
    }
    const handleAttendanceNavigate = (studentId) => {
        navigation.navigate('AttendanceScreen', { studentId: studentId })
    }

    const GetStudentList = () => {
        // axios.get('http://192.168.1.3:5291/api/StudentDetails/get', {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        httpGet("StudentDetails/get")
            .then((response) => {
                console.log(response.data, "StudentDetails list");
                const studentDetailsArray = response.data.map((studentDetails) => ({
                    value: studentDetails.id,
                    label: studentDetails.firstName + " " + studentDetails.lastName,
                    father: studentDetails.fatherName,
                    mother: studentDetails.motherName,
                    mobile: studentDetails.mobile
                }));
                setStudentDetailsList(studentDetailsArray);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const fetchStudentDetailsByUserId = async () => {
        try {
            const response = await axios.get(`http://192.168.1.3:5291/api/StudentDetails/getStudentDetailsByUserId?UserId=${1}`, {
                headers: {
                    'Content-Type': 'application/json', // Example header
                    'User-Agent': 'react-native/0.64.2', // Example User-Agent header
                },
            });
            setLoading(false);
            setStudentDetailsList(response.data);
            console.log(studentDetailsList, 'studentDetails')
        } catch (error) {
            console.log('Error fetching StudentDetails:', error);
        }
    };

    const handleDeleteStudentDetails = (id) => {
        axios.delete(`http://192.168.1.3:5291/api/StudentDetails/delete?Id=${id}`)
            .then((result) => {
                console.log(result);
                GetStudentList();
                // fetchStudentDetailsByUserId();
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

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator animating size="large" />
            </View>
        );
    };

    const renderStudentDetailsCard = ({ item }) => (
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
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.label}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Father Name : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.father}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Mother Name : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.mother}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Mobile : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.mobile}</Text>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' }}>

                <TouchableOpacity
                    style={{
                        backgroundColor: Colors.primary,
                        borderRadius: 5,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        marginRight: 10,
                    }} onPress={() => handleAddAddressNavigate(item.value)} >
                    <Text style={{
                        color: Colors.background,
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}>Address</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: Colors.primary,
                        borderRadius: 5,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        marginRight: 10,
                    }} onPress={() => handleAddStudentQualificationNavigate(item.value)} >
                    <Text style={{
                        color: Colors.background,
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}>Qualification</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: Colors.primary,
                        borderRadius: 5,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        marginRight: 10,
                    }} onPress={() => handleAddStudentTokenNavigate(item.value)} >
                    <Text style={{
                        color: Colors.background,
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}>Token</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: Colors.primary,
                        borderRadius: 5,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                    }} onPress={() => handleAddStudentBatchNavigate(item.value)} >
                    <Text style={{
                        color: Colors.background,
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}>Batch</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#5a67f2',
                        borderRadius: 5,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        marginRight: 10,
                    }} onPress={() => handleAttendanceNavigate(item.value)} >
                    <Text style={{
                        color: Colors.background,
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}>Attendance</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#5a67f2',
                        borderRadius: 5,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        marginRight: 10,
                    }} onPress={() => handleNavigate(item.value)} >
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
                }} onPress={() => handleDeleteStudentDetails(item.id)}>
                    <Text style={{
                        color: Colors.background,
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View >
    );

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 1 }}>
                <Animated.View style={{ flex: 1, position: 'absolute', top: 0, padding: 16, right: 0, left: 0, bottom: 0, backgroundColor: Colors.background, transform: [{ scale: scale }, { translateX: moveToRight }] }}>

                    <FlatList
                        data={studentDetailsList}
                        keyExtractor={(item) => item.value.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderStudentDetailsCard}
                        ListFooterComponent={renderFooter}
                    />

                    <Toast ref={(ref) => Toast.setRef(ref)} />
                </Animated.View>
            </View>
        </ScrollView>
    );
};

export default StudentDetailsScreen;

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
//   studentDetailsCard: {
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
//   studentDetailsName: {
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
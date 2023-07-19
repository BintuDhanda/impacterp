import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Colors from '../../../constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dropdown } from 'react-native-element-dropdown';
import { UserContext } from '../../../../App';
import { useContext } from 'react';
import { Get as httpGet, Post as httpPost } from '../../../constants/httpService';

const StudentBatchFormScreen = ({ route, navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const { batchId, studentId } = route.params;
    const [studentBatch, setStudentBatch] = useState({
        "StudentBatchId": 0,
        "DateOfJoin": "",
        "StudentId": studentId,
        "BatchId": "",
        "RegistrationNumber": "",
        "TokenNumber": "",
        "IsActive": true,
        "CreatedAt": null,
        "CreatedBy": user.userId,
        "LastUpdatedBy": null,
    });
    const [courseCategoryList, setCourseCategoryList] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [batchList, setBatchList] = useState([]);

    const [value, setValue] = useState(null);
    const [courseValue, setCourseValue] = useState(null);
    const [batchValue, setBatchValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [selectDateOfJoin, setSelectDateOfJoin] = useState(new Date());
    const [selectBatchStartDate, setSelectBatchStartDate] = useState(new Date());
    const [selectBatchEndDate, setSelectBatchEndDate] = useState(new Date());
    const [showDateOfJoinPicker, setShowDateOfJoinPicker] = useState(false);
    const [showBatchStartDatePicker, setShowBatchStartDatePicker] = useState(false);
    const [showBatchEndDatePicker, setShowBatchEndDatePicker] = useState(false);

    useEffect(() => {
        if (batchId !== undefined) {
            GetBatchById();
        }
    }, [batchId])

    console.log(batchId, "BatchID")
    useEffect(() => {
        if (courseCategoryList.length === 0) {
            GetCourseCategoryList();
        }
    }, []);

    const handleDateOfJoinChange = (event, date) => {
        if (date !== undefined) {
            setSelectDateOfJoin(date);
            setStudentBatch({ ...studentBatch, DateOfJoin: date })
        }
        setShowDateOfJoinPicker(false);
    };

    const handleOpenDateOfJoinPicker = () => {
        setShowDateOfJoinPicker(true);
    };
    const handleConfirmDateOfJoinPicker = () => {
        setShowDateOfJoinPicker(false);
    };

    const handleBatchStartDateChange = (event, date) => {
        if (date !== undefined) {
            setSelectBatchStartDate(date);
            setStudentBatch({ ...studentBatch, BatchStartDate: date })
        }
        setShowBatchStartDatePicker(false);
    };

    const handleOpenBatchStartDatePicker = () => {
        setShowBatchStartDatePicker(true);
    };
    const handleConfirmBatchStartDatePicker = () => {
        setShowBatchStartDatePicker(false);
    };

    const handleBatchEndDateChange = (event, date) => {
        if (date !== undefined) {
            setSelectBatchEndDate(date);
            setStudentBatch({ ...studentBatch, BatchEndDate: date })
        }
        setShowBatchEndDatePicker(false);
    };

    const handleOpenBatchEndDatePicker = () => {
        setShowBatchEndDatePicker(true);
    };
    const handleConfirmBatchEndDatePicker = () => {
        setShowBatchEndDatePicker(false);
    };

    const GetBatchById = () => {
        httpGet(`StudentBatch/getById?Id=${batchId}`)
            .then((response) => {
                console.log(response.data, "Get Batch By id")
                setStudentBatch({
                    StudentBatchId: response.data.studentBatchId,
                    DateOfJoin: response.data.dateOfJoin,
                    BatchId: response.data.batchId,
                    RegistrationNumber: response.data.registrationNumber,
                    TokenNumber: response.data.tokenNumber,
                    StudentId: response.data.studentId,
                    IsActive: response.data.isActive,
                    CreatedAt: response.data.createdAt,
                    CreatedBy: response.data.createdBy,
                    LastUpdatedBy: user.userId
                })
            })
            .catch((err) => {
                console.error('Get StudentBatch Get By Id Error : ', err);
                Toast.show({
                    type: 'error',
                    text1: `${err}`,
                    position: 'bottom',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            })
    }

    const handleSaveStudentBatch = async () => {
        try {
            if (studentBatch.StudentBatchId !== 0) {
                await httpPost("StudentBatch/put", studentBatch)
                    .then((response) => {
                        if (response.status === 200) {
                            Alert.alert('Success', 'Update Batch Successfully')
                            setStudentBatch({
                                "StudentBatchId": 0,
                                "DateOfJoin": "",
                                "StudentId": studentId,
                                "BatchId": "",
                                "RegistrationNumber": "",
                                "TokenNumber": "",
                                "IsActive": true,
                                "CreatedAt": null,
                                "CreatedBy": user.userId,
                                "LastUpdatedBy": null,
                            })
                            navigation.goBack();
                        }
                    })
                    .catch((err) => {
                        console.error("Batch update error : ", err);
                        Toast.show({
                            type: 'error',
                            text1: `${err}`,
                            position: 'bottom',
                            visibilityTime: 2000,
                            autoHide: true,
                        });
                    });
            }
            else {
                console.log(studentBatch, "studentBatch")
                httpPost(`StudentBatch/IsExistsRegistration?RegistrationNumber=${studentBatch.RegistrationNumber}`)
                    .then((response) => {
                        if (response.data == true) {
                            Toast.show({
                                type: 'error',
                                text1: "This Registration Number is Already Exist",
                                position: 'bottom',
                                visibilityTime: 2000,
                                autoHide: true,
                            });
                        }
                        else {
                            httpPost(`StudentBatch/IsExistsToken?TokenNumber=${studentBatch.TokenNumber}`)
                                .then((response) => {
                                    if (response.data == true) {
                                        Toast.show({
                                            type: 'error',
                                            text1: "This Token Number is Already Exist",
                                            position: 'bottom',
                                            visibilityTime: 2000,
                                            autoHide: true,
                                        });
                                    }
                                    else {
                                        httpPost("StudentBatch/post", studentBatch).then((response) => {
                                            if (response.status === 200) {
                                                Alert.alert('Success', 'Add Batch Successfully')
                                                setStudentBatch({
                                                    "StudentBatchId": 0,
                                                    "DateOfJoin": "",
                                                    "StudentId": studentId,
                                                    "BatchId": "",
                                                    "RegistrationNumber": "",
                                                    "TokenNumber": "",
                                                    "IsActive": true,
                                                    "CreatedAt": null,
                                                    "CreatedBy": user.userId,
                                                    "LastUpdatedBy": null,
                                                })
                                                navigation.goBack();
                                            }
                                        }).catch((err) => {
                                            console.error('Batch Add error :', err);
                                            Toast.show({
                                                type: 'error',
                                                text1: `${err}`,
                                                position: 'bottom',
                                                visibilityTime: 2000,
                                                autoHide: true,
                                            });
                                        });
                                    }
                                }).catch((err) => {
                                    Toast.show({
                                        type: 'error',
                                        text1: `${err}`,
                                        position: 'bottom',
                                        visibilityTime: 2000,
                                        autoHide: true,
                                    });
                                })
                        }
                    }).catch((err) => {
                        Toast.show({
                            type: 'error',
                            text1: `${err}`,
                            position: 'bottom',
                            visibilityTime: 2000,
                            autoHide: true,
                        });
                    })
            }
        }
        catch (error) {
            console.error('Error saving Batch:', error);
            Toast.show({
                type: 'error',
                text1: `${error}`,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
            });
        }
    }

    const GetCourseCategoryList = () => {
        httpGet("CourseCategory/get")
            .then((response) => {
                console.log(response.data);
                setCourseCategoryList(response.data);
            })
            .catch((error) => {
                console.error(error, "Get CourseCategory List Error");
                Toast.show({
                    type: 'error',
                    text1: `${error}`,
                    position: 'bottom',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            });
    }

    const fetchCourseByCourseCategoryId = async (courseCategoryId) => {
        try {
            console.log(courseCategoryId, "courseCategoryId")
            const response = await httpGet(`Course/getCourseByCourseCategoryId?Id=${courseCategoryId}`)
            setCourseList(response.data);
        } catch (error) {
            console.error('Error fetching Course:', error);
            Toast.show({
                type: 'error',
                text1: `${error}`,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
            });
        }
    };

    const fetchBatchByCourseId = async (courseId) => {
        try {
            console.log(courseId, "courseCategoryId")
            const response = await httpGet(`Batch/getBatchByCourseId?Id=${courseId}`)
            setBatchList(response.data);
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
    const handleCourseCategorySelect = (courseCategory) => {
        setValue(courseCategory.courseCategoryId);
        fetchCourseByCourseCategoryId(courseCategory.courseCategoryId);
    };

    const handleCourseSelect = (course) => {
        setCourseValue(course.courseId);
        fetchBatchByCourseId(course.courseId);
    };

    const handleBatchSelect = (batch) => {
        setStudentBatch({ ...studentBatch, BatchId: batch.batchId })
        setBatchValue(batch.batchId)
    }

    const getFormattedDate = (datestring) => {
        const datetimeString = datestring;
        const date = new Date(datetimeString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    const handleCancel = () => {
        setStudentBatch({
            "StudentBatchId": 0,
            "DateOfJoin": "",
            "BatchFee": "",
            "StudentId": studentId,
            "BatchId": "",
            "RegistrationNumber": "",
            "TokenNumber": "",
            "IsActive": true,
            "CreatedAt": null,
            "CreatedBy": user.userId,
            "LastUpdatedBy": null,
        })
        navigation.goBack();
    }
    return (
        <View style={{ flex: 1, padding: 10, justifyContent: 'center' }}>
            <View style={{
                backgroundColor: Colors.background,
                borderRadius: 8,
                padding: 16,
                shadowColor: Colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
            }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, }}>Batch Form</Text>
                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Select Date Of Join:</Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderColor: Colors.primary,
                        borderRadius: 8,
                    }}>
                        <TouchableOpacity onPress={handleOpenDateOfJoinPicker}>
                            <Icon name={'calendar'} size={25} />
                        </TouchableOpacity>
                        <TextInput style={{ marginLeft: 10, fontSize: 16, color: Colors.secondary }}
                            value={studentBatch.DateOfJoin === "" || studentBatch.DateOfJoin === null ? ("Select Date Of Join") : (getFormattedDate(studentBatch.DateOfJoin))}
                            placeholder="Select Date Of Join"
                            editable={false}
                        />

                    </View>
                    {showDateOfJoinPicker && (
                        <DateTimePicker
                            value={selectDateOfJoin}
                            mode="date"
                            display="default"
                            onChange={handleDateOfJoinChange}
                            onConfirm={handleConfirmDateOfJoinPicker}
                            onCancel={handleConfirmDateOfJoinPicker}
                        />
                    )}

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Select Course Category :</Text>
                    <Dropdown
                        style={[{
                            height: 50,
                            borderColor: Colors.primary,
                            borderWidth: 1,
                            borderRadius: 10,
                            paddingHorizontal: 8,
                            marginBottom: 10,
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
                        data={courseCategoryList}
                        search
                        maxHeight={300}
                        labelField="courseCategoryName"
                        valueField="courseCategoryId"
                        placeholder={!isFocus ? 'Select Course Category' : '...'}
                        searchPlaceholder="Search..."
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={handleCourseCategorySelect}
                    />

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Select Course :</Text>
                    <Dropdown
                        style={[{
                            height: 50,
                            borderColor: Colors.primary,
                            borderWidth: 1,
                            borderRadius: 10,
                            paddingHorizontal: 8,
                            marginBottom: 10
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
                        data={courseList}
                        search
                        maxHeight={300}
                        labelField="courseName"
                        valueField="courseId"
                        placeholder={!isFocus ? 'Select Course' : '...'}
                        searchPlaceholder="Search..."
                        value={courseValue}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={handleCourseSelect}
                    />

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Select Batch :</Text>
                    <Dropdown
                        style={[{
                            height: 50,
                            borderColor: Colors.primary,
                            borderWidth: 1,
                            borderRadius: 10,
                            paddingHorizontal: 8,
                            marginBottom: 10
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
                        data={batchList}
                        search
                        maxHeight={300}
                        labelField="batchName"
                        valueField="batchId"
                        placeholder={!isFocus ? 'Select Batch' : '...'}
                        searchPlaceholder="Search..."
                        value={batchValue}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={handleBatchSelect}
                    />

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Registration Number :</Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: Colors.primary,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            marginBottom: 10,
                            fontSize: 16,
                        }}
                        value={studentBatch.RegistrationNumber}
                        onChangeText={(value) => setStudentBatch({ ...studentBatch, RegistrationNumber: value })}
                        placeholder="Enter Registeration Number"
                    />
                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Token Number :</Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: Colors.primary,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            marginBottom: 10,
                            fontSize: 16,
                        }}
                        value={studentBatch.TokenNumber}
                        keyboardType='numeric'
                        onChangeText={(value) => setStudentBatch({ ...studentBatch, TokenNumber: value })}
                        placeholder="Enter Token Number"
                    />

                    <TouchableOpacity style={{
                        backgroundColor: Colors.primary,
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                        alignItems: 'center',
                    }} onPress={handleSaveStudentBatch}>
                        <Text style={{ color: Colors.background, fontSize: 16, fontWeight: 'bold', }}>{studentBatch.StudentBatchId !== 0 ? "Save" : "Add"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        backgroundColor: '#f25252',
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                        alignItems: 'center',
                    }} onPress={handleCancel}>
                        <Text style={{ color: Colors.background, fontSize: 16, fontWeight: 'bold', }}>Cancel</Text>
                    </TouchableOpacity>
                </ScrollView>
                <Toast ref={(ref) => Toast.setRef(ref)} />
            </View>
        </View>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//     },
//     label: {
//         fontSize: 16,
//         marginBottom: 5,
//         color: Colors.secondary
//     },
//     card: {
//         backgroundColor: 'white',
//         borderRadius: 8,
//         padding: 16,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//         elevation: 2,
//     },
//     cardTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 16,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: Colors.primary,
//         borderRadius: 5,
//         paddingHorizontal: 10,
//         paddingVertical: 8,
//         marginBottom: 10,
//         fontSize: 16,
//     },
//     textArea: {
//         height: 80,
//         textAlignVertical: 'top',
//     },
//     dropdownContainer: {
//         borderWidth: 1,
//         borderColor: Colors.primary,
//         borderRadius: 5,
//         paddingHorizontal: 10,
//         paddingVertical: 8,
//         marginBottom: 10,
//         position: 'relative',
//         zIndex: 1,
//     },
//     dropdownText: {
//         fontSize: 16,
//     },
//     dropdown: {
//         position: 'absolute',
//         top: 40,
//         left: 0,
//         right: 0,
//         borderWidth: 1,
//         borderColor: Colors.primary,
//         backgroundColor: '#fff',
//         borderRadius: 5,
//         padding: 10,
//         marginTop: 5,
//     },
//     dropdownOption: {
//         paddingVertical: 8,
//     },
//     dropdownOptionText: {
//         fontSize: 16,
//     },
//     submitButton: {
//         backgroundColor: Colors.primary,
//         padding: 10,
//         borderRadius: 5,
//         marginTop: 10,
//         alignItems: 'center',
//     },
//     cancelButton: {
//         backgroundColor: '#f25252',
//         padding: 10,
//         borderRadius: 5,
//         marginTop: 10,
//         alignItems: 'center',
//     },
//     submitButtonText: {
//         color: Colors.background,
//         fontSize: 16,
//         fontWeight: 'bold',
//     }
// });

export default StudentBatchFormScreen;
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Colors from '../../../constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';

const StudentTokenFormScreen = ({ route, navigation }) => {

    const { tokenId, studentId, batchName } = route.params;
    const [studentToken, setStudentToken] = useState({
        "Id": 0,
        "ValidFrom": "",
        "ValidUpto": "",
        "TokenFee": "",
        "StudentId": studentId,
        "BatchId": "",
        "IsActive": true,
        "CreatedAt": null,
    });
    const [courseCategoryList, setCourseCategoryList] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [batchList, setBatchList] = useState([]);

    const [value, setValue] = useState(null);
    const [courseValue, setCourseValue] = useState(null);
    const [batchValue, setBatchValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [selectValidFrom, setSelectValidFrom] = useState(new Date());
    const [selectValidUpto, setSelectValidUpto] = useState(new Date());
    const [showValidFromPicker, setShowValidFromPicker] = useState(false);
    const [showValidUptoPicker, setShowValidUptoPicker] = useState(false);

    useEffect(() => {
        if (tokenId !== undefined) {
            GetTokenById();
        }
    }, [tokenId])

    useEffect(() => {
        if (courseCategoryList.length === 0) {
            GetCourseCategoryList();
        }
    }, []);

    const handleInputChange = (name, value) => {
        setStudentToken((prevStudentToken) => ({
            ...prevStudentToken,
            [name]: value,
        }));
    };

    const handleValidFromChange = (event, date) => {
        if (date !== undefined) {
            setSelectValidFrom(date);
            setStudentToken({ ...studentToken, ValidFrom: date })
        }
        setShowValidFromPicker(false);
    };

    const handleOpenValidFromPicker = () => {
        setShowValidFromPicker(true);
    };
    const handleConfirmValidFromPicker = () => {
        setShowValidFromPicker(false);
    };

    const handleValidUptoChange = (event, date) => {
        if (date !== undefined) {
            setSelectValidUpto(date);
            setStudentToken({ ...studentToken, ValidUpto: date })
        }
        setShowValidUptoPicker(false);
    };

    const handleOpenValidUptoPicker = () => {
        setShowValidUptoPicker(true);
    };
    const handleConfirmValidUptoPicker = () => {
        setShowValidUptoPicker(false);
    };

    const GetTokenById = () => {
        axios.get(`http://192.168.1.7:5291/api/StudentToken/getById?Id=${tokenId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response.data, "Get token By id")
                setStudentToken({
                    Id: response.data.id,
                    ValidFrom: response.data.validFrom,
                    ValidUpto: response.data.validUpto,
                    TokenFee: response.data.tokenFee,
                    BatchId: response.data.batchId,
                    StudentId: response.data.studentId,
                    IsActive: response.data.isActive,
                    CreatedAt: response.data.createdAt,
                })
            })
    }

    const handleSaveStudentToken = async () => {
        try {
            if (studentToken.Id !== 0) {
                await axios.put(`http://192.168.1.7:5291/api/StudentToken/put`, JSON.stringify(studentToken), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {
                        if (response.status === 200) {
                            Alert.alert('Success', 'Update Token Successfully')
                            setStudentToken({
                                "Id": 0,
                                "ValidFrom": "",
                                "ValidUpto": "",
                                "TokenFee": "",
                                "StudentId": studentId,
                                "BatchId": "",
                                "IsActive": true,
                                "CreatedAt": null,
                            })
                            navigation.goBack();
                        }
                    })
                    .catch(err => console.error("Token update error : ", err));
            }
            else {
                console.log(studentToken, "studentToken")
                await axios.post(`http://192.168.1.7:5291/api/StudentToken/post`, JSON.stringify(studentToken), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {
                        if (response.status === 200) {
                            Alert.alert('Success', 'Add Token Successfully')
                            setStudentToken({
                                "Id": 0,
                                "ValidFrom": "",
                                "ValidUpto": "",
                                "TokenFee": "",
                                "StudentId": studentId,
                                "BatchId": "",
                                "IsActive": true,
                                "CreatedAt": null,
                            })
                            navigation.navigate('HomeScreen')
                        }
                    })
                    .catch(err => console.error('Token Add error :', err));
            }
        }
        catch (error) {
            console.error('Error saving Token:', error);
        }
    }

    const GetCourseCategoryList = () => {
        axios.get('http://192.168.1.7:5291/api/CourseCategory/get', {
            headers: {
                'Content-Type': 'application/json', // Example header
                'User-Agent': 'react-native/0.64.2', // Example User-Agent header
            },
        })
            .then((response) => {
                console.log(response.data);
                setCourseCategoryList(response.data);
            })
            .catch((error) => {
                console.error(error, "Get CourseCategory List Error");
            });
    }

    const fetchCourseByCourseCategoryId = async (courseCategoryId) => {
        try {
            console.log(courseCategoryId, "courseCategoryId")
            const response = await axios.get(`http://192.168.1.7:5291/api/Course/getCourseByCourseCategoryId?Id=${courseCategoryId}`, {
                headers: {
                    'Content-Type': 'application/json', // Example header
                    'User-Agent': 'react-native/0.64.2', // Example User-Agent header
                },
            });
            setCourseList(response.data);
        } catch (error) {
            console.error('Error fetching Course:', error);
        }
    };

    const fetchBatchByCourseId = async (courseId) => {
        try {
            console.log(courseId, "courseCategoryId")
            const response = await axios.get(`http://192.168.1.7:5291/api/Batch/getBatchByCourseId?Id=${courseId}`, {
                headers: {
                    'Content-Type': 'application/json', // Example header
                    'User-Agent': 'react-native/0.64.2', // Example User-Agent header
                },
            });
            setBatchList(response.data);
        } catch (error) {
            console.error('Error fetching Batch:', error);
        }
    };
    const handleCourseCategorySelect = (courseCategory) => {
        setValue(courseCategory.id);
        fetchCourseByCourseCategoryId(courseCategory.id);
    };

    const handleCourseSelect = (course) => {
        setCourseValue(course.id);
        fetchBatchByCourseId(course.id);
    };

    const handleBatchSelect = (batch) => {
        setStudentToken({ ...studentToken, BatchId: batch.id })
        setBatchValue(batch.id)
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
        setStudentToken({
            "Id": 0,
            "ValidFrom": "",
            "ValidUpto": "",
            "TokenFee": "",
            "StudentId": studentId,
            "BatchId": "",
            "IsActive": true,
            "CreatedAt": null,
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
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, }}>Token Form</Text>
                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Valid From:</Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderColor: Colors.primary,
                        borderRadius: 8,
                    }}>
                        <TouchableOpacity onPress={handleOpenValidFromPicker}>
                            <Icon name={'calendar'} size={25} />
                        </TouchableOpacity>
                        <TextInput style={{ marginLeft: 10, fontSize: 16, color: Colors.secondary }}
                            value={studentToken.ValidFrom === "" || studentToken.ValidFrom === null ? ("Select Valid From") : (getFormattedDate(studentToken.ValidFrom))}
                            placeholder="Select Valid From"
                            editable={false}
                        />

                    </View>
                    {showValidFromPicker && (
                        <DateTimePicker
                            value={selectValidFrom}
                            mode="date"
                            display="default"
                            onChange={handleValidFromChange}
                            onConfirm={handleConfirmValidFromPicker}
                            onCancel={handleConfirmValidFromPicker}
                        />
                    )}

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Valid Upto:</Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderColor: Colors.primary,
                        borderRadius: 8,
                    }}>
                        <TouchableOpacity onPress={handleOpenValidUptoPicker}>
                            <Icon name={'calendar'} size={25} />
                        </TouchableOpacity>
                        <TextInput style={{ marginLeft: 10, fontSize: 16, color: Colors.secondary }}
                            value={studentToken.ValidUpto === "" || studentToken.ValidUpto === null ? ("Select Valid Upto") : (getFormattedDate(studentToken.ValidUpto))}
                            placeholder="Select Valid Upto"
                            editable={false}
                        />

                    </View>
                    {showValidUptoPicker && (
                        <DateTimePicker
                            value={selectValidUpto}
                            mode="date"
                            display="default"
                            onChange={handleValidUptoChange}
                            onConfirm={handleConfirmValidUptoPicker}
                            onCancel={handleConfirmValidUptoPicker}
                        />
                    )}

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Token Fee :</Text>
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
                        value={studentToken.TokenFee}
                        onChangeText={(value) => handleInputChange('TokenFee', value)}
                        placeholder="Enter Token Fee"
                        keyboardType="numeric"
                    />

                    {tokenId === undefined ?
                        <>
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
                                valueField="id"
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
                                valueField="id"
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
                                valueField="id"
                                placeholder={!isFocus ? 'Select Batch' : '...'}
                                searchPlaceholder="Search..."
                                value={batchValue}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={handleBatchSelect}
                            />
                        </> : <>
                        <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Batch Name :</Text>
                        <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: Colors.primary,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            marginBottom: 10,
                            fontSize: 16,
                            color: Colors.secondary
                        }}
                        editable={false}
                        value={batchName}
                    />
                    </>
                    }

                    <TouchableOpacity style={{
                        backgroundColor: Colors.primary,
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                        alignItems: 'center',
                    }} onPress={handleSaveStudentToken}>
                        <Text style={{ color: Colors.background, fontSize: 16, fontWeight: 'bold', }}>{studentToken.Id !== 0 ? "Save" : "Add"}</Text>
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

export default StudentTokenFormScreen;
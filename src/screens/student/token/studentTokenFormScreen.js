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

const StudentTokenFormScreen = ({ route, navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const { tokenId, studentId, batchName } = route.params;
    const [studentToken, setStudentToken] = useState({
        "StudentTokenId": 0,
        "ValidFrom": "",
        "ValidUpto": "",
        "TokenFee": "",
        "StudentId": studentId,
        "BatchId": "",
        "IsActive": true,
        "CreatedAt": null,
        "CreatedBy": user.userId,
        "LastUpdatedBy": null,
        "IsValidForAdmissionNonMapped": "false",
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
    const [showValidAdmissionDropdown, setshowValidAdmissionDropdown] = useState(false);
    const toggleValidAdmissionDropdown = () => {
        setshowValidAdmissionDropdown(!showValidAdmissionDropdown);
    };

    const selectValidAdmission = (selectedValidAdmission) => {
        setStudentToken((prevFormData) => ({
            ...prevFormData,
            IsValidForAdmissionNonMapped: selectedValidAdmission,
        }));
        setshowValidAdmissionDropdown(false);
    };

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
        httpGet(`StudentToken/getById?Id=${tokenId}`)
            .then((response) => {
                console.log(response.data, "Get token By id")
                setStudentToken({
                    StudentTokenId: response.data.studentTokenId,
                    ValidFrom: response.data.validFrom,
                    ValidUpto: response.data.validUpto,
                    TokenFee: response.data.tokenFee,
                    BatchId: response.data.batchId,
                    StudentId: response.data.studentId,
                    IsActive: response.data.isActive,
                    CreatedAt: response.data.createdAt,
                    CreatedBy: response.data.createdBy,
                    LastUpdatedBy: user.userId,
                    IsValidForAdmissionNonMapped: response.data.isValidForAdmissionNonMapped,
                })
            })
            .catch((err) => {
                console.error('Get Student Token Get By Id : ', err);
                Toast.show({
                    type: 'error',
                    text1: `${err}`,
                    position: 'bottom',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            })
    }

    const handleSaveStudentToken = async () => {
        try {
            if (studentToken.StudentTokenId !== 0) {
                await httpPost("StudentToken/put", studentToken)
                    .then((response) => {
                        if (response.status === 200) {
                            Alert.alert('Success', 'Update Token Successfully')
                            setStudentToken({
                                "StudentTokenId": 0,
                                "ValidFrom": "",
                                "ValidUpto": "",
                                "TokenFee": "",
                                "StudentId": studentId,
                                "BatchId": "",
                                "IsActive": true,
                                "CreatedAt": null,
                                "CreatedBy": user.userId,
                                "LastUpdatedBy": null,
                                "IsValidForAdmissionNonMapped": "false",
                            })
                            navigation.goBack();
                        }
                    })
                    .catch((err) => {
                        console.error("Token update error : ", err);
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
                console.log(studentToken, "studentToken")
                await httpPost("StudentToken/post", studentToken)
                    .then((response) => {
                        if (response.status === 200) {
                            Alert.alert('Success', 'Add Token Successfully')
                            setStudentToken({
                                "StudentTokenId": 0,
                                "ValidFrom": "",
                                "ValidUpto": "",
                                "TokenFee": "",
                                "StudentId": studentId,
                                "BatchId": "",
                                "IsActive": true,
                                "CreatedAt": null,
                                "CreatedBy": user.userId,
                                "LastUpdatedBy": null,
                                "IsValidForAdmissionNonMapped": "false",
                            })
                            navigation.goBack();
                        }
                    })
                    .catch((err) => {
                        console.error('Token Add error :', err);
                        Toast.show({
                            type: 'error',
                            text1: `${err}`,
                            position: 'bottom',
                            visibilityTime: 2000,
                            autoHide: true,
                        });
                    });
            }
        }
        catch (error) {
            console.error('Error saving Token:', error);
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
                console.error(error, "Get CourseCategory List Error", error);
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
        setStudentToken({ ...studentToken, BatchId: batch.batchId })
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
        setStudentToken({
            "StudentTokenId": 0,
            "ValidFrom": "",
            "ValidUpto": "",
            "TokenFee": "",
            "StudentId": studentId,
            "BatchId": "",
            "IsActive": true,
            "CreatedAt": null,
            "CreatedBy": user.userId,
            "LastUpdatedBy": null,
            "IsValidForAdmissionNonMapped": "false",
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
                        value={studentToken.TokenFee.toString()}
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
                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Is Valid For Admission :</Text>
                    <TouchableOpacity
                        style={{
                            borderWidth: 1,
                            borderColor: Colors.primary,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            marginBottom: 10,
                            position: 'relative',
                            zIndex: 1,
                        }}
                        onPress={toggleValidAdmissionDropdown}
                    >
                        <Text style={{ fontSize: 16, }}>{studentToken.IsValidForAdmissionNonMapped || 'Select Valid'}</Text>
                        {showValidAdmissionDropdown && (
                            <View style={{
                                position: 'absolute',
                                top: 40,
                                left: 0,
                                right: 0,
                                borderWidth: 1,
                                borderColor: Colors.primary,
                                backgroundColor: Colors.background,
                                borderRadius: 5,
                                padding: 10,
                                marginTop: 5,
                            }}>
                                <TouchableOpacity
                                    style={{ paddingVertical: 8, }}
                                    onPress={() => selectValidAdmission("true")}
                                >
                                    <Text style={{ fontSize: 16, }}>True</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ paddingVertical: 8, }}
                                    onPress={() => selectValidAdmission("false")}
                                >
                                    <Text style={{ fontSize: 16, }}>False</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        backgroundColor: Colors.primary,
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                        alignItems: 'center',
                    }} onPress={handleSaveStudentToken}>
                        <Text style={{ color: Colors.background, fontSize: 16, fontWeight: 'bold', }}>{studentToken.StudentTokenId !== 0 ? "Save" : "Add"}</Text>
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

export default StudentTokenFormScreen;
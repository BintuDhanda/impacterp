import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Colors from '../../../constants/Colors';
import Toast from 'react-native-toast-message';
import { Dropdown } from 'react-native-element-dropdown';
import { UserContext } from '../../../../App';
import { useContext } from 'react';
import { Get as httpGet, Post as httpPost } from '../../../constants/httpService';
import ShowError from '../../../constants/ShowError';

const StudentQualificationFormScreen = ({ route, navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const { qualificationId, studentId } = route.params;
    const [studentQualification, setStudentQualification] = useState({
        "StudentQualificationId": 0,
        "QualificationId": "",
        "Subject": "",
        "MaximumMark": "",
        "MarksObtain": "",
        "Percentage": "",
        "Grade": "",
        "StudentId": studentId,
        "IsActive": true,
        "CreatedAt": null,
        "CreatedBy": user.userId,
        "LastUpdatedBy": null,
    });
    const [qualificationList, setQualificationList] = useState([]);

    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        if (qualificationList.length === 0) {
            GetQualificationList();
        }
    }, [])

    useEffect(() => {
        if (qualificationId !== undefined) {
            GetQualificationById();
        }
    }, [qualificationId])

    const handleInputChange = (name, value) => {
        setStudentQualification((prevStudentQualification) => ({
            ...prevStudentQualification,
            [name]: value,
        }));
    };

    const GetQualificationById = () => {
        httpGet(`StudentQualification/getById?Id=${qualificationId}`)
            .then((response) => {
                setStudentQualification({
                    StudentQualificationId: response.data.studentQualificationId,
                    QualificationId: response.data.qualificationId,
                    Subject: response.data.subject,
                    MaximumMark: response.data.maximumMark,
                    MarksObtain: response.data.marksObtain,
                    Percentage: response.data.percentage,
                    Grade: response.data.grade,
                    StudentId: response.data.studentId,
                    IsActive: response.data.isActive,
                    CreatedAt: response.data.createdAt,
                    CreatedBy: response.data.createdBy,
                    LastUpdatedBy: user.userId,
                })
            })
            .catch((err) => {
                console.error('Get Student Qualification Get By Id : ', err);
                Toast.show({
                    type: 'error',
                    text1: `${err}`,
                    position: 'bottom',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            })
    }

    const GetQualificationList = () => {
        httpGet("Qualification/get")
            .then((response) => {
                console.log(response.data);
                setQualificationList(response.data);
            })
            .catch((error) => {
                console.error(error, "Get Qualification List Error");
                Toast.show({
                    type: 'error',
                    text1: `${error}`,
                    position: 'bottom',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            });
    }

    const handleSaveStudentQualification = async () => {
        if(IsFormValid()){try {
            if (studentQualification.StudentQualificationId !== 0) {
                await httpPost("StudentQualification/put", studentQualification)
                    .then((response) => {
                        if (response.status === 200) {
                            Alert.alert('Success', 'Update Qualification Successfully')
                            setStudentQualification({
                                "StudentQualificationId": 0,
                                "QualificationId": "",
                                "Subject": "",
                                "MaximumMark": "",
                                "MarksObtain": "",
                                "Percentage": "",
                                "Grade": "",
                                "StudentId": studentId,
                                "IsActive": true,
                                "CreatedAt": null,
                                "CreatedBy": user.userId,
                                "LastUpdatedBy": null,
                            })
                            navigation.goBack();
                        }
                    })
                    .catch((err) => {
                        console.error("Qualification update error : ", err);
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
                console.log(studentQualification, "studentQualification")
                await httpPost("StudentQualification/post", studentQualification)
                    .then((response) => {
                        if (response.status === 200) {
                            Alert.alert('Success', 'Add Qualification Successfully')
                            setStudentQualification({
                                "StudentQualificationId": 0,
                                "QualificationId": "",
                                "Subject": "",
                                "MaximumMark": "",
                                "MarksObtain": "",
                                "Percentage": "",
                                "Grade": "",
                                "StudentId": studentId,
                                "IsActive": true,
                                "CreatedAt": null,
                                "CreatedBy": user.userId,
                                "LastUpdatedBy": null,
                            })
                            navigation.goBack();
                        }
                    })
                    .catch((err) => {
                        console.error('Qualification Add error :', err);
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
            console.error('Error saving Qualification:', error);
            Toast.show({
                type: 'error',
                text1: `${error}`,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
            });
        }}
    }

    const handleCancel = () => {
        setStudentQualification({
            "StudentQualificationId": 0,
            "QualificationId": "",
            "Subject": "",
            "MaximumMark": "",
            "MarksObtain": "",
            "Percentage": "",
            "Grade": "",
            "StudentId": studentId,
            "IsActive": true,
            "CreatedAt": null,
            "CreatedBy": user.userId,
            "LastUpdatedBy": null,
        })
        navigation.goBack();
    }
    const IsFormValid=()=>{
        if(studentQualification.QualificationId.length==0)
        {
           ShowError("Select Qualification");
           return false;
        }
        if(studentQualification.Subject.length==0){
           ShowError("Enter Valid Subject");
           return false;
        }
        if(studentQualification.MaximumMark.length==0)
        {
           ShowError("Enter Valid Maximum Mark")
           return false;
        }
        if(studentQualification.MarksObtain.length==0)
        {
           ShowError("Enter Valid Marks Obtain")
           return false;
        }
        if(studentQualification.Percentage.length==0)
        {
           ShowError("Enter a Valid Percentage")
           return false;
        }
    
        if(studentQualification.Grade.length==0)
        {
           ShowError("Enter a Valid Grade")
           return false;
        }
    
        return true;
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
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, }}>Qualification Form</Text>
                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Qualification:</Text>
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
                        data={qualificationList}
                        search
                        maxHeight={300}
                        labelField="qualificationName"
                        valueField="qualificationId"
                        placeholder={!isFocus ? 'Select Qualification' : '...'}
                        searchPlaceholder="Search..."
                        value={studentQualification.QualificationId}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={(value) => setStudentQualification({ ...studentQualification, QualificationId: value.qualificationId })}
                    />

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Subject :</Text>
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
                        value={studentQualification.Subject}
                        onChangeText={(value) => handleInputChange('Subject', value)}
                        placeholder="Enter Subject"
                    />

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Maximum Marks :</Text>
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
                        value={studentQualification.MaximumMark.toString()}
                        onChangeText={(value) => setStudentQualification({ ...studentQualification, MaximumMark: isNaN(parseInt(value)) ? "" : parseInt(value) })}
                        placeholder="Enter Maximum Mark"
                        keyboardType="numeric"
                    />
                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Marks Obtain :</Text>
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
                        value={studentQualification.MarksObtain.toString()}
                        onChangeText={(value) => setStudentQualification({ ...studentQualification, MarksObtain: isNaN(parseInt(value)) ? "" : parseInt(value) })}
                        placeholder="Enter MarksObtain"
                        keyboardType="numeric"
                    />
                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Percentage :</Text>
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
                        value={studentQualification.Percentage.toString()}
                        onChangeText={(value) => setStudentQualification({ ...studentQualification, Percentage: isNaN(parseInt(value)) ? "" : parseInt(value) })}
                        placeholder="Enter Percentage"
                        keyboardType="numeric"
                    />
                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Grade :</Text>
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
                        value={studentQualification.Grade}
                        onChangeText={(value) => handleInputChange('Grade', value)}
                        placeholder="Enter Grade"
                    />

                    <TouchableOpacity style={{
                        backgroundColor: Colors.primary,
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                        alignItems: 'center',
                    }} onPress={handleSaveStudentQualification}>
                        <Text style={{ color: Colors.background, fontSize: 16, fontWeight: 'bold', }}>{studentQualification.StudentQualificationId !== 0 ? "Save" : "Add"}</Text>
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

export default StudentQualificationFormScreen;
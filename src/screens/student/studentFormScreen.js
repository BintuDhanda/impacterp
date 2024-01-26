import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import Colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import { UserContext } from '../../../App';
import { useContext } from 'react';
import ImageCropPicker from 'react-native-image-crop-picker';
import { Get as httpGet, Post as httpPost, PostformData as PostForm } from '../../constants/httpService';
import { News_URL } from '../../constants/constant';
import ShowError from '../../constants/ShowError';

const StudentFormScreen = ({ route, navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const { userId, studentId } = route.params;
    const [image, setImage] = useState(null);
    const [type, setType] = useState(null);
    console.log(studentId == undefined ? 0 : studentId, "studentId")
    const [formData, setFormData] = useState({
        "StudentId": studentId == undefined ? 0 : studentId,
        "StudentImage": "",
        "FirstName": "",
        "LastName": "",
        "FatherName": "",
        "MotherName": "",
        "Gender": "",
        "StudentHeight": "",
        "StudentWeight": "",
        "BodyRemark": "",
        "UserId": userId,
        "IsActive": true,
        "CreatedAt": null,
        "CreatedBy": user.userId,
        "LastUpdatedBy": user.userId,
    });

    console.log(formData, "Formdata")

    const takePhotoFromCamera = () => {
        ImageCropPicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => { setImage(image.path); setType(image.mime); })
    }
    const selectPhotoFromGallery = () => {
        ImageCropPicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => { setImage(image.path); setType(image.mime); })
    }

    useEffect(() => {
        if (formData.StudentId !== 0) {
            handleEditStudentDetails();
        }
    }, [])

    const handleInputChange = (name, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const toggleGenderDropdown = () => {
        setShowGenderDropdown(!showGenderDropdown);
    };

    const selectGender = (selectedGender) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            Gender: selectedGender,
        }));
        setShowGenderDropdown(false);
    };

    const handleEditStudentDetails = () => {
        httpGet(`StudentDetails/getById?Id=${studentId}`)
            .then((result) => {
                console.log(result.data, "studentDetailsById");
                setFormData(
                    {
                        StudentId: result.data.studentId,
                        Image: result.data.image,
                        FirstName: result.data.firstName,
                        LastName: result.data.lastName,
                        FatherName: result.data.fatherName,
                        MotherName: result.data.motherName,
                        Gender: result.data.gender,
                        StudentHeight: result.data.studentHeight.toString(),
                        StudentWeight: result.data.studentWeight.toString(),
                        BodyRemark: result.data.bodyRemark,
                        UserId: result.data.userId,
                        IsActive: result.data.isActive,
                        CreatedAt: result.data.createdAt,
                        CreatedBy: result.data.createdBy,
                        LastUpdatedBy: user.userId,
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
    };

    const handleSaveStudentDetails = async () => {
        if(IsFormValid())
       {
        try {
            console.log("student form studentid", formData.studentId);
            if (formData.StudentId !== 0) {
                console.log(JSON.stringify(formData), "Form data request")
                const student = new FormData();
                student.append('StudentId', formData.StudentId);              
                student.append('FirstName', formData.FirstName);
                student.append('LastName', formData.LastName);
                student.append('FatherName', formData.FatherName);
                student.append('MotherName', formData.MotherName);
                student.append('Gender', formData.Gender);
                student.append('StudentHeight', formData.StudentHeight);
                student.append('StudentWeight', formData.StudentWeight);
                student.append('BodyRemark', formData.BodyRemark);
                student.append('UserId', formData.UserId);
                student.append('IsActive', formData.IsActive);
                student.append('CreatedAt', formData.CreatedAt);
                student.append('CreatedBy', formData.CreatedBy);
                student.append('LastUpdatedBy', formData.LastUpdatedBy);
                if (image) {
                    const imageUriParts = image.split('/');
                    const imageName = imageUriParts[imageUriParts.length - 1];
                    console.log(imageName, "Get Image Name")
                    const imageFile = {
                        uri: image,
                        type: type, // Adjust the type according to your image
                        name: imageName, // Adjust the file name if needed
                    };
                    student.append('StudentImage', imageFile);
                }
                else{
                    student.append('StudentImage', "");
                }
                await PostForm("StudentDetails/put", student)
                    .then((response) => {
                        if (response.status === 200) {
                            Alert.alert('Success', 'Update Student Successfully')
                            setFormData({
                                "StudentId": 0,
                                "StudentImage": "",
                                "FirstName": "",
                                "LastName": "",
                                "FatherName": "",
                                "MotherName": "",
                                "Gender": "",
                                "StudentHeight": "",
                                "StudentWeight": "",
                                "BodyRemark": "",
                                "UserId": userId,
                                "IsActive": true,
                                "CreatedAt": null,
                                "CreatedBy": user.userId,
                                "LastUpdatedBy": user.userId,
                            })
                            navigation.navigate('HomeScreen');
                        }
                    })
                    .catch((err) => {
                        console.error("Student Details update error : ", err);
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
                const student = new FormData();
                student.append('StudentId', formData.StudentId);
                student.append('StudentImage', "");
                student.append('FirstName', formData.FirstName);
                student.append('LastName', formData.LastName);
                student.append('FatherName', formData.FatherName);
                student.append('MotherName', formData.MotherName);
                student.append('Gender', formData.Gender);
                student.append('StudentHeight', formData.StudentHeight);
                student.append('StudentWeight', formData.StudentWeight);
                student.append('BodyRemark', formData.BodyRemark);
                student.append('UserId', formData.UserId);
                student.append('IsActive', formData.IsActive);
                student.append('CreatedAt', formData.CreatedAt);
                student.append('CreatedBy', formData.CreatedBy);
                student.append('LastUpdatedBy', formData.LastUpdatedBy);
                if (image) {
                    const imageUriParts = image.split('/');
                    const imageName = imageUriParts[imageUriParts.length - 1];
                    console.log(imageName, "Get Image Name")
                    const imageFile = {
                        uri: image,
                        type: type, // Adjust the type according to your image
                        name: imageName, // Adjust the file name if needed
                    };
                    student.append('StudentImage', imageFile);
                }
                await PostForm("StudentDetails/post", student)
                    .then((response) => {
                        if (response.status === 200) {
                            response.data.message == null || response.data.message == "" ?
                                Alert.alert('Success', response.data.message) :
                                Alert.alert('Exists', response.data.message);
                            setFormData({
                                "StudentId": 0,
                                "StudentImage": "",
                                "FirstName": "",
                                "LastName": "",
                                "FatherName": "",
                                "MotherName": "",
                                "Gender": "",
                                "StudentHeight": "",
                                "StudentWeight": "",
                                "BodyRemark": "",
                                "UserId": userId,
                                "IsActive": true,
                                "CreatedAt": null,
                                "CreatedBy": user.userId,
                                "LastUpdatedBy": user.userId,
                            })
                            navigation.navigate('HomeScreen')
                        }
                    })
                    .catch((err) => {
                        console.error('Student Details Add error :', err);
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
            console.error('Error saving Student Detail:', error);
            Toast.show({
                type: 'error',
                text1: `${error}`,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
            });
        }
       }
    }

    const handleCancel = () => {
        navigation.navigate('HomeScreen');
    }

    const IsFormValid=()=>{
     let studentForm = formData;
     
     if (!studentForm.FirstName || studentForm.FirstName.length === 0) {
        ShowError("Enter a Valid Student Name");
        return false;
      }
    
      if (!studentForm.FatherName || studentForm.FatherName.length === 0) {
        ShowError("Enter Valid Father Name");
        return false;
      }
    
      if (!studentForm.Gender || studentForm.Gender.length === 0) {
        ShowError("Select Gender");
        return false;
      }
    
      if (!studentForm.MotherName || studentForm.MotherName.length === 0) {
        ShowError("Enter Valid Mother Name");
        return false;
      }
    
      if (!studentForm.StudentHeight || studentForm.StudentHeight.length === 0) {
        ShowError("Enter a Valid Height");
        return false;
      }
    
      if (!studentForm.StudentWeight || studentForm.StudentWeight.length === 0) {
        ShowError("Enter a Valid Weight");
        return false;
      }
    
      if (!studentForm.BodyRemark || studentForm.BodyRemark.length === 0) {
        ShowError("Enter a Valid Body Remark");
        return false;
      }

     return true;
    }

    return (
        <View style={{ flex: 1 }}>
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
                    <View style={{ flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between' }}>
                        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, borderRadius: 10 }} />}
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{ justifyContent: 'flex-end' }} onPress={takePhotoFromCamera}>
                                <Icon name="camera" size={30} color={'#f25252'} style={{ marginRight: 8, textAlignVertical: 'center' }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ justifyContent: 'flex-end' }} onPress={selectPhotoFromGallery}>
                                <Icon name="image" size={30} color={'#f25252'} style={{ marginRight: 8, textAlignVertical: 'center' }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Image
                        source={formData.StudentImage == null || formData.StudentImage == "" ? require('../../icons/user.png') : { uri: News_URL + formData.StudentImage }}
                        style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
                    />
                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>First Name:</Text>
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
                        value={formData.FirstName}
                        onChangeText={(value) => handleInputChange('FirstName', value)}
                        placeholder="Enter first name"
                    />

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Last Name:</Text>
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
                        value={formData.LastName}
                        onChangeText={(value) => handleInputChange('LastName', value)}
                        placeholder="Enter last name"
                    />

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Father Name:</Text>
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
                        value={formData.FatherName}
                        onChangeText={(value) => handleInputChange('FatherName', value)}
                        placeholder="Enter father name"
                    />

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Mother Name:</Text>
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
                        value={formData.MotherName}
                        onChangeText={(value) => handleInputChange('MotherName', value)}
                        placeholder="Enter mother name"
                    />

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Gender:</Text>
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
                        onPress={toggleGenderDropdown}
                    >
                        <Text style={{ fontSize: 16, }}>{formData.Gender || 'Select gender'}</Text>
                        {showGenderDropdown && (
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
                                    onPress={() => selectGender('Male')}
                                >
                                    <Text style={{ fontSize: 16, }}>Male</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ paddingVertical: 8, }}
                                    onPress={() => selectGender('Female')}
                                >
                                    <Text style={{ fontSize: 16, }}>Female</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ paddingVertical: 8, }}
                                    onPress={() => selectGender('Other')}
                                >
                                    <Text style={{ fontSize: 16, }}>Other</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </TouchableOpacity>

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Height (inch):</Text>
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
                        value={formData.StudentHeight}
                        onChangeText={(value) => setFormData({ ...formData, StudentHeight: value })}
                        placeholder="Enter height"
                        keyboardType="numeric"
                    />

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Weight (Kg):</Text>
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
                        value={formData.StudentWeight}
                        onChangeText={(value) => setFormData({ ...formData, StudentWeight: value })}
                        placeholder="Enter weight"
                        keyboardType="numeric"
                    />

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Body Remarks:</Text>
                    <TextInput
                        style={[{
                            borderWidth: 1,
                            borderColor: Colors.primary,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            marginBottom: 10,
                            fontSize: 16,
                        }, { height: 80, textAlignVertical: 'top', }]}
                        value={formData.BodyRemark}
                        onChangeText={(value) => handleInputChange('BodyRemark', value)}
                        placeholder="Enter body remarks"
                        multiline
                    />
                    <TouchableOpacity style={{
                        backgroundColor: Colors.primary,
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                        alignItems: 'center',
                    }} onPress={handleSaveStudentDetails}>
                        <Text style={{ color: Colors.background, fontSize: 16, fontWeight: 'bold', }}>{formData.Id !== 0 ? "Save" : "Add"}</Text>
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

export default StudentFormScreen;
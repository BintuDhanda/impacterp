import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Colors from '../../constants/Colors';

const StudentFormScreen = ({route, navigation }) => {

    const {userId} = route.params;
    const [formData, setFormData] = useState({
        "Id": 0,
        "FirstName": "",
        "LastName": "",
        "FatherName": "",
        "MotherName": "",
        "Gender": "",
        "StudentHeight": "",
        "StudentWeight": "",
        "BodyRemarks": "",
        "UserId": userId,
        "IsActive": true,
    });
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

    const handleSaveStudentDetails = () => {
        try {
            if (formData.Id !== 0) {
                axios.put(`http://192.168.1.7:5291/api/StudentDetails/put`, JSON.stringify(formData), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {
                        if (response.status === 200) {
                            Alert.alert('Success', 'Update Student Successfully')
                            setUser({
                                "Id": 0,
                                "FirstName": "",
                                "LastName": "",
                                "FatherName": "",
                                "MotherName": "",
                                "Gender": "",
                                "StudentHeight": "",
                                "StudentWeight": "",
                                "BodyRemarks": "",
                                "UserId": userId,
                                "IsActive": true,
                            })
                            navigation.goBack();
                        }
                    })
                    .catch(err => console.error("Student Details update error : ", err));
            }
            else {
                axios.post(`http://192.168.1.7:5291/api/StudentDetails/post`, JSON.stringify(user), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {
                        if (response.status === 200) {
                            GetUserList();
                            Alert.alert('Success', 'Add Student Details Successfully')
                            setUser({
                                "Id": 0,
                                "FirstName": "",
                                "LastName": "",
                                "FatherName": "",
                                "MotherName": "",
                                "Gender": "",
                                "StudentHeight": "",
                                "StudentWeight": "",
                                "BodyRemarks": "",
                                "UserId": userId,
                                "IsActive": true,
                            })
                            navigation.navigate('StudentDetailsScreen')
                        }
                    })
                    .catch(err => console.error('Student Details Add error :', err));
            }
        }
        catch (error) {
            console.error('Error saving Student Detail:', error);
        }
    }

    const handleCancel = () => {
        navigation.goBack();
    }
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <Text style={styles.cardTitle}>Student Form</Text>
                    <Text style={styles.label}>First Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.FirstName}
                        onChangeText={(value) => handleInputChange('FirstName', value)}
                        placeholder="Enter first name"
                    />

                    <Text style={styles.label}>Last Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.LastName}
                        onChangeText={(value) =>  handleInputChange('LastName', value )}
                        placeholder="Enter last name"
                    />

                    <Text style={styles.label}>Father Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.FatherName}
                        onChangeText={(value) => handleInputChange('FatherName', value)}
                        placeholder="Enter father name"
                    />

                    <Text style={styles.label}>Mother Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.MotherName}
                        onChangeText={(value) => handleInputChange('MotherName', value)}
                        placeholder="Enter mother name"
                    />

                    <Text style={styles.label}>Gender:</Text>
                    <TouchableOpacity
                        style={styles.dropdownContainer}
                        onPress={toggleGenderDropdown}
                    >
                        <Text style={styles.dropdownText}>{formData.Gender || 'Select gender'}</Text>
                        {showGenderDropdown && (
                            <View style={styles.dropdown}>
                                <TouchableOpacity
                                    style={styles.dropdownOption}
                                    onPress={() => selectGender('Male')}
                                >
                                    <Text style={styles.dropdownOptionText}>Male</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.dropdownOption}
                                    onPress={() => selectGender('Female')}
                                >
                                    <Text style={styles.dropdownOptionText}>Female</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.label}>Height:</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.StudentHeight}
                        onChangeText={(value) => { 'Height', value }}
                        placeholder="Enter height"
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Weight:</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.StudentWeight}
                        onChangeText={(value) => { 'Weight', value }}
                        placeholder="Enter weight"
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Body Remarks:</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.BodyRemarks}
                        onChangeText={(value) => { 'BodyRemarks', value }}
                        placeholder="Enter body remarks"
                        multiline
                    />
                    <TouchableOpacity style={styles.submitButton} onPress={handleSaveStudentDetails}>
                        <Text style={styles.submitButtonText}>{formData.Id !== 0 ? "Save" : "Add"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                        <Text style={styles.submitButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: 'black'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
        fontSize: 16,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
        position: 'relative',
        zIndex: 1,
    },
    dropdownText: {
        fontSize: 16,
    },
    dropdown: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        borderWidth: 1,
        borderColor: Colors.primary,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
    },
    dropdownOption: {
        paddingVertical: 8,
    },
    dropdownOptionText: {
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default StudentFormScreen;
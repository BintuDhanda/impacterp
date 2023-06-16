import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Colors from '../../constants/Colors';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';

const StudentAddressScreen = ({ route, navigation }) => {

    const { studentDetailsId, studentId } = route.params;
    console.log(studentId == undefined ? 0 : studentId, "studentId")
    const [studentAddress, setStudentAddress] = useState({
        "Id": studentId == undefined ? 0 : studentId,
        "AddressTypeId": "",
        "Address": "",
        "CountryId": "",
        "StateId": "",
        "CityId": "",
        "Pincode": "",
        "StudentDetailsId": studentDetailsId,
        "IsActive": true,
    });
    const [addressTypeList, setAddressTypeList] = useState([]);
    const [isFocus, setIsFocus] = useState(false);

    console.log(studentAddress, "StudentAddress")
    useEffect(() => {
        if (studentAddress.Id !== 0) {
            handleEditStudentDetails();
        }
    }, [])

    useEffect(() => {
        if (addressTypeList.length === 0) {
            GetAddressTypeList();
        }
    }, [])

    const handleInputChange = (name, value) => {
        setStudentAddress((prevStudentAddress) => ({
            ...prevStudentAddress,
            [name]: value,
        }));
    };

    const GetAddressTypeList = () => {
        axios.get('http://192.168.1.7:5291/api/AddressType/get', {
            headers: {
                'Content-Type': 'application/json', // Example header
                'User-Agent': 'react-native/0.64.2', // Example User-Agent header
            },
        })
            .then((response) => {
                console.log(response.data);
                const AddressTypeArray = response.data.map((addressType) => ({
                    value: addressType.id,
                    label: addressType.addressTypeName,
                }));
                setAddressTypeList(AddressTypeArray);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const GetCountryList = () => {
        axios.get('http://192.168.1.7:5291/api/Country/get', {
            headers: {
                'Content-Type': 'application/json', // Example header
                'User-Agent': 'react-native/0.64.2', // Example User-Agent header
            },
        })
            .then((response) => {
                console.log(response.data);
                const CountryArray = response.data.map((country) => ({
                    value: country.id,
                    label: country.addressTypeName,
                }));
                setAddressTypeList(CountryArray);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleEditStudentDetails = () => {
        axios.get(`http://192.168.1.7:5291/api/StudentDetails/getById?Id=${studentId}`)
            .then((result) => {
                console.log(result.data, "studentDetailsById");
                setStudentAddress(
                    {
                        Id: result.data.id,
                        AddressTypeId: result.data.addressTypeId,
                        Address: result.data.address,
                        CountryId: result.data.countryId,
                        StateId: result.data.stateId,
                        CityId: result.data.cityId,
                        Pincode: result.data.pincode,
                        StudentDetailsId: result.data.studentDetailsId,
                        IsActive: result.data.isActive
                    }
                );
            })
            .catch(err => console.error("Get By Id Error", err));
    };

    const handleSaveStudentDetails = async () => {
        try {
            if (studentAddress.Id !== 0) {
                console.log(JSON.stringify(studentAddress), "Form data request")
                await axios.put(`http://192.168.1.7:5291/api/StudentDetails/put`, JSON.stringify(studentAddress), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {
                        if (response.status === 200) {
                            Alert.alert('Success', 'Update Student Successfully')
                            setStudentAddress({
                                "Id": 0,
                                "AddressTypeId": "",
                                "Address": "",
                                "CountryId": "",
                                "StateId": "",
                                "CityId": "",
                                "Pincode": "",
                                "StudentDetailsId": studentDetailsId,
                                "IsActive": true,
                            })
                            navigation.goBack();
                        }
                    })
                    .catch(err => console.error("Student Details update error : ", err));
            }
            else {
                await axios.post(`http://192.168.1.7:5291/api/StudentDetails/post`, JSON.stringify(studentAddress), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {
                        if (response.status === 200) {
                            Alert.alert('Success', 'Add Student Details Successfully')
                            setUser({
                                "Id": 0,
                                "AddressTypeId": "",
                                "Address": "",
                                "CountryId": "",
                                "StateId": "",
                                "CityId": "",
                                "Pincode": "",
                                "StudentDetailsId": studentDetailsId,
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
        <View style={{ flex: 1, padding: 10, }}>
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
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, }}>Student Address</Text>
                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Address Type:</Text>
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
                        data={addressTypeList}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Select Address Type' : '...'}
                        searchPlaceholder="Search..."
                        value={studentAddress.AddressTypeId}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={(value) => setStudentAddress({ ...studentAddress, AddressTypeId: value.value })}
                    />

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Address:</Text>
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
                        value={studentAddress.Address}
                        onChangeText={(value) => handleInputChange('Address', value)}
                        placeholder="Enter Address"
                        multiline
                    />

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Country:</Text>
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
                        value={studentAddress.CountryId}
                        onChangeText={(value) => handleInputChange('CountryId', value)}
                        placeholder="Enter Country"
                    />

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>State:</Text>
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
                        value={studentAddress.StateId}
                        onChangeText={(value) => handleInputChange('StateId', value)}
                        placeholder="Enter State"
                    />

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>City:</Text>
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
                        value={studentAddress.CityId}
                        onChangeText={(value) => handleInputChange('CityId', value)}
                        placeholder="Enter City"
                    />

                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Pincode:</Text>
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
                        value={studentAddress.Pincode}
                        onChangeText={(value) => setStudentAddress({ ...studentAddress, Pincode: isNaN(parseInt(value)) ? "" : parseInt(value) })}
                        placeholder="Enter Pincode"
                        maxLength={6}
                        keyboardType="numeric"
                    />

                    <TouchableOpacity style={{
                        backgroundColor: Colors.primary,
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                        alignItems: 'center',
                    }} onPress={handleSaveStudentDetails}>
                        <Text style={{ color: Colors.background, fontSize: 16, fontWeight: 'bold', }}>{studentAddress.Id !== 0 ? "Save" : "Add"}</Text>
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

export default StudentAddressScreen;
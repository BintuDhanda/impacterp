import { UserContext } from '../../../../App';
import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView, Modal, Alert, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Colors from '../../../constants/Colors';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import { Get as httpGet, Post as httpPost } from '../../../constants/httpService';
import ShowError from '../../../constants/ShowError';

const StudentIdentitiesScreen = ({ route, navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const { studentBatchid } = route.params;
    const [identitiesList, setIdentitiesList] = useState([]);
    const [studentIdentities, setStudentIdentities] = useState({ "StudentIdentitiesId": 0, "StudentBatchId": studentBatchid, "IdentityTypeId": 0, "StringStatus": "In-Active", "IsActive": true, "CreatedAt": null, "CreatedBy": user.userId, "LastUpdatedBy": null, });
    const [identityTypeList, setIdentityTypeList] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const [studentIdentitiesDeleteId, setStudentIdentitiesDeleteId] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const toggleStatusDropdown = () => {
        setShowStatusDropdown(!showStatusDropdown);
    };

    const selectStatus = (selectedStatus) => {
        setStudentIdentities((prevStudentIdentities) => ({
            ...prevStudentIdentities,
            StringStatus: selectedStatus,
        }));
        setShowStatusDropdown(false);
    };

    useFocusEffect(
        React.useCallback(() => {
            GetStudentIdentitiesByStudentId();
            GetIdentityTypeList();
        }, [])
    );

    const GetIdentityTypeList = () => {
        httpGet("IdentityType/get")
            .then((response) => {
                console.log(response.data, "Identity list");
                const identityTypeArray = response.data.map((identityType) => ({
                    value: identityType.identityTypeId,
                    label: identityType.name,
                }));
                setIdentityTypeList(identityTypeArray);
            })
            .catch((error) => {
                console.error(error);
                Toast.show({
                    type: 'error',
                    text1: `${error}`,
                    position: 'bottom',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            });
    }
    const GetStudentIdentitiesById = (studentIdentitiesId) => {
        httpGet(`StudentIdentities/getById?Id=${studentIdentitiesId}`)
            .then((response) => {
                console.log(response.data, "Get Student Identities By id")
                setStudentIdentities({
                    StudentIdentitiesId: response.data.studentIdentitiesId,
                    StudentBatchId: response.data.studentBatchId,
                    IdentityTypeId: response.data.identityTypeId,
                    StringStatus: response.data.stringStatus,
                    IsActive: response.data.isActive,
                    CreatedAt: response.data.createdAt,
                    CreatedBy: response.data.createdBy,
                    LastUpdatedBy: user.userId
                })
            })
            .catch((err) => {
                console.error('Get StudentIdentities Get By Id Error : ', err);
                Toast.show({
                    type: 'error',
                    text1: `${err}`,
                    position: 'bottom',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            })
    }
    const handleSaveStudentIdentities = async () => {
        if(IsFormValid()){try {
            if (studentIdentities.StudentIdentitiesId === 0) {
                await httpPost("StudentIdentities/post", studentIdentities)
                    .then((response) => {
                        if (response.status === 200) {
                            setIdentitiesList([]);
                            GetStudentIdentitiesByStudentId();
                            Alert.alert('Success', 'StudentIdentities is Added Successfully')
                            setStudentIdentities({
                                "StudentIdentitiesId": 0,
                                "StudentBatchId": studentBatchid,
                                "IdentityTypeId": 0,
                                "StringStatus": "In-Active",
                                "IsActive": true,
                                "CreatedAt": null,
                                "CreatedBy": user.userId,
                                "LastUpdatedBy": null,
                            });
                            setShowModal(false);
                        }
                    })
            }
            else {
                await httpPost("StudentIdentities/put", studentIdentities)
                    .then((response) => {
                        if (response.status === 200) {
                            GetStudentIdentitiesByStudentId();
                            Alert.alert('Success', 'Update Student Identities Successfully')
                            setStudentIdentities({
                                "StudentIdentitiesId": 0,
                                "StudentBatchId": studentBatchid,
                                "IdentityTypeId": 0,
                                "StringStatus": "In-Active",
                                "IsActive": true,
                                "CreatedAt": null,
                                "CreatedBy": user.userId,
                                "LastUpdatedBy": null,
                            })
                            setShowModal(false);
                        }
                    })
                    .catch((err) => {
                        console.error("Student Identities update error : ", err);
                        Toast.show({
                            type: 'error',
                            text1: `${err}`,
                            position: 'bottom',
                            visibilityTime: 2000,
                            autoHide: true,
                        });
                    });
            }
        } catch (error) {
            console.error('Error saving Student Identities:', error);
            Toast.show({
                type: 'error',
                text1: `${error}`,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
            });
        }}
    };
    const IsFormValid=()=>{
        if(studentIdentities.IdentityTypeId.length==0)
        {
           ShowError("Select Identity Type");
           return false;
        }
        if(studentIdentities.StringStatus.length==0){
           ShowError("Enter Valid Status");
           return false;
        }
    
        return true;
       }
    const GetStudentIdentitiesByStudentId = () => {
        httpGet(`StudentIdentities/getStudentIdentitiesByStudentBatchId?Id=${studentBatchid}`)
            .then((response) => {
                console.log(response.data);
                setIdentitiesList(response.data);
            })
            .catch((error) => {
                console.error(error, "Get Student Identities By Student Batch Id Error");
                Toast.show({
                    type: 'error',
                    text1: `${error}`,
                    position: 'bottom',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            });
    }

    const DeleteStudentIdentitiesIdConfirm = (studentIdentitiesid) => {
        setStudentIdentitiesDeleteId(studentIdentitiesid);
    }

    const DeleteStudentIdentitiesIdConfirmYes = () => {
        httpGet(`StudentIdentities/delete?Id=${studentIdentitiesDeleteId}`)
            .then((result) => {
                console.log(result);
                GetStudentIdentitiesByStudentId();
                setStudentIdentitiesDeleteId(0);
                setShowDelete(false);
            })
            .catch((error) => {
                console.error('Delete Student Identities error', error);
                Toast.show({
                    type: 'error',
                    text1: `${error}`,
                    position: 'bottom',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            })
    }

    const DeleteStudentIdentitiesIdConfirmNo = () => {
        setStudentIdentitiesDeleteId(0);
        setShowDelete(false);
    }

    const convertToIndianTimee = (datetimeString) => {
        const utcDate = new Date(datetimeString);

        // Convert to IST (Indian Standard Time)
        // utcDate.setMinutes(utcDate.getMinutes() + 330); // IST is UTC+5:30

        const istDate = new Intl.DateTimeFormat('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true, // Use 12-hour format with AM/PM
        }).format(utcDate);

        return istDate;
    }

    const renderIdentitiesCard = ({ item }) => (
        <View style={{
            justifyContent: 'space-between',
            backgroundColor: Colors.background,
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
            shadowColor: Colors.shadow,
            shadowOffset: { width: 10, height: 2 },
            shadowOpacity: 4,
            shadowRadius: 10,
            elevation: 10,
            borderWidth: 1.5,
            borderColor: Colors.primary,
        }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Identities Name : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.identityTypeName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Student Batch Name : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.studentBatchName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Status : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.stringStatus}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Date & Time : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{convertToIndianTimee(item.createdAt)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity style={{ marginRight: 10, }} onPress={() => { GetStudentIdentitiesById(item.studentIdentitiesId); setShowModal(true); }}>
                    <Icon name="pencil" size={20} color={'#5a67f2'} style={{ marginLeft: 8, textAlignVertical: 'center' }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { DeleteStudentIdentitiesIdConfirm(item.studentIdentitiesId), setShowDelete(true); }}>
                    <Icon name="trash" size={20} color={'#f25252'} style={{ marginRight: 8, textAlignVertical: 'center' }} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{
                padding: 16,
                justifyContent: 'center'
            }}>
                <TouchableOpacity style={{
                    backgroundColor: Colors.primary,
                    borderRadius: 5,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    marginBottom: 20,
                }} onPress={() => { setShowModal(true); }}>
                    <Text style={{
                        color: Colors.background,
                        fontSize: 14,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>Add Student Identities</Text>
                </TouchableOpacity>

                {showModal && (
                    <Modal transparent visible={showModal}>
                        <View style={{
                            flex: 1,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <View style={{
                                backgroundColor: Colors.background,
                                borderRadius: 10,
                                padding: 20,
                                width: '80%',
                            }}>
                                <Text style={{ fontSize: 20, marginBottom: 10, color: Colors.shadow, fontWeight: 'bold' }}>Student Identities</Text>
                                <Dropdown
                                    style={[{
                                        height: 50,
                                        borderColor: Colors.primary,
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        paddingHorizontal: 8,
                                        marginBottom: 20,
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
                                    data={identityTypeList}
                                    search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocus ? 'Select Identity Type' : '...'}
                                    searchPlaceholder="Search..."
                                    value={studentIdentities.IdentityTypeId}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={(value) => setStudentIdentities({ ...studentIdentities, IdentityTypeId: value.value })}
                                />
                                <TouchableOpacity
                                    style={{
                                        height: 50,
                                        borderWidth: 1,
                                        borderColor: Colors.primary,
                                        borderRadius: 10,
                                        paddingHorizontal: 10,
                                        paddingVertical: 10,
                                        marginBottom: 10,
                                        position: 'relative',
                                        zIndex: 1,
                                    }}
                                    onPress={toggleStatusDropdown}
                                >
                                    <Text style={{ fontSize: 16, }}>{studentIdentities.StringStatus || 'Select Status'}</Text>
                                    {showStatusDropdown && (
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
                                                onPress={() => selectStatus("Active")}
                                            >
                                                <Text style={{ fontSize: 16, }}>Active</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{ paddingVertical: 8, }}
                                                onPress={() => selectStatus("In-Active")}
                                            >
                                                <Text style={{ fontSize: 16, }}>In-Active</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                                    <TouchableOpacity style={{
                                        backgroundColor: Colors.primary,
                                        borderRadius: 5,
                                        paddingVertical: 8,
                                        paddingHorizontal: 12,
                                        marginTop: 10,
                                        marginRight: 3,
                                    }} onPress={() => {
                                        handleSaveStudentIdentities();
                                    }}>
                                        <Text style={{ fontSize: 16, color: Colors.background }}>{studentIdentities.StudentIdentitiesId == 0 ? "Add" : "Save"}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        backgroundColor: '#f25252',
                                        borderRadius: 5,
                                        paddingVertical: 8,
                                        paddingHorizontal: 12,
                                        marginTop: 10,
                                    }} onPress={() => {
                                        setShowModal(false);
                                    }}>
                                        <Text style={{ fontSize: 16, color: Colors.background }}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}

                {showDelete && (
                    <Modal transparent visible={showDelete}>
                        <View style={{
                            flex: 1,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <View style={{
                                backgroundColor: Colors.background,
                                borderRadius: 10,
                                padding: 28,
                                shadowColor: Colors.shadow,
                                width: '80%',
                            }}>
                                <Text style={{ fontSize: 18, marginBottom: 5, alignSelf: 'center', fontWeight: 'bold' }}>Are You Sure You Want To Delete</Text>

                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                                    <TouchableOpacity style={{
                                        backgroundColor: Colors.primary,
                                        borderRadius: 5,
                                        paddingVertical: 8,
                                        paddingHorizontal: 12,
                                        marginTop: 10,
                                        marginRight: 3,
                                    }} onPress={() => {
                                        DeleteStudentIdentitiesIdConfirmYes();
                                    }}>
                                        <Text style={{ fontSize: 16, color: Colors.background }}>Yes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        backgroundColor: '#f25252',
                                        borderRadius: 5,
                                        paddingVertical: 8,
                                        paddingHorizontal: 12,
                                        marginTop: 10,
                                    }} onPress={() => {
                                        DeleteStudentIdentitiesIdConfirmNo();
                                    }}>
                                        <Text style={{ fontSize: 16, color: Colors.background }}>No</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}

                <FlatList
                    data={identitiesList}
                    keyExtractor={(item) => item.studentIdentitiesId.toString()}
                    renderItem={renderIdentitiesCard}
                />
                <Toast ref={(ref) => Toast.setRef(ref)} />
            </View>
        </ScrollView>
    );
};

export default StudentIdentitiesScreen;

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
//   identitiesCard: {
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
//   identitiesName: {
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
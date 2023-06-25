import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Animated } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import Colors from '../../../constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

const AttendanceScreen = ({ route }) => {
    const { studentId } = route.params;
    const ToDate = new Date();
    ToDate.setDate(ToDate.getDate() + 1)
    const FromDate = new Date();
    FromDate.setDate(FromDate.getDate() - 7);
    const [attendance, setAttendance] = useState({ "Id": 0, "BatchId": "", "AttendanceType": "", "IsActive": true, "StudentId": studentId });
    const [attendanceDebit, setAttendanceDebit] = useState({ "Id": 0, "BatchId": "", "AttendanceType": "", "IsActive": true, "StudentId": "" });
    const [attendanceList, setAttendanceList] = useState([]);
    const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
    const [debitModalVisible, setDebitModalVisible] = useState(false);
    const moveToRight = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState(FromDate.toISOString().slice(0, 10).toString());
    const [toDate, setToDate] = useState(ToDate.toISOString().slice(0, 10).toString());
    const [take, setTake] = useState(10);
    const [skip, setSkip] = useState(0);
    const [isEndReached, setIsEndReached] = useState(true);

    const [selectFromDate, setSelectFromDate] = useState(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000));
    const [selectToDate, setSelectToDate] = useState(new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000))
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const [courseCategoryList, setCourseCategoryList] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [batchList, setBatchList] = useState([]);

    const [value, setValue] = useState(null);
    const [courseValue, setCourseValue] = useState(null);
    const [batchValue, setBatchValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const handleFromDateChange = (event, date) => {
        if (date !== undefined) {
            setSelectFromDate(date);
        }
        setShowDatePicker(false);
    };

    const handleOpenFromDatePicker = () => {
        setShowDatePicker(true);
    };
    const handleConfirmFromDatePicker = () => {
        setShowDatePicker(false);
    };

    const handleToDateChange = (event, date) => {
        if (date !== undefined) {
            setSelectToDate(date);
        }
        setShowToDatePicker(false);
    };

    const handleOpenToDatePicker = () => {
        setShowToDatePicker(true);
    };

    const handleConfirmToDatePicker = () => {
        setShowToDatePicker(false);
    };

    // Function to handle button press
    const handleSearch = () => {
        setAttendanceList([]);
        setFromDate(getFormattedDate(selectFromDate));
        setToDate(getFormattedDate(selectToDate));
        setSkip(0);
        setShowSearch(false);
    };

    useEffect(() => {
        setLoading(true);
        GetAttendanceList();
    }, [skip])

    useEffect(() => {
        if (courseCategoryList.length === 0) {
            GetCourseCategoryList();
        }
    }, []);

    const GetCourseCategoryList = () => {
        axios.get('http://192.168.1.3:5291/api/CourseCategory/get', {
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
            const response = await axios.get(`http://192.168.1.3:5291/api/Course/getCourseByCourseCategoryId?Id=${courseCategoryId}`, {
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
            const response = await axios.get(`http://192.168.1.3:5291/api/Batch/getBatchByCourseId?Id=${courseId}`, {
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
        setAttendance({ ...attendance, BatchId: batch.id })
        setBatchValue(batch.id)
    }

    const [showAttendanceTypeDropdown, setShowAttendanceTypeDropdown] = useState(false);
    const toggleAttendanceTypeDropdown = () => {
        setShowAttendanceTypeDropdown(!showAttendanceTypeDropdown);
    };

    const selectAttendanceType = (selectedAttendanceType) => {
        setAttendance((prevAttendance) => ({
            ...prevAttendance,
            AttendanceType: selectedAttendanceType,
        }));
        setShowAttendanceTypeDropdown(false);
    };

    const GetAttendanceList = () => {
        setLoading(true);
        const filter = { "From": fromDate, "To": toDate, "Take": take, "Skip": skip }
        axios.post(`http://192.168.1.3:5291/api/Attendance/getAttendanceByStudentId?StudentId=${studentId}`, JSON.stringify(filter), {
            headers: {
                'Content-Type': 'application/json', // Example header
                'User-Agent': 'react-native/0.64.2', // Example User-Agent header
            },
        })
            .then((response) => {
                console.log(attendanceList, "AttendanceList")
                setLoading(false);
                if (response.data.length >= 0) {
                    setIsEndReached(false);
                    setAttendanceList([...attendanceList, ...response.data])
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

    const handleAddAttendance = () => {
        setAttendance({
            Id: 0,
            BatchId: "",
            AttendanceType: "",
            IsActive: true,
            StudentId: studentId,
        });
        setAttendanceModalVisible(true);
    };
    const handleAddDebitAttendance = () => {
        setAttendanceDebit({
            Id: 0,
            BatchId: "",
            Credit: 0,
            Debit: 0,
            IsActive: true,
            StudentId: "",
        });
        setDebitModalVisible(true);
    };

    const handleDeleteAttendance = (id) => {
        axios.delete(`http://192.168.1.3:5291/api/Attendance/delete?Id=${id}`)
            .then((result) => {
                console.log(result);
                setAttendanceList([]);
                setSkip(0);
            })
            .catch(err => console.error("Delete Error", err));
    }

    const handleSaveAttendance = async () => {
        try {
            if (attendance.Id !== 0) {
                await axios.put('http://192.168.1.3:5291/api/Attendance/put', JSON.stringify(attendance), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {
                        if (response.status === 200) {
                            setAttendanceList([]);
                            setSkip(0);
                            Alert.alert('Sucess', 'Attendance Credit is Updated Successfully')
                            setAttendance({
                                "Id": 0,
                                "BatchId": "",
                                "AttendanceType": "",
                                "StudentId": studentId,
                                "IsActive": true,
                            });
                        }
                    })
                    setAttendanceModalVisible(false);
            }
            else{
                console.error(attendance, "Attendance")
                await axios.post('http://192.168.1.3:5291/api/Attendance/post', JSON.stringify(attendance), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {
                        if (response.status === 200) {
                            setAttendanceList([]);
                            setSkip(0);
                            Alert.alert('Sucess', 'Attendance Credit is Added Successfully')
                            setAttendance({
                                "Id": 0,
                                "BatchId": "",
                                "AttendanceType": "",
                                "StudentId": studentId,
                                "IsActive": true,
                            });
                        }
                    })
                    setAttendanceModalVisible(false);
            }
        } catch (error) {
            console.error('Error saving Attendance:', error);
        }
    };

    const handleSaveAttendanceDebit = async () => {
        try {
            if (attendanceDebit.Debit !== 0) {
                await axios.post('http://192.168.1.3:5291/api/Attendance/post', JSON.stringify(attendanceDebit), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {
                        if (response.status === 200) {
                            setAttendanceList([]);
                            setSkip(0);
                            Alert.alert('Sucess', 'Attendance Debit is Added Successfully')
                            setAttendanceDebit({
                                "Id": 0,
                                "BatchId": "",
                                "AttendanceType": studentId,
                                "StudentId": "",
                                "IsActive": true,
                            });
                        }
                    })
            }
            setDebitModalVisible(false);
        } catch (error) {
            console.error('Error saving Attendance:', error);
        }
    };

    const handleCloseModal = () => {
        setAttendanceModalVisible(false);
        setDebitModalVisible(false);
    };

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
            setSkip(skip + 10)
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
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
                <TouchableOpacity style={{
                    backgroundColor: '#f25252',
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                }} onPress={() => handleDeleteAttendance(item.id)}>
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
                    <TouchableOpacity onPress={() => { setShowSearch(true); }}>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
                            <TextInput style={{ flex: 1, borderRadius: 10, borderColor: Colors.primary, marginRight: 10, borderWidth: 0.5, fontSize: 16, paddingHorizontal: 20 }} editable={false} placeholder="Search..." />
                            <Icon style={{ textAlignVertical: 'center' }} name="search" size={30} />
                        </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                        <TouchableOpacity style={{
                            backgroundColor: Colors.primary,
                            borderRadius: 5,
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            marginTop: 10,
                            marginRight: 3,
                            alignSelf: 'flex-start',
                        }} onPress={handleAddAttendance}>
                            <Text style={{
                                color: Colors.background,
                                fontSize: 14,
                                fontWeight: 'bold',
                            }}>Attendance</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            backgroundColor: Colors.primary,
                            borderRadius: 5,
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            marginTop: 10,
                            alignSelf: 'flex-start',
                        }} onPress={handleAddDebitAttendance}>
                            <Text style={{
                                color: Colors.background,
                                fontSize: 14,
                                fontWeight: 'bold',
                            }}>Debit Attendance Entry</Text>
                        </TouchableOpacity>
                    </View>
                    {showSearch && (
                        <Modal transparent visible={showSearch}>
                            <View style={{
                                flex: 1,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <View style={{
                                    backgroundColor: Colors.background,
                                    borderRadius: 10,
                                    padding: 10,
                                    marginBottom: 10,
                                    shadowColor: Colors.shadow,
                                    width: '80%',
                                    borderWidth: 0.5,
                                    borderColor: Colors.primary,
                                }}>
                                    <Text style={{ fontSize: 16, marginBottom: 5 }}>From Date :</Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: 10,
                                        paddingHorizontal: 10,
                                        borderWidth: 1,
                                        borderColor: Colors.primary,
                                        borderRadius: 8,
                                    }}>
                                        <TouchableOpacity onPress={handleOpenFromDatePicker}>
                                            <Icon name={'calendar'} size={25} />
                                        </TouchableOpacity>
                                        <TextInput style={{ marginLeft: 10, fontSize: 16, color: Colors.secondary }}
                                            value={getFormattedDate(selectFromDate)}
                                            placeholder="Select From date"
                                            editable={false}
                                        />

                                    </View>
                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={selectFromDate}
                                            mode="date"
                                            display="default"
                                            onChange={handleFromDateChange}
                                            onConfirm={handleConfirmFromDatePicker}
                                            onCancel={handleConfirmFromDatePicker}
                                        />
                                    )}

                                    <Text style={{ fontSize: 16, marginBottom: 5 }}>To Date :</Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: 10,
                                        paddingHorizontal: 10,
                                        borderWidth: 1,
                                        borderColor: Colors.primary,
                                        borderRadius: 8,
                                    }}>
                                        <TouchableOpacity onPress={handleOpenToDatePicker}>
                                            <Icon name={'calendar'} size={25} />
                                        </TouchableOpacity>
                                        <TextInput
                                            style={{ marginLeft: 10, fontSize: 16, color: Colors.secondary }}
                                            value={getFormattedDate(selectToDate)}
                                            placeholder="Select To date"
                                            editable={false}
                                        />

                                    </View>
                                    {showToDatePicker && (
                                        <DateTimePicker
                                            value={selectToDate}
                                            mode="date"
                                            display="default"
                                            onChange={handleToDateChange}
                                            onConfirm={handleConfirmToDatePicker}
                                            onCancel={handleConfirmToDatePicker}
                                        />
                                    )}
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                                        <TouchableOpacity style={{
                                            backgroundColor: Colors.primary,
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            marginTop: 10,
                                            marginRight: 3,
                                        }} onPress={() => {
                                            handleSearch();
                                        }}>
                                            <Text style={{ fontSize: 16, color: Colors.background }}>Search</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            backgroundColor: '#f25252',
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            marginTop: 10,
                                        }} onPress={() => {
                                            setShowSearch(false);
                                        }}>
                                            <Text style={{ fontSize: 16, color: Colors.background }}>Close</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )}

                    <FlatList
                        data={attendanceList}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderAttendanceCard}
                        ListFooterComponent={renderFooter}
                        onEndReached={() => {
                            handleLoadMore();
                        }}
                        onEndReachedThreshold={0.1}
                    />

                    <Toast ref={(ref) => Toast.setRef(ref)} />

                    {attendanceModalVisible && (
                        <Modal transparent visible={attendanceModalVisible}>
                            <View style={{
                                flex: 1,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <View style={{ backgroundColor: Colors.background, borderRadius: 10, padding: 20, width: '80%', }}>
                                    <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: 'bold', color: Colors.shadow }}>Credit Entry</Text>
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
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Attendance Type:</Text>
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
                                        onPress={toggleAttendanceTypeDropdown}
                                    >
                                        <Text style={{ fontSize: 16, }}>{attendance.AttendanceType || 'Select Attendance Type'}</Text>
                                        {showAttendanceTypeDropdown && (
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
                                                    onPress={() => selectAttendanceType('CheckedIn')}
                                                >
                                                    <Text style={{ fontSize: 16, }}>CheckedIn</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={{ paddingVertical: 8, }}
                                                    onPress={() => selectAttendanceType('CheckedOut')}
                                                >
                                                    <Text style={{ fontSize: 16, }}>CheckedOut</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end', }}>
                                        <TouchableOpacity style={{
                                            backgroundColor: Colors.primary,
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                        }} onPress={handleSaveAttendance}>
                                            <Text style={{
                                                color: Colors.background,
                                                fontSize: 14,
                                                fontWeight: 'bold',
                                            }}>{attendance.Id === 0 ? 'Add' : 'Save'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            backgroundColor: '#f25252',
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            marginLeft: 10
                                        }} onPress={handleCloseModal}>
                                            <Text style={{
                                                color: Colors.background,
                                                fontSize: 14,
                                                fontWeight: 'bold',
                                            }}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )}
                    {debitModalVisible && (
                        <Modal transparent visible={debitModalVisible}>
                            <View style={{
                                flex: 1,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <View style={{ backgroundColor: Colors.background, borderRadius: 10, padding: 20, width: '80%', }}>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: Colors.primary,
                                            borderRadius: 10,
                                            padding: 8,
                                            marginBottom: 20,
                                            height: 80,
                                            textAlignVertical: 'top',
                                        }}
                                        placeholder="BatchId"
                                        multiline
                                        value={attendanceDebit.BatchId}
                                        onChangeText={(text) => setAttendanceDebit({ ...attendanceDebit, BatchId: text })}
                                    />
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: Colors.primary,
                                            borderRadius: 10,
                                            padding: 8,
                                            marginBottom: 20,
                                        }}
                                        placeholder="Debit"
                                        keyboardType='numeric'
                                        value={attendanceDebit.Debit}
                                        onChangeText={(text) => setAttendanceDebit({ ...attendanceDebit, Debit: text })}
                                    />
                                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end', }}>
                                        <TouchableOpacity style={{
                                            backgroundColor: Colors.primary,
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                        }} onPress={handleSaveAttendanceDebit}>
                                            <Text style={{
                                                color: Colors.background,
                                                fontSize: 14,
                                                fontWeight: 'bold',
                                            }}>{attendanceDebit.Id === 0 ? 'Add' : 'Save'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            backgroundColor: '#f25252',
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            marginLeft: 10
                                        }} onPress={handleCloseModal}>
                                            <Text style={{
                                                color: Colors.background,
                                                fontSize: 14,
                                                fontWeight: 'bold',
                                            }}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )}
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
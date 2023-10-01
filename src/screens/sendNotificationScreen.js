import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Image, Alert, ScrollView, Animated } from "react-native";
import Colors from "../constants/Colors";
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import { Get as httpGet, Post as httpPost } from '../constants/httpService';

const SendNotificationScreen = () => {
    const moveToRight = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const [courseCategoryList, setCourseCategoryList] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [batchList, setBatchList] = useState([]);
    const [showSendAll, setShowSendAll] = useState(false);
    const [showSendBatch, setShowSendBatch] = useState(false);
    const [showSendCourse, setShowSendCourse] = useState(false);
    const [showSendCourseCategory, setShowSendCourseCategory] = useState(false);
    const [showSendMobile, setShowSendMobile] = useState(false);
    const [courseCategoryValue, setCourseCategoryValue] = useState(null);
    const [courseValue, setCourseValue] = useState(null);
    const [batchValue, setBatchValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [title, SetTitle] = useState("");
    const [body, SetBody] = useState("");
    const [SendToId, SetSendToId] = useState("0");

    useEffect(() => {
        GetCourseCategoryList();
    }, []);




    const GetCourseCategoryList = () => {
        httpGet("CourseCategory/get")
            .then((result) => {
                console.log(result.data)
                setCourseCategoryList(result.data)
            })
            .catch((err) => {
                console.log('Get CourseCategory error :', err);
                Toast.show({
                    type: 'error',
                    text1: `${err}`,
                    position: 'bottom',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            })
    }

    const fetchCourseByCourseCategoryId = async (courseCategoryId) => {
        try {
            const response = await httpGet(`Course/getCourseByCourseCategoryId?Id=${courseCategoryId}`)
            setCourseList(response.data);
        } catch (error) {
            console.log('Error fetching Courses:', error);
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
            const response = await httpGet(`Batch/getBatchByCourseId?Id=${courseId}`)
            setBatchList(response.data);
            console.log(batchList, 'BatchList')
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
        setCourseCategoryValue(courseCategory.courseCategoryId);
        fetchCourseByCourseCategoryId(courseCategory.courseCategoryId);
        SetSendToId(String(courseCategory.courseCategoryId));
    };
    const handleCourseSelect = (course) => {
        setCourseValue(course.courseId);
        fetchBatchByCourseId(course.courseId);
        SetSendToId(String(course.courseId));
    };
    const handleBatchSelect = (batch) => {
        setBatchValue(batch.batchId);
        SetSendToId(String(batch.batchId));
    };

    const handleSendAll = () => {
        httpPost("User/UserNotification", { "Body": body, "Title": title, "SendToId": SendToId, "SendToType": "All" }).then((response) => {
            if (response.status === 200) {
                setShowSendAll(false);
                SetTitle("");
                SetBody("");
                SetSendToId("0");
            }
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

    const handleSendCourseCategory = () => {
        httpPost("User/UserNotification", { "Body": body, "Title": title, "SendToId": SendToId, "SendToType": "CourseCategory" }).then((response) => {
            if (response.status === 200) {
                setShowSendCourseCategory(false);
                SetTitle("");
                SetBody("");
                SetSendToId("0");
            }
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

    const handleSendCourse = () => {
        httpPost("User/UserNotification", { "Body": body, "Title": title, "SendToId": SendToId, "SendToType": "Course" }).then((response) => {
            if (response.status === 200) {
                setShowSendCourse(false);
                SetTitle("");
                SetBody("");
                SetSendToId("0");
            }
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
    const handleSendBatch = () => {
        httpPost("User/UserNotification", { "Body": body, "Title": title, "SendToId": SendToId, "SendToType": "Batch" }).then((response) => {
            if (response.status === 200) {
                setShowSendBatch(false);
                SetTitle("");
                SetBody("");
                SetSendToId("0");
            }
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
    const handleSendMobile = () => {
        httpPost("User/UserNotification", {"Body": body, "Title": title, "SendToId": SendToId, "SendToType": "Mobile"}).then((response) => {
            if (response.status === 200) {
                setShowSendMobile(false);
                SetTitle("");
                SetBody("");
                SetSendToId("0");
            }
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

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 1 }}>
                <Animated.View style={{ flex: 1, justifyContent: 'center', position: 'absolute', top: 0, padding: 16, right: 0, left: 0, bottom: 0, backgroundColor: Colors.background, transform: [{ scale: scale }, { translateX: moveToRight }] }}>
                    {showSendAll && (
                        <Modal transparent visible={showSendAll}>
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
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Title :</Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: Colors.primary,
                                            borderRadius: 8,
                                            marginBottom: 20,
                                            padding: 8,
                                        }}
                                        placeholder="Enter Title"
                                        value={title}
                                        onChangeText={(text) => SetTitle(text)}
                                    />
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Body :</Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: Colors.primary,
                                            borderRadius: 8,
                                            marginBottom: 20,
                                            padding: 8,
                                        }}
                                        placeholder="Enter Body"
                                        value={body}
                                        onChangeText={(text) => SetBody(text)}
                                    />
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                                        <TouchableOpacity style={{
                                            backgroundColor: Colors.primary,
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            marginTop: 10,
                                            marginRight: 3,
                                        }} onPress={() => {
                                            handleSendAll();
                                        }}>
                                            <Text style={{ fontSize: 16, color: Colors.background }}>Send</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            backgroundColor: '#f25252',
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            marginTop: 10,
                                        }} onPress={() => {
                                            setShowSendAll(false);
                                        }}>
                                            <Text style={{ fontSize: 16, color: Colors.background }}>Close</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )}
                    {showSendBatch && (
                        <Modal transparent visible={showSendBatch}>
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
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Course Category :</Text>
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
                                        value={courseCategoryValue}
                                        onFocus={() => setIsFocus(true)}
                                        onBlur={() => setIsFocus(false)}
                                        onChange={handleCourseCategorySelect}
                                    />
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Course :</Text>
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
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Batch :</Text>
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
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Body :</Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: Colors.primary,
                                            borderRadius: 8,
                                            marginBottom: 20,
                                            padding: 8,
                                        }}
                                        placeholder="Enter Body"
                                        value={body}
                                        onChangeText={(text) => SetBody(text)}
                                    />
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Title :</Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: Colors.primary,
                                            borderRadius: 8,
                                            marginBottom: 20,
                                            padding: 8,
                                        }}
                                        placeholder="Enter Title"
                                        value={title}
                                        onChangeText={(text) => SetTitle(text)}
                                    />
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                                        <TouchableOpacity style={{
                                            backgroundColor: Colors.primary,
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            marginTop: 10,
                                            marginRight: 3,
                                        }} onPress={() => {
                                            handleSendBatch();
                                        }}>
                                            <Text style={{ fontSize: 16, color: Colors.background }}>Send</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            backgroundColor: '#f25252',
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            marginTop: 10,
                                        }} onPress={() => {
                                            setShowSendBatch(false);
                                        }}>
                                            <Text style={{ fontSize: 16, color: Colors.background }}>Close</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )}
                    {showSendCourse && (
                        <Modal transparent visible={showSendCourse}>
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
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Course Category :</Text>
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
                                        value={courseCategoryValue}
                                        onFocus={() => setIsFocus(true)}
                                        onBlur={() => setIsFocus(false)}
                                        onChange={handleCourseCategorySelect}
                                    />
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Course :</Text>
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
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Body :</Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: Colors.primary,
                                            borderRadius: 8,
                                            marginBottom: 20,
                                            padding: 8,
                                        }}
                                        placeholder="Enter Body"
                                        value={body}
                                        onChangeText={(text) => SetBody(text)}
                                    />
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Title :</Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: Colors.primary,
                                            borderRadius: 8,
                                            marginBottom: 20,
                                            padding: 8,
                                        }}
                                        placeholder="Enter Title"
                                        value={title}
                                        onChangeText={(text) => SetTitle(text)}
                                    />
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                                        <TouchableOpacity style={{
                                            backgroundColor: Colors.primary,
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            marginTop: 10,
                                            marginRight: 3,
                                        }} onPress={() => {
                                            handleSendCourse();
                                        }}>
                                            <Text style={{ fontSize: 16, color: Colors.background }}>Send</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            backgroundColor: '#f25252',
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            marginTop: 10,
                                        }} onPress={() => {
                                            setShowSendCourse(false);
                                        }}>
                                            <Text style={{ fontSize: 16, color: Colors.background }}>Close</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )}
                    {showSendCourseCategory && (
                        <Modal transparent visible={showSendCourseCategory}>
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
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Course Category :</Text>
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
                                        value={courseCategoryValue}
                                        onFocus={() => setIsFocus(true)}
                                        onBlur={() => setIsFocus(false)}
                                        onChange={handleCourseCategorySelect}
                                    />
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Body :</Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: Colors.primary,
                                            borderRadius: 8,
                                            marginBottom: 20,
                                            padding: 8,
                                        }}
                                        placeholder="Enter Body"
                                        value={body}
                                        onChangeText={(text) => SetBody(text)}
                                    />
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Title :</Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: Colors.primary,
                                            borderRadius: 8,
                                            marginBottom: 20,
                                            padding: 8,
                                        }}
                                        placeholder="Enter Title"
                                        value={title}
                                        onChangeText={(text) => SetTitle(text)}
                                    />
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                                        <TouchableOpacity style={{
                                            backgroundColor: Colors.primary,
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            marginTop: 10,
                                            marginRight: 3,
                                        }} onPress={() => {
                                            handleSendCourseCategory();
                                        }}>
                                            <Text style={{ fontSize: 16, color: Colors.background }}>Send</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            backgroundColor: '#f25252',
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            marginTop: 10,
                                        }} onPress={() => {
                                            setShowSendCourseCategory(false);
                                        }}>
                                            <Text style={{ fontSize: 16, color: Colors.background }}>Close</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )}
                    {showSendMobile && (
                        <Modal transparent visible={showSendMobile}>
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
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Mobile :</Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: Colors.primary,
                                            borderRadius: 8,
                                            marginBottom: 20,
                                            padding: 8,
                                        }}
                                        placeholder="Enter Mobile"
                                        value={SendToId}
                                        keyboardType='numeric'
                                        maxLength={10}
                                        onChangeText={(text) => SetSendToId(String(text))}
                                    />
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Body :</Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: Colors.primary,
                                            borderRadius: 8,
                                            marginBottom: 20,
                                            padding: 8,
                                        }}
                                        placeholder="Enter Body"
                                        value={body}
                                        onChangeText={(text) => SetBody(text)} />
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Title :</Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: Colors.primary,
                                            borderRadius: 8,
                                            marginBottom: 20,
                                            padding: 8,
                                        }}
                                        placeholder="Enter Title"
                                        value={title}
                                        onChangeText={(text) => SetTitle(text)}
                                    />
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                                        <TouchableOpacity style={{
                                            backgroundColor: Colors.primary,
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            marginTop: 10,
                                            marginRight: 3,
                                        }} onPress={() => {
                                            handleSendMobile();
                                        }}>
                                            <Text style={{ fontSize: 16, color: Colors.background }}>Send</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            backgroundColor: '#f25252',
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            marginTop: 10,
                                        }} onPress={() => {
                                            setShowSendMobile(false);
                                        }}>
                                            <Text style={{ fontSize: 16, color: Colors.background }}>Close</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )}
                    <TouchableOpacity style={{
                        backgroundColor: Colors.primary,
                        borderRadius: 5,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        marginBottom: 20,
                    }} onPress={() => { setShowSendAll(true) }}>
                        <Text style={{
                            color: Colors.background,
                            fontSize: 16,
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}>Send All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        backgroundColor: Colors.primary,
                        borderRadius: 5,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        marginBottom: 20,
                    }} onPress={() => { setShowSendBatch(true) }}>
                        <Text style={{
                            color: Colors.background,
                            fontSize: 16,
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}>Send Batch</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        backgroundColor: Colors.primary,
                        borderRadius: 5,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        marginBottom: 20,
                    }} onPress={() => { setShowSendCourse(true) }}>
                        <Text style={{
                            color: Colors.background,
                            fontSize: 16,
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}>Send Course</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        backgroundColor: Colors.primary,
                        borderRadius: 5,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        marginBottom: 20,
                    }} onPress={() => { setShowSendCourseCategory(true) }}>
                        <Text style={{
                            color: Colors.background,
                            fontSize: 16,
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}>Send Course Category</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        backgroundColor: Colors.primary,
                        borderRadius: 5,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        marginBottom: 20,
                    }} onPress={() => { setShowSendMobile(true) }}>
                        <Text style={{
                            color: Colors.background,
                            fontSize: 16,
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}>Send Mobile</Text>
                    </TouchableOpacity>
                    <Toast ref={(ref) => Toast.setRef(ref)} />
                </Animated.View>
            </View>
        </ScrollView>
    );
}

export default SendNotificationScreen;
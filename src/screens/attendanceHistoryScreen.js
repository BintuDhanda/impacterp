import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Animated } from 'react-native';
import Toast from 'react-native-toast-message';
import Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Post as httpPost, Get as httpGet } from '../constants/httpService';

const AttendanceHistoryScreen = ({ route, navigation }) => {
    const { registrationNumber } = route.params;
    const [attendanceList, setAttendanceList] = useState([]);
    const moveToRight = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const [loading, setLoading] = useState(false);
    const [take, setTake] = useState(10);
    const [skip, setSkip] = useState(0);
    const [isEndReached, setIsEndReached] = useState(true);
    const [attendanceHistoryDeleteId, setAttendanceHistoryDeleteId] = useState(0);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        GetAttendanceList();
    }, [])

    const GetAttendanceList = () => {
        setLoading(true);
        const filter = { "RegistrationNumber": registrationNumber, "Take": take, "Skip": skip }
        httpPost("Attendance/getAttendanceByRegistrationNumber", filter)
            .then((response) => {
                console.log(attendanceList, "AttendanceList")
                setLoading(false);
                if (response.data.length >= 0) {
                    setIsEndReached(false);
                    setAttendanceList([...attendanceList, ...response.data]);
                    setSkip(skip + 10);
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
                Toast.show({
                    type: 'error',
                    text1: `${error}`,
                    position: 'bottom',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            });
    }

    const DeleteAttendanceHistoryIdConfirm = (attendanceHistoryid) => {
        setAttendanceHistoryDeleteId(attendanceHistoryid);
    }

    const DeleteAttendanceHistoryIdConfirmYes = () => {
        httpGet(`Attendance/delete?Id=${attendanceHistoryDeleteId}`)
            .then((result) => {
                console.log(result);
                navigation.goBack();
                setAttendanceHistoryDeleteId(0);
                setShowDelete(false);
            })
            .catch((error) => {
                console.error('Delete Attendance History error', error);
                Toast.show({
                    type: 'error',
                    text1: `${error}`,
                    position: 'bottom',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            })
    }

    const DeleteAttendanceHistoryIdConfirmNo = () => {
        setAttendanceHistoryDeleteId(0);
        setShowDelete(false);
    }

    const handleLoadMore = async () => {
        console.log("Execute Handle More function")
        if (!isEndReached) {
            GetAttendanceList();
        }
    };
    const getFormattedDate = (datestring) => {
        const datetimeString = datestring;
        const date = new Date(datetimeString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }
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
            shadowColor: Colors.shadow,
            shadowOffset: { width: 10, height: 2 },
            shadowOpacity: 4,
            shadowRadius: 10,
            elevation: 10,
            borderWidth: 1.5,
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
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Registration Number : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.registrationNumber}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Student Name : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.studentName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Mobile : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.mobile}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={() => { DeleteAttendanceHistoryIdConfirm(item.attendanceId); setSkip(0); setShowDelete(true); }}>
                    <Icon name="trash" size={20} color={'#f25252'} style={{ marginRight: 8, textAlignVertical: 'center' }} />
                </TouchableOpacity>
            </View>
        </View>
    );
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 1 }}>
                <Animated.View style={{ flex: 1, position: 'absolute', top: 0, padding: 16, right: 0, left: 0, bottom: 0, backgroundColor: Colors.background, transform: [{ scale: scale }, { translateX: moveToRight }] }}>

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
                                            DeleteAttendanceHistoryIdConfirmYes();
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
                                            DeleteAttendanceHistoryIdConfirmNo();
                                        }}>
                                            <Text style={{ fontSize: 16, color: Colors.background }}>No</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )}

                    <FlatList
                        data={attendanceList}
                        keyExtractor={(item) => item.attendanceId.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderAttendanceCard}
                        ListFooterComponent={renderFooter}
                        onEndReached={() => {
                            handleLoadMore();
                        }}
                        onEndReachedThreshold={0.1}
                    />

                    <Toast ref={(ref) => Toast.setRef(ref)} />
                </Animated.View>
            </View>
        </ScrollView>
    )
}
export default AttendanceHistoryScreen;
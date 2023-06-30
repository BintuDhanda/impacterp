import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Animated } from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import { Post as httpPost, Get as httpGet, Delete as httpDelete } from '../constants/httpService';

const StudentBatchFeesHistoryScreen = ({ route, navigation }) => {
    const { registrationNumber } = route.params;
    const [studentBatchFeesList, setStudentBatchFeesList] = useState([]);
    const moveToRight = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const [loading, setLoading] = useState(false);
    const [take, setTake] = useState(10);
    const [skip, setSkip] = useState(0);
    const [isEndReached, setIsEndReached] = useState(true);
    const [sumDepositAndRefund, setSumDepositAndRefund] = useState({});

    useFocusEffect(
        React.useCallback(() => {
            GetStudentBatchFeesList();
            GetSumStudentDepositAndRefund();
        }, [])
    )

    const GetSumStudentDepositAndRefund = () => {
        httpGet(`StudentBatchFees/sumDepositAndRefund?registrationNumber=${registrationNumber}`)
            .then((response) => {
                setSumDepositAndRefund(response.data);
            })
    }

    const GetStudentBatchFeesList = () => {
        setLoading(true);
        const filter = { "RegistrationNumber": registrationNumber, "Take": take, "Skip": skip }
        httpPost("StudentBatchFees/getStudentBatchFeesByRegistrationNumber", filter)
            .then((response) => {
                console.log(studentBatchFeesList, "StudentBatchFeesList")
                setLoading(false);
                if (response.data.length >= 0) {
                    setIsEndReached(false);
                    setStudentBatchFeesList([...studentBatchFeesList, ...response.data]);
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
            });
    }

    const handleDeleteStudentBatchFees = (id) => {
        httpDelete(`StudentBatchFees/delete?Id=${id}`)
            .then((result) => {
                console.log(result);
                navigation.goBack();
            })
            .catch(err => console.error("Delete Error", err));
    }

    const handleLoadMore = async () => {
        console.log("Execute Handle More function")
        if (!isEndReached) {
            GetStudentBatchFeesList();
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
    const renderStudentBatchFeesCard = ({ item }) => (
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
            borderWidth: 1,
            borderColor: Colors.primary,
        }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Student Name : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.studentName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Batch Name : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.batchName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Mobile : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.mobile}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Particulars : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.particulars}</Text>
            </View>
            {item.deposit !== 0 ? (<View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Deposit : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.deposit}</Text>
            </View>) : null}
            {item.refund !== 0 ? (<View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Refund : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.refund}</Text>
            </View>) : null}
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>Created At : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{getFormattedDate(item.createdAt)}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
                <TouchableOpacity style={{
                    backgroundColor: '#f25252',
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                }} onPress={() => handleDeleteStudentBatchFees(item.studentBatchFeesId)}>
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
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{
                            fontSize: 14,
                            marginBottom: 10,
                            marginRight: 10,
                            fontWeight: 'bold',
                            backgroundColor: Colors.primary,
                            borderRadius: 5,
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            flex: 1,
                            color: Colors.background
                        }}>Total Deposit : {sumDepositAndRefund.deposit} Rs/-</Text>
                        <Text style={{
                            fontSize: 14,
                            marginBottom: 10,
                            fontWeight: 'bold',
                            backgroundColor: Colors.primary,
                            borderRadius: 5,
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            flex: 1,
                            color: Colors.background
                        }}>Total Refund : {sumDepositAndRefund.refund} Rs/-</Text>
                    </View>
                    <FlatList
                        data={studentBatchFeesList}
                        keyExtractor={(item) => item.studentBatchFeesId.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderStudentBatchFeesCard}
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
export default StudentBatchFeesHistoryScreen;
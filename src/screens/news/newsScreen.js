import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Image, ActivityIndicator, Animated, FlatList, Alert, ScrollView } from 'react-native';
import Colors from '../../constants/Colors';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '../../../App';
import { useContext } from 'react';
import { Post as httpPost, Get as httpGet, Delete as httpDelete, Put as httpPut } from '../../constants/httpService';
import NewsCardComponent from '../../components/newsCardComponent';

const NewsScreen = ({ navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const ToDate = new Date();
    ToDate.setDate(ToDate.getDate() + 1)
    const FromDate = new Date();
    FromDate.setDate(FromDate.getDate() - 7);
    const moveToRight = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState(FromDate.toISOString().slice(0, 10).toString());
    const [toDate, setToDate] = useState(ToDate.toISOString().slice(0, 10).toString());
    const [take, setTake] = useState(10);
    const [skip, setSkip] = useState(0);
    const [newsTitle, setNewsTitle] = useState("");
    const [isEndReached, setIsEndReached] = useState(true);

    const [selectFromDate, setSelectFromDate] = useState(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000));
    const [selectToDate, setSelectToDate] = useState(new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000))
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);
    const [showSearch, setShowSearch] = useState(true);

    const [news, setNews] = useState({ "NewsId": 0, "NewsText": "", "NewsTitle": "", "IsActive": true, "CreatedAt": null, "CreatedBy": user.userId, "LastUpdatedBy": null, });
    const [newsList, setNewsList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const handleFromDateChange = (event, date) => {
        if (date !== undefined) {
            setSelectFromDate(date);
            setFromDate(getFormattedDate(date));
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
            setToDate(getFormattedDate(date));
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
        setNewsList([]);
        setSkip(0);
        GetNewsList();
        setShowSearch(false);
        console.log(selectFromDate, selectToDate, skip)
    };

    const GetNewsList = () => {
        setLoading(true);
        const filter = { "From": fromDate, "To": toDate, "Take": take, "Skip": skip, "NewsTitle": newsTitle, "CreatedBy": user.userId }
        httpPost("News/get", filter)
            .then((result) => {
                console.log(result.data, "news")
                setLoading(false);
                if (result.data.length >= 0) {
                    setIsEndReached(false);
                    setNewsList([...newsList, ...result.data])
                    setSkip(skip + 10)
                }
                if (result.data.length === 0) {
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
            .catch(err => console.error('Get News error :', err))
    }
    const handleAddNews = () => {
        setNews({
            NewsId: 0,
            NewsTitle: "",
            NewsText: "",
            IsActive: true,
            CreatedAt: null,
            CreatedBy: user.userId,
            LastUpdatedBy: null,
        });
        setModalVisible(true);
    };

    const handleSaveNews = () => {
        try {
            if (news.NewsId !== 0) {
                httpPut("News/put", news)
                    .then((response) => {
                        if (response.status === 200) {
                            setNewsList([]);
                            setSkip(0);
                            GetNewsList();
                            Alert.alert('Sucees', 'Update News Successfully')
                            setNews({
                                "NewsId": 0,
                                "NewsTitle": "",
                                "NewsText": "",
                                "IsActive": true,
                                "CreatedAt": null,
                                "CreatedBy": user.userId,
                                "LastUpdatedBy": null,
                            })
                        }
                    })
                    .catch(err => console.error("News update error : ", err));
            }
            else {
                httpPost("News/post", news)
                    .then((response) => {
                        if (response.status === 200) {
                            setNewsList([]);
                            setSkip(0);
                            GetNewsList();
                            Alert.alert('Success', 'Add News Successfully')
                            setNews({
                                "NewsId": 0,
                                "NewsTitle": "",
                                "NewsText": "",
                                "IsActive": true,
                                "CreatedAt": null,
                                "CreatedBy": user.userId,
                                "LastUpdatedBy": null,
                            })
                        }
                    })
                    .catch(err => console.error('News Add error :', err));
            }
            setModalVisible(false);
        }
        catch (error) {
            console.error('Error saving News:', error);
        }
    }

    const handleDeleteNews = (newsId) => {
        httpDelete(`News/delete?Id=${newsId}`)
            .then((result) => {
                console.log(result);
                setNewsList([]);
                setSkip(0);
                GetNewsList();
            })
            .catch(err => console.error("Delete Error", err));
    };

    const handleEditNews = (newsId) => {
        httpGet(`News/getById?Id=${newsId}`)
            .then((response) => {
                setNews({
                    NewsId: response.data.newsId,
                    NewsTitle: response.data.newsTitle,
                    NewsText: response.data.newsText,
                    IsActive: response.data.isActive,
                    CreatedAt: response.data.createdAt,
                    CreatedBy: response.data.createdBy,
                    LastUpdatedBy: user.userId,
                })
            })
            .catch(error => console.error('News Get By Id :', error))
        setModalVisible(true);
    };

    const handleClose = () => {
        setModalVisible(false);
    }

    const handleLoadMore = async () => {
        console.log("Execute Handle More function")
        if (!isEndReached) {
            GetNewsList();
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

    const getFormattedDate = (datestring) => {
        const datetimeString = datestring;
        const date = new Date(datetimeString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }


    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1, }}>
                <Animated.View style={{ flex: 1, top: 0, padding: 16, right: 0, left: 0, bottom: 0, backgroundColor: Colors.background, transform: [{ scale: scale }, { translateX: moveToRight }] }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{
                            fontSize: 18,
                            flex: 1,
                            color: Colors.secondary,
                        }}>Total News : {newsList.length === 0 ? null : newsList[0].totalNews}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { setShowSearch(true); setNewsList([]); }}>
                        <View style={{ flexDirection: 'row', borderRadius: 10, borderColor: Colors.primary, marginBottom: 10, borderWidth: 1.5, fontSize: 16, paddingHorizontal: 20 }}>
                            <TextInput style={{ flex: 1, fontWeight: 'bold' }} editable={false} placeholder="Search..." />
                            <Icon style={{ textAlignVertical: 'center' }} name="search" size={30} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        backgroundColor: Colors.primary,
                        borderRadius: 5,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        marginBottom: 20,
                    }} onPress={handleAddNews}>
                        <Text style={{
                            color: Colors.background,
                            fontSize: 16,
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}>Add News</Text>
                    </TouchableOpacity>

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
                                    borderColor: Colors.primary,
                                }}>
                                    <Text style={{ fontSize: 16, marginBottom: 5 }}>From Date :</Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: 10,
                                        paddingHorizontal: 10,
                                        borderWidth: 1.5,
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
                                        borderWidth: 1.5,
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
                                    <Text style={{ fontSize: 20, marginBottom: 5 }}>Or</Text>
                                    <Text style={{ fontSize: 16, marginBottom: 5 }}>News Title :</Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1.5,
                                            borderColor: Colors.primary,
                                            borderRadius: 8,
                                            marginBottom: 20,
                                            padding: 8,
                                        }}
                                        placeholder="Enter News Title"
                                        value={newsTitle}
                                        keyboardType='numeric'
                                        maxLength={10}
                                        onChangeText={(text) => setNewsTitle(text)}
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
                        data={newsList}
                        keyExtractor={(item) => item.newsId.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={(item)=><NewsCardComponent item={item} navigation={navigation}/>}
                        ListFooterComponent={renderFooter}
                        onEndReached={() => {
                            handleLoadMore();
                        }}
                        onEndReachedThreshold={0.1}
                    />

                    <Toast ref={(ref) => Toast.setRef(ref)} />

                    <Modal visible={modalVisible} animationType="slide" transparent>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}>
                            <View style={{
                                backgroundColor: Colors.background,
                                borderRadius: 10,
                                padding: 20,
                                width: '80%',
                            }}>
                                <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: Colors.primary, borderRadius: 8, marginBottom: 10 }}>
                                    <TextInput
                                        style={{
                                            flex: 1
                                        }}
                                        placeholder="News Title"
                                        value={news.NewsTitle}
                                        onChangeText={(text) => setNews({ ...news, NewsTitle: text })}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: Colors.primary, borderRadius: 8 }}>
                                    <TextInput
                                        style={{
                                            flex: 1,
                                        }}
                                        placeholder="News Text"
                                        value={news.NewsText}
                                        onChangeText={(text) => setNews({ ...news, NewsText: text })}
                                    />
                                </View>
                                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <TouchableOpacity style={{
                                        backgroundColor: Colors.primary,
                                        borderRadius: 5,
                                        paddingVertical: 8,
                                        paddingHorizontal: 12,
                                    }} onPress={() => { handleSaveNews(); setNewsList([]); }}>
                                        <Text style={{
                                            color: Colors.background,
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                        }}>{news.NewsId !== 0 ? 'Save' : 'Add'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#f25252',
                                            borderRadius: 5,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            marginLeft: 10,
                                        }}
                                        onPress={handleClose}
                                    >
                                        <Text style={{
                                            color: Colors.background,
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                        }}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </Animated.View>
            </View>
        </ScrollView>
    );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   addButton: {
//     backgroundColor: '#5a67f2',
//     borderRadius: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   addButtonLabel: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     padding: 20,
//     width: '80%',
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     height: 40,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
//   addModalButton: {
//     backgroundColor: '#5a67f2',
//     borderRadius: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginBottom: 10,
//   },
//   addModalButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   closeModalButton: {
//     backgroundColor: '#f25252',
//     borderRadius: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   closeModalButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   newsList: {
//     flexGrow: 1,
//   },
//   newsCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     padding: 20,
//     marginBottom: 10,
//     shadowColor: '#000000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   newsName: {
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
// });

export default NewsScreen;
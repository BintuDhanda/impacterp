import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Alert, ScrollView } from 'react-native';
import Colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Get as httpGet, Post as httpPost, Put as httpPut, Delete as httpDelete } from '../../constants/httpService';
import { UserContext } from '../../../App';
import { useContext } from 'react';

const NewsCommentScreen = ({ route }) => {
    const { newsId } = route.params;
    const { user, setUser } = useContext(UserContext);
    const [newsComment, setNewsComment] = useState({ "NewsCommentId": 0, "Comment": "", "NewsId": newsId, "IsActive": true, "CreatedAt": null, "CreatedBy": user.userId, "LastUpdatedBy": null, });
    const [newsCommentList, setNewsCommentList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newsCommentDeleteId, setNewsCommentDeleteId] = useState(0);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        GetNewsCommentList();
    }, []);
    const GetNewsCommentList = () => {
        httpGet(`NewsComment/getNewsCommentByNewsId?NewsId=${newsId}`)
            .then((result) => {
                console.log(result.data)
                setNewsCommentList(result.data)
            })
            .catch(err => console.log('Get News Comment error :', err))
    }
    const handleAddNewsComment = () => {
        setNewsComment({
            NewsCommentId: 0,
            Comment: "",
            NewsId: newsId,
            CreatedBy: user.userId,
            IsActive: true,
            CreatedAt: null,
            CreatedBy: user.userId,
            LastUpdatedBy: null,
        });
        setModalVisible(true);
    };

    const handleSaveNewsComment = () => {
        try {
            if (newsComment.NewsCommentId !== 0) {
                httpPut("NewsComment/put", newsComment)
                    .then((response) => {
                        if (response.status === 200) {
                            GetNewsCommentList();
                            Alert.alert('Sucees', 'Update News Comment Successfully')
                            setNewsComment({
                                "NewsCommentId": 0,
                                "Comment": "",
                                "NewsId": newsId,
                                "CreatedBy": user.userId,
                                "IsActive": true,
                                "CreatedAt": null,
                                "CreatedBy": user.userId,
                                "LastUpdatedBy": null,
                            })
                        }
                    })
                    .catch(err => console.log("News Comment update error : ", err));
            }
            else {
                httpPost("NewsComment/post", newsComment)
                    .then((response) => {
                        if (response.status === 200) {
                            GetNewsCommentList();
                            Alert.alert('Success', 'Add News Comment Successfully')
                            setNewsComment({
                                "NewsCommentId": 0,
                                "Comment": "",
                                "NewsId": newsId,
                                "CreatedBy": user.userId,
                                "IsActive": true,
                                "CreatedAt": null,
                                "CreatedBy": user.userId,
                                "LastUpdatedBy": null,
                            })
                        }
                    })
                    .catch(err => console.log('News Comment Add error :', err));
            }
            setModalVisible(false);
        }
        catch (error) {
            console.log('Error saving News Comment:', error);
        }
    }

    const DeleteNewsCommentIdConfirm = (newsCommentid) => {
        setNewsCommentDeleteId(newsCommentid);
      }
    
      const DeleteNewsCommentIdConfirmYes = () => {
        httpDelete(`NewsComment/delete?Id=${newsCommentDeleteId}`)
          .then((result) => {
            console.log(result);
            GetNewsCommentList();
            setNewsCommentDeleteId(0);
            setShowDelete(false);
          })
          .catch(error => console.error('Delete NewsComment error', error))
      }
    
      const DeleteNewsCommentIdConfirmNo = () => {
        setNewsCommentDeleteId(0);
        setShowDelete(false);
      }

    const handleEditNewsComment = (newsCommentId) => {
        httpGet(`NewsComment/getById?Id=${newsCommentId}`)
            .then((response) => {
                setNewsComment({
                    NewsCommentId: response.data.newsCommentId,
                    Comment: response.data.comment,
                    NewsId: response.data.newsId,
                    CreatedBy: response.data.createdBy,
                    IsActive: response.data.isActive,
                    CreatedAt: response.data.createdAt,
                    CreatedBy: response.data.createdBy,
                    LastUpdatedBy: user.userId,
                })
            })
            .catch(error => console.log('News Comment Get By Id :', error))
        setModalVisible(true);
    };

    const handleClose = () => {
        setModalVisible(false);
    }

    const renderNewsCommentCard = ({ item }) => {
        return (
            <View style={{
                flexDirection: 'row',
                backgroundColor: Colors.background,
                borderRadius: 10,
                padding: 5,
                marginBottom: 10,
                shadowColor: Colors.primary,
                shadowOffset: { width: 5, height: 5 },
                shadowOpacity: 5,
                shadowRadius: 10,
                elevation: 10,
                borderWidth: 1.5,
                borderColor: "grey",
                alignItems: 'center'
            }}>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', borderRadius: 50, borderWidth: 1.5, borderColor: Colors.primary, color: Colors.secondary, padding: 8, marginRight: 10 }}>{item.userName}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: '80%' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.comment}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '20%' }}>

                        <TouchableOpacity style={{ marginRight: 10, }} onPress={() => handleEditNewsComment(item.newsCommentId)} >
                            <Icon name="pencil" size={18} color={'#5a67f2'} style={{ marginLeft: 8, textAlignVertical: 'center' }} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {DeleteNewsCommentIdConfirm(item.newsCommentId); setShowDelete(true);}}>
                            <Icon name="trash" size={18} color={'#f25252'} style={{ marginRight: 8, textAlignVertical: 'center' }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        );
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 1, padding: 20, }}>
                <TouchableOpacity style={{
                    backgroundColor: Colors.primary,
                    borderRadius: 5,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    marginBottom: 20,
                }} onPress={handleAddNewsComment}>
                    <Text style={{
                        color: Colors.background,
                        fontSize: 16,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}>Add News Comment</Text>
                </TouchableOpacity>

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
                                        DeleteNewsCommentIdConfirmYes();
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
                                        DeleteNewsCommentIdConfirmNo();
                                    }}>
                                        <Text style={{ fontSize: 16, color: Colors.background }}>No</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}

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
                            marginBottom: 20,
                        }}>
                            <TextInput
                                style={{
                                    width: '100%',
                                    height: 40,
                                    borderWidth: 1,
                                    borderColor: Colors.primary,
                                    marginBottom: 10,
                                    paddingHorizontal: 10,
                                }}
                                placeholder="News Comment"
                                value={newsComment.Comment}
                                onChangeText={(text) => setNewsComment({ ...newsComment, Comment: text })}
                            />

                            <TouchableOpacity style={{
                                backgroundColor: Colors.primary,
                                borderRadius: 5,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                marginBottom: 10,
                            }} onPress={handleSaveNewsComment}>
                                <Text style={{
                                    color: Colors.background,
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}>{newsComment.NewsCommentId !== 0 ? 'Save' : 'Add'}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#f25252',
                                borderRadius: 5,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                            }}
                            onPress={handleClose}
                        >
                            <Text style={{
                                color: Colors.background,
                                fontSize: 16,
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <FlatList
                    data={newsCommentList}
                    renderItem={renderNewsCommentCard}
                    keyExtractor={(item) => item.newsCommentId.toString()}
                />
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
//   newsCommentList: {
//     flexGrow: 1,
//   },
//   newsCommentCard: {
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
//   newsCommentName: {
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

export default NewsCommentScreen;
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Image, ActivityIndicator, Animated, FlatList, Alert, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '../../App';
import { useContext } from 'react';
import { Post as httpPost, Delete as httpDelete, } from '../constants/httpService';
import { News_URL } from '../constants/constant';


const NewsCardComponent = ({ item, navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const [cardNews, SetCardNews] = useState(item.item);
    const { width, height } = Dimensions.get('window');
    const [newsDeleteId, setNewsDeleteId] = useState(0);
    const [showDelete, setShowDelete] = useState(false);

    const handleNewsLike = (newsId) => {
        httpPost("NewsLike/post", { NewsId: newsId, CreatedBy: user.userId, IsActive: true })
            .then((response) => {

                SetCardNews({
                    ...cardNews,
                    isLiked: !cardNews.isLiked,
                    totalLikes: response.data.totalLikes,
                });
            })
            .catch(err => console.error("News Like Error", err))
    }

    const DeleteNewsIdConfirm = (newsid) => {
        setNewsDeleteId(newsid);
    }

    const DeleteNewsIdConfirmYes = () => {
        httpDelete(`News/delete?Id=${newsDeleteId}`)
            .then((result) => {
                console.log(result);
                setNewsList([]);
                setSkip(0);
                GetNewsList();
                setNewsDeleteId(0);
                setShowDelete(false);
            })
            .catch(error => console.error('Delete News error', error))
    }

    const DeleteNewsIdConfirmNo = () => {
        setNewsDeleteId(0);
        setShowDelete(false);
    }

    const handleNewsCommentNavigate = (newsId) => {
        navigation.navigate('NewsCommentScreen', { newsId: newsId })
    }

    const handleNewsLikeNavigate = (newsId) => {
        navigation.navigate('NewsLikeScreen', { newsId: newsId })
    }

    console.log("News Image", cardNews.newsImage)
    return (
        <>
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
                                    DeleteNewsIdConfirmYes();
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
                                    DeleteNewsIdConfirmNo();
                                }}>
                                    <Text style={{ fontSize: 16, color: Colors.background }}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
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
                borderWidth: 1,
                borderColor: Colors.primary,
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{cardNews.newsTitle}</Text>
                </View>
                {(cardNews.newsImage !== null && cardNews.newsImage !== "") && (<Image source={{ uri: News_URL + cardNews.newsImage }} style={{ width: width * 0.8, height: (width * 0.8 / 1.5), resizeMode: 'cover', borderRadius: 10, alignSelf: 'center', }} />)}
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}> {cardNews.newsText} </Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10, }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignContent: 'center' }} onPress={() => handleNewsLike(cardNews.newsId)}>
                        {cardNews.isLiked ? (<Icon name="heart" size={20} color="red" />) : (<Icon name="heart-o" size={20} color="red" />)}
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginRight: 20 }} onPress={() => handleNewsLikeNavigate(cardNews.newsId)}>
                        <Text style={{ marginLeft: 5, }}>{cardNews.totalLikes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignContent: 'center' }} onPress={() => handleNewsCommentNavigate(cardNews.newsId)} >
                        {cardNews.isCommented ? (<Icon name="comment" size={20} color="blue" />) : (<Icon name="comment-o" size={20} color="blue" />)}
                        <Text style={{ marginLeft: 5, }}>{cardNews.totalComments}</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' }}>
                        <TouchableOpacity
                            style={{
                                marginRight: 10,
                            }} onPress={() => handleEditNews(cardNews.newsId)} >
                            <Icon name="pencil" size={20} color={'#5a67f2'} style={{ marginLeft: 8, textAlignVertical: 'center' }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {DeleteNewsIdConfirm(cardNews.newsId); setShowDelete(true);}} >
                            <Icon name="trash" size={20} color={'#f25252'} style={{ marginRight: 8, textAlignVertical: 'center' }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        </>
    );
};

export default NewsCardComponent;
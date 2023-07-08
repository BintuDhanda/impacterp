import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Image, ActivityIndicator, Animated, FlatList, Alert, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '../../App';
import { useContext } from 'react';
import { Post as httpPost, Get as httpGet, Delete as httpDelete, Put as httpPut } from '../constants/httpService';


const NewsCardComponent = ({item, showModel}) => {
    console.log(item.item,'item');
    const { user, setUser } = useContext(UserContext);
    const [cardNews,SetCardNews] = useState(item.item);
    const [iscardUpdated,SetIscardUpdated] = useState(false);

    const handleNewsLike = (newsId) => {
        httpPost("NewsLike/post", {NewsId: newsId , CreatedBy: 1, IsActive: true})
            .then((response) => {
               
             SetCardNews({...cardNews,
                isLiked: !cardNews.isLiked,
                totalLikes: response.data.totalLikes,});
            })
            .catch(err => console.error("News Like Error", err))
    }

    return (
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
                <Text style={{ fontSize: 16 }}>News Title : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{cardNews.newsTitle}</Text>
            </View>
            <Image source={{ uri: 'https://cdn.pixabay.com/photo/2023/05/14/19/42/sky-7993656_1280.jpg' }} style={{ width: '100%', height: 200, resizeMode: 'cover', }} />
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 16 }}>News Text : </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlignVertical: 'center' }}> {cardNews.newsText} </Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10, }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20, }} onPress={() =>  handleNewsLike(cardNews.newsId)}>
                   {cardNews.isLiked? (<Icon name="heart" size={20} color="red" />): (<Icon name="heart-o" size={20} color="red" />)}
                    <Text style={{ marginLeft: 5, }}>{cardNews.totalLikes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20, }} onPress={()=>showModel(true) } >
                    <Icon name="comment" size={20} color="blue" />
                    <Text style={{ marginLeft: 5, }}>{item.totalComments}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#5a67f2',
                        borderRadius: 5,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        marginRight: 10,
                    }} onPress={() => handleEditNews(item.newsId)} >
                    <Text style={{
                        color: Colors.background,
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}>Edit</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    style={{
                        backgroundColor: '#ffff80',
                        borderRadius: 5,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        marginRight: 10,
                    }} onPress={() => handleManageNavigate(item.newsId, item.newsTitle)} >
                    <Text style={{
                        color: Colors.primary,
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}>Manage</Text>
                </TouchableOpacity>
                {item.isStudentCreated !== true ? (<TouchableOpacity
                    style={{
                        backgroundColor: '#ffff80',
                        borderRadius: 5,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        marginRight: 10,
                    }} onPress={() => handleNavigate(item.newsId)} >
                    <Text style={{
                        color: Colors.primary,
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}>Student Create</Text>
                </TouchableOpacity>) : null} */}
                <TouchableOpacity
                    style={{
                        backgroundColor: '#f25252',
                        borderRadius: 5,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                    }}
                    onPress={() => handleDeleteNews(item.newsId)}
                >
                    <Text style={{
                        color: Colors.background,
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View >
    );
};

export default NewsCardComponent;
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Alert, ScrollView } from 'react-native';
import Colors from '../../constants/Colors';
import { Get as httpGet, Delete as httpDelete } from '../../constants/httpService';
import Icon from 'react-native-vector-icons/FontAwesome';

const NewsLikeScreen = ({ route }) => {
    const { newsId } = route.params;
    const [newsLikeList, setNewsLikeList] = useState([]);
    const [newsLikeDeleteId, setNewsLikeDeleteId] = useState(0);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        GetNewsLikeList();
    }, []);
    const GetNewsLikeList = () => {
        httpGet(`NewsLike/getNewsLikeByNewsId?NewsId=${newsId}`)
            .then((result) => {
                console.log(result.data)
                setNewsLikeList(result.data)
            })
            .catch(err => console.log('Get News Like error :', err))
    }

    const DeleteNewsLikeIdConfirm = (newsLikeid) => {
        setNewsLikeDeleteId(newsLikeid);
    }

    const DeleteNewsLikeIdConfirmYes = () => {
        httpDelete(`NewsLike/delete?Id=${newsLikeDeleteId}`)
            .then((result) => {
                console.log(result);
                GetNewsLikeList();
                setNewsLikeDeleteId(0);
                setShowDelete(false);
            })
            .catch(error => console.error('Delete NewsLike error', error))
    }

    const DeleteNewsLikeIdConfirmNo = () => {
        setNewsLikeDeleteId(0);
        setShowDelete(false);
    }

    const renderNewsLikeCard = ({ item }) => {
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
                    <Text style={{ fontSize: 20, fontWeight: 'bold', borderRadius: 50, borderWidth: 2, borderColor: Colors.primary, color: Colors.secondary, padding: 8, marginRight: 10 }}>{item.userName}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: '80%' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', }}>{item.userMobile}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '20%' }}>
                        <TouchableOpacity onPress={() => { DeleteNewsLikeIdConfirm(item.newsLikeId); setShowDelete(true); }}>
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
                                        DeleteNewsLikeIdConfirmYes();
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
                                        DeleteNewsLikeIdConfirmNo();
                                    }}>
                                        <Text style={{ fontSize: 16, color: Colors.background }}>No</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}

                <FlatList
                    data={newsLikeList}
                    renderItem={renderNewsLikeCard}
                    keyExtractor={(item) => item.newsLikeId.toString()}
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
//   newsLikeList: {
//     flexGrow: 1,
//   },
//   newsLikeCard: {
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
//   newsLikeName: {
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

export default NewsLikeScreen;
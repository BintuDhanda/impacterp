import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';

const LogInScreen = ({ navigation }) => {

    const [phone, setPhone] = useState('');

    const handleLogin = () => {
        // Handle login logic
        navigation.navigate('VerifyOTPScreen')
    };
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
                <View style={{ paddingHorizontal: 25 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../assets/impact.png')} />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            marginBottom: 30,
                            alignItems: 'center'
                        }}>Welcome Back!</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        borderBottomColor: '#ccc',
                        borderBottomWidth: 1,
                        paddingBottom: 8,
                        marginBottom: 25
                    }}>
                        <Icon name="phone" style={{ marginRight: 5 }} size={20} color="#666" />
                        <TextInput
                            placeholder="Phone No."
                            style={{ flex: 1, paddingVertical: 0 }}
                            value={phone}
                            keyboardType="numeric"
                            maxLength={10}
                            onChangeText={(text) => setPhone(text)}
                        />
                    </View>
                    <TouchableOpacity style={{ backgroundColor: '#e60000', padding: 20, borderRadius: 10, marginBottom: 30, }} onPress={handleLogin}>
                        <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 16, color: '#fff', }}>Login</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}


// const styles = StyleSheet.create({

//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 30,
//         alignItems: 'center'
//     },
//     inputContainer: {
//         borderRadius: 100,
//         borderWidth: 2,
//         borderColor: 'black',
//         width: '90%',
//         marginBottom: 1,
//         padding: 4,
//         flexDirection: 'row',
//         alignItems: 'center',
//         height: 50,
//     },
//     input: {
//         fontSize: 15,
//         flex: 1,
//     },
//     secondContainer: {
//         backgroundColor: '#e60000',
//         height: 50,
//         width: '90%',
//         borderColor: 'white',
//         borderRadius: 100,
//         marginTop: 10
//     },
//     button: {
//         backgroundColor: '#e60000',
//         width: '100%',
//         borderRadius: 100,
//         alignItems: 'center',
//         marginVertical: 10,
//         flex: 1
//     },
//     logInBtnText: {
//         color: 'white',
//         fontSize: 22
//     },
// });


export default LogInScreen;
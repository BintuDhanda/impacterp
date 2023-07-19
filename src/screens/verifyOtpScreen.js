import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Post as httpPost } from '../constants/httpService';
import Toast from 'react-native-toast-message';
import { sendOTP } from '../constants/smsService';
import Colors from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../App';
import { useContext } from 'react';

const VerifyOTPScreen = ({ route, navigation }) => {
  const { verifyOtp, mobile } = route.params;
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [count, setCount] = useState(1)
  const [timer, setTimer] = useState(60);
  const [showResend, setShowResend] = useState(false);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setShowResend(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const handleConfirmOtp = () => {
    // Update the isLogedIn state to true
    console.log(otp, verifyOtp)
    if (otp == verifyOtp) {
      // get user token api call
      httpPost("User/login", { userMobile: mobile, userPassword: password }).then((response) => {
        console.log(response.data, "Response")
        if (response.status === 200) {
          AsyncStorage.setItem('user', JSON.stringify(response.data));
          setUser(response.data);
        }
      }).catch((err) => {
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      })
    }
    // Navigate to the HomeScreen
  };

  const handleResendOtp = () => {
    setCount(count + 1)
    console.log(count, "Count")
    if (count >= 3) {
      Toast.show({
        type: 'error',
        text1: 'No Send More Otp You Reached Limit already',
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
    else {
      sendOTP(verifyOtp, mobile).then((res) => {
        console.log(res.data, "Response otp")
        if (res.status == 200) {
          setTimer(60);
          setShowResend(false);
        }
      }
      ).catch((err) => {
        console.error("Send Otp Error : ", err)
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      })
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.background }}>
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
            }}>Welcome Back!</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            borderBottomColor: Colors.primary,
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 25
          }}>
            <Icon name="verified" style={{ marginRight: 5 }} size={20} color="#666" />
            <TextInput
              style={{ flex: 1, paddingVertical: 0 }}
              placeholder="Enter OTP"
              value={otp}
              onChangeText={(text) => setOtp(text)}
              keyboardType='numeric'
              maxLength={4}
            />
          </View>
          <View style={{
            flexDirection: 'row',
            borderBottomColor: Colors.primary,
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 25
          }}>
            <Icon name="lock" style={{ marginRight: 5 }} size={20} color="#666" />
            <TextInput
              style={{ flex: 1, paddingVertical: 0 }}
              placeholder="Enter Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
            />
          </View>
          {showResend ? (
            <TouchableOpacity style={{ backgroundColor: Colors.primary, padding: 15, borderRadius: 10, marginBottom: 30, }} onPress={handleResendOtp}>
              <Text style={{ textAlign: 'center', fontSize: 16, color: '#fff', }}>Resend OTP</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={{ backgroundColor: Colors.primary, padding: 15, borderRadius: 10, marginBottom: 30, }} onPress={handleConfirmOtp}>
              <Text style={{ textAlign: 'center', fontSize: 16, color: '#fff', }}>Confirm OTP</Text>
            </TouchableOpacity>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 30,
            }}>
            <Text>or resend in {timer} Seconds.</Text>
          </View>
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 30,
//   },
//   inputContainer: {
//     borderRadius: 100,
//     borderWidth: 2,
//     borderColor: 'black',
//     width: '90%',
//     marginBottom: 1,
//     padding: 4,
//     flexDirection: 'row',
//     alignItems: 'center',
//     height: 50,
//   },
//   input: {
//     fontSize: 16,
//     flex: 1
//   },
//   secondContainer: {
//     backgroundColor: '#e60000',
//     height: 50,
//     width: '90%',
//     borderColor: 'white',
//     borderRadius: 100,
//     marginTop: 10
//   },
//   button: {
//     backgroundColor: '#e60000',
//     width: '100%',
//     borderRadius: 100,
//     alignItems: 'center',
//     marginVertical: 10,
//     flex: 1
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 22,
//   },
// });

export default VerifyOTPScreen;
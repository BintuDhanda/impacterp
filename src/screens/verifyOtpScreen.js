import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const VerifyOTPScreen = ({ navigation }) => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [showResend, setShowResend] = useState(false);

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
    isLogedIn = true;
    // Navigate to the HomeScreen
    navigation.navigate('HomeScreen');
  };

  const handleResendOtp = () => {
    setTimer(60);
    setShowResend(false);
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
            }}>Welcome Back!</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
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
          {showResend ? (
            <TouchableOpacity style={{ backgroundColor: '#e60000', padding: 20, borderRadius: 10, marginBottom: 30, }} onPress={handleResendOtp}>
              <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 16, color: '#fff', }}>Resend OTP</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={{ backgroundColor: '#e60000', padding: 20, borderRadius: 10, marginBottom: 30, }} onPress={handleConfirmOtp}>
              <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 16, color: '#fff', }}>Confirm OTP</Text>
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
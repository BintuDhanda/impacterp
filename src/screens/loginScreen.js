import {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Post as httpPost} from '../constants/httpService';
import Toast from 'react-native-toast-message';
import {sendOTP} from '../constants/smsService';
import Colors from '../constants/Colors';
import {PrimaryButton} from '@src/components/buttons';

const LogInScreen = ({navigation}) => {
  const [phone, setPhone] = useState('');
  const [isPress, setIsPress] = useState({IsPress: false});
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    // Handle login logic
    //navigation.navigate('VerifyOTPScreen')

    //check if user exists or not
    setLoading(true);
    httpPost(`User/IsExists`, {Mobile: phone})
      .then(res => {
        if (res.data == false) {
          Toast.show({
            type: 'error',
            text1: 'User dose not exist',
            position: 'bottom',
            visibilityTime: 2000,
            autoHide: true,
          });
          setIsPress({...isPress, IsPress: !isPress});
        } else {
          //send otp
          //navigatin with otp
          let otp = Math.floor(1000 + Math.random() * 9000);
          console.log(otp, 'Otp');
          sendOTP(otp, phone)
            .then(res => {
              console.log(res.data, 'Response otp');
              if (res.status == 200) {
                navigation.navigate('VerifyOTPScreen', {
                  mobile: phone,
                  verifyOtp: otp,
                });
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'OTP Send is Fail Please Send Again',
                  position: 'bottom',
                  visibilityTime: 2000,
                  autoHide: true,
                });
                setIsPress({...isPress, isPress: !isPress});
              }
            })
            .catch(err => {
              console.error('Send Otp Error : ', err);
              Toast.show({
                type: 'error',
                text1: `${err}`,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
              });
            });
        }
      })
      .catch(err => {
        console.error('IsExist Error : ', err);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      })
      .then(() => {
        setLoading(false);
      });
  };

  // const sendOTP = () =>{
  //     let otp = 1234;
  //     let user = 'impactcampus';
  //     let password = 'K9F2HDNY';
  //     let mobile ='9416669174';
  //     let sid ='IMPHSR';
  //     let msg =`Dear Student, Your Registration OTP is ${otp} Mobile No. 9050546000 Impact Academy, Hisar`;
  //     axios.get(`http://www.getwaysms.com/vendorsms/pushsms.aspx?user=${user}&password=${password}&msisdn=${mobile}&sid=${sid}&msg=${msg}&fl=0&gwid=2)`)
  //     .then((res)=>{
  //         if(res.status==200)
  //         {
  //             navigation.navigate('VerifyOTPScreen', {verifyotp: otp})
  //         }
  //     })
  // }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{flexGrow: 1}}>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: Colors.background,
        }}>
        <View style={{paddingHorizontal: 25}}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../assets/impact.png')}
              style={{borderRadius: 200}}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 30,
                alignItems: 'center',
              }}>
              Welcome Back!
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              borderBottomColor: Colors.primary,
              borderBottomWidth: 1,
              paddingBottom: 8,
              marginBottom: 25,
            }}>
            <Icon
              name="mobile"
              style={{marginRight: 5}}
              size={20}
              color="#666"
            />
            <TextInput
              placeholder="Phone No."
              style={{flex: 1, paddingVertical: 0}}
              value={phone}
              keyboardType="numeric"
              maxLength={10}
              onChangeText={text => setPhone(text)}
            />
          </View>
          <PrimaryButton
            loading={loading}
            onPress={() => {
              handleLogin();
              setIsPress(true);
            }}
            title="Login"
          />
        </View>
        <Toast ref={ref => Toast.setRef(ref)} />
      </SafeAreaView>
    </ScrollView>
  );
};

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

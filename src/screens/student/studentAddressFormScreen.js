import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Colors from '../../constants/Colors';
import Toast from 'react-native-toast-message';
import { Dropdown } from 'react-native-element-dropdown';
import { UserContext } from '../../../App';
import { useContext } from 'react';
import { Get as httpGet, Post as httpPost } from '../../constants/httpService';

const StudentAddressFormScreen = ({ route, navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const { addressId, studentId } = route.params;
  const [studentAddress, setStudentAddress] = useState({
    "StudentAddressId": 0,
    "AddressTypeId": "",
    "Address": "",
    "CountryId": "",
    "StateId": "",
    "CityId": "",
    "Pincode": "",
    "StudentId": studentId,
    "IsActive": true,
    "CreatedAt": null,
    "CreatedBy": user.userId,
    "LastUpdatedBy": null,
  });
  const [addressTypeList, setAddressTypeList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [countryValue, setCountryValue] = useState(null);
  const [stateValue, setStateValue] = useState(null);
  const [cityValue, setCityValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    if (addressTypeList.length === 0) {
      GetAddressTypeList();
    }
  }, [])

  useEffect(() => {
    if (countryList.length === 0) {
      GetCountryList();
    }
  }, [])

  useEffect(() => {
    if (addressId !== undefined) {
      GetAddressById();
    }
  }, [addressId])

  const handleInputChange = (name, value) => {
    setStudentAddress((prevStudentAddress) => ({
      ...prevStudentAddress,
      [name]: value,
    }));
  };

  const GetAddressById = () => {
    httpGet(`StudentAddress/getById?Id=${addressId}`)
      .then((response) => {
        setStudentAddress({
          StudentAddressId: response.data.studentAddressId,
          AddressTypeId: response.data.addressTypeId,
          Address: response.data.address,
          CountryId: response.data.countryId,
          StateId: response.data.stateId,
          CityId: response.data.cityId,
          Pincode: response.data.pincode,
          StudentId: response.data.studentId,
          IsActive: response.data.isActive,
          CreatedAt: response.data.createdAt,
          CreatedBy: response.data.createdBy,
          LastUpdatedBy: user.userId,
        })
      })
      .catch((err) => {
        console.error('Get Student Address Get By Id : ', err);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      })
  }

  const GetAddressTypeList = () => {
    httpGet("AddressType/get")
      .then((response) => {
        console.log(response.data);
        setAddressTypeList(response.data);
      })
      .catch((error) => {
        console.error(error, "Get Address Type List Error");
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  }

  const GetCountryList = () => {
    httpGet("Country/get")
      .then((response) => {
        setCountryList(response.data);
      })
      .catch((error) => {
        console.error(error, "Get Country List Error");
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  }

  const fetchStateByCountryId = async (countryId) => {
    await httpGet(`State/getStateByCountryId?Id=${countryId}`)
      .then((response) => {
        setStateList(response.data)
      })
      .catch((error) => {
        console.error("Error Get State By Country Id", error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      })
  }

  const fetchCityByStateId = async (stateId) => {
    await httpGet(`City/getCityByStateId?Id=${stateId}`)
      .then((response) => {
        setCityList(response.data)
      })
      .catch((error) => {
        console.error("Error Get City By State Id", error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      })
  }
  const handleCountrySelect = (country) => {
    setCountryValue(country.countryId);
    setStudentAddress({ ...studentAddress, CountryId: country.countryId })
    fetchStateByCountryId(country.countryId);
  };
  const handleStateSelect = (state) => {
    setStateValue(state.stateId);
    setStudentAddress({ ...studentAddress, StateId: state.stateId })
    fetchCityByStateId(state.stateId);
  };
  const handleCitySelect = (city) => {
    setCityValue(city.cityId);
    setStudentAddress({ ...studentAddress, CityId: city.cityId })
  };

  const handleSaveStudentAddress = async () => {
    try {
      if (studentAddress.StudentAddressId !== 0) {
        await httpPost('StudentAddress/put', studentAddress)
          .then((response) => {
            if (response.status === 200) {
              Alert.alert('Success', 'Update Address Successfully')
              setStudentAddress({
                "StudentAddressId": 0,
                "AddressTypeId": "",
                "Address": "",
                "CountryId": "",
                "StateId": "",
                "CityId": "",
                "Pincode": "",
                "StudentId": studentId,
                "IsActive": true,
                "CreatedAt": null,
                "CreatedBy": user.userId,
                "LastUpdatedBy": null,
              })
              navigation.goBack();
            }
          })
          .catch((err) => {
            console.error("Address update error : ", err);
            Toast.show({
              type: 'error',
              text1: `${err}`,
              position: 'bottom',
              visibilityTime: 2000,
              autoHide: true,
            });
          });
      }
      else {
        await httpPost("StudentAddress/post", studentAddress)
          .then((response) => {
            if (response.status === 200) {
              Alert.alert('Success', 'Add Address Successfully')
              setStudentAddress({
                "StudentAddressId": 0,
                "AddressTypeId": "",
                "Address": "",
                "CountryId": "",
                "StateId": "",
                "CityId": "",
                "Pincode": "",
                "StudentId": studentId,
                "IsActive": true,
                "CreatedAt": null,
                "CreatedBy": user.userId,
                "LastUpdatedBy": null,
              })
              navigation.goBack();
            }
          })
          .catch((err) => {
            console.error('Address Add error :', err);
            Toast.show({
              type: 'error',
              text1: `${err}`,
              position: 'bottom',
              visibilityTime: 2000,
              autoHide: true,
            });
          });
      }
    }
    catch (error) {
      console.error('Error saving Address:', error);
      Toast.show({
        type: 'error',
        text1: `${error}`,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  }

  const handleCancel = () => {
    setStudentAddress({
      "StudentAddressId": 0,
      "AddressTypeId": "",
      "Address": "",
      "CountryId": "",
      "StateId": "",
      "CityId": "",
      "Pincode": "",
      "StudentId": studentId,
      "IsActive": true,
      "CreatedAt": null,
      "CreatedBy": user.userId,
      "LastUpdatedBy": null,
    })
    navigation.goBack();
  }
  return (
    <View style={{ flex: 1, padding: 10, }}>
      <View style={{
        backgroundColor: Colors.background,
        borderRadius: 8,
        padding: 16,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, }}>Student Address Form</Text>
          <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Address Type:</Text>
          <Dropdown
            style={[{
              height: 50,
              borderColor: Colors.primary,
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 8,
              marginBottom: 10,
            }, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={{ fontSize: 16, }}
            selectedTextStyle={{ fontSize: 16, }}
            inputSearchStyle={{
              height: 40,
              fontSize: 16,
            }}
            iconStyle={{
              width: 20,
              height: 20,
            }}
            data={addressTypeList}
            search
            maxHeight={300}
            labelField="addressTypeName"
            valueField="addressTypeId"
            placeholder={!isFocus ? 'Select Address Type' : '...'}
            searchPlaceholder="Search..."
            value={studentAddress.AddressTypeId}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(value) => setStudentAddress({ ...studentAddress, AddressTypeId: value.addressTypeId })}
          />
          <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Address :</Text>
          <TextInput
            style={[{
              borderWidth: 1,
              borderColor: Colors.primary,
              borderRadius: 5,
              paddingHorizontal: 10,
              paddingVertical: 8,
              marginBottom: 10,
              fontSize: 16,
            }, { height: 80, textAlignVertical: 'top', }]}
            value={studentAddress.Address}
            onChangeText={(value) => handleInputChange('Address', value)}
            placeholder="Enter Address"
            multiline
          />
          <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Country :</Text>
          <Dropdown
            style={[{
              height: 50,
              borderColor: Colors.primary,
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 8,
              marginBottom: 10,
            }, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={{ fontSize: 16, }}
            selectedTextStyle={{ fontSize: 16, }}
            inputSearchStyle={{
              height: 40,
              fontSize: 16,
            }}
            iconStyle={{
              width: 20,
              height: 20,
            }}
            data={countryList}
            search
            maxHeight={300}
            labelField="countryName"
            valueField="countryId"
            placeholder={!isFocus ? 'Select Country' : '...'}
            searchPlaceholder="Search..."
            value={countryValue}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={handleCountrySelect}
          />
          <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>State :</Text>
          <Dropdown
            style={[{
              height: 50,
              borderColor: Colors.primary,
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 8,
              marginBottom: 10,
            }, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={{ fontSize: 16, }}
            selectedTextStyle={{ fontSize: 16, }}
            inputSearchStyle={{
              height: 40,
              fontSize: 16,
            }}
            iconStyle={{
              width: 20,
              height: 20,
            }}
            data={stateList}
            search
            maxHeight={300}
            labelField="stateName"
            valueField="stateId"
            placeholder={!isFocus ? 'Select State' : '...'}
            searchPlaceholder="Search..."
            value={stateValue}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={handleStateSelect}
          />
          <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>City :</Text>
          <Dropdown
            style={[{
              height: 50,
              borderColor: Colors.primary,
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 8,
              marginBottom: 10,
            }, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={{ fontSize: 16, }}
            selectedTextStyle={{ fontSize: 16, }}
            inputSearchStyle={{
              height: 40,
              fontSize: 16,
            }}
            iconStyle={{
              width: 20,
              height: 20,
            }}
            data={cityList}
            search
            maxHeight={300}
            labelField="cityName"
            valueField="cityId"
            placeholder={!isFocus ? 'Select City' : '...'}
            searchPlaceholder="Search..."
            value={cityValue}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={handleCitySelect}
          />

          <Text style={{ fontSize: 16, marginBottom: 5, color: Colors.secondary }}>Pincode :</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: Colors.primary,
              borderRadius: 5,
              paddingHorizontal: 10,
              paddingVertical: 8,
              marginBottom: 10,
              fontSize: 16,
            }}
            value={studentAddress.Pincode.toString()}
            onChangeText={(value) => setStudentAddress({ ...studentAddress, Pincode: isNaN(parseInt(value)) ? "" : parseInt(value) })}
            placeholder="Enter Pincode"
            keyboardType="numeric"
          />

          <TouchableOpacity style={{
            backgroundColor: Colors.primary,
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
            alignItems: 'center',
          }} onPress={handleSaveStudentAddress}>
            <Text style={{ color: Colors.background, fontSize: 16, fontWeight: 'bold', }}>{studentAddress.StudentAddressId !== 0 ? "Save" : "Add"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            backgroundColor: '#f25252',
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
            alignItems: 'center',
          }} onPress={handleCancel}>
            <Text style={{ color: Colors.background, fontSize: 16, fontWeight: 'bold', }}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </View>
    </View>
  );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//     },
//     label: {
//         fontSize: 16,
//         marginBottom: 5,
//         color: Colors.secondary
//     },
//     card: {
//         backgroundColor: 'white',
//         borderRadius: 8,
//         padding: 16,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//         elevation: 2,
//     },
//     cardTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 16,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: Colors.primary,
//         borderRadius: 5,
//         paddingHorizontal: 10,
//         paddingVertical: 8,
//         marginBottom: 10,
//         fontSize: 16,
//     },
//     textArea: {
//         height: 80,
//         textAlignVertical: 'top',
//     },
//     dropdownContainer: {
//         borderWidth: 1,
//         borderColor: Colors.primary,
//         borderRadius: 5,
//         paddingHorizontal: 10,
//         paddingVertical: 8,
//         marginBottom: 10,
//         position: 'relative',
//         zIndex: 1,
//     },
//     dropdownText: {
//         fontSize: 16,
//     },
//     dropdown: {
//         position: 'absolute',
//         top: 40,
//         left: 0,
//         right: 0,
//         borderWidth: 1,
//         borderColor: Colors.primary,
//         backgroundColor: '#fff',
//         borderRadius: 5,
//         padding: 10,
//         marginTop: 5,
//     },
//     dropdownOption: {
//         paddingVertical: 8,
//     },
//     dropdownOptionText: {
//         fontSize: 16,
//     },
//     submitButton: {
//         backgroundColor: Colors.primary,
//         padding: 10,
//         borderRadius: 5,
//         marginTop: 10,
//         alignItems: 'center',
//     },
//     cancelButton: {
//         backgroundColor: '#f25252',
//         padding: 10,
//         borderRadius: 5,
//         marginTop: 10,
//         alignItems: 'center',
//     },
//     submitButtonText: {
//         color: Colors.background,
//         fontSize: 16,
//         fontWeight: 'bold',
//     }
// });

export default StudentAddressFormScreen;
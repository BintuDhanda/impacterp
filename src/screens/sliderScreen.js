import {UserContext} from '../../App';
import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {FlatList} from '@src/components/flatlist';
import {Dropdown} from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';
import {
  Get as httpGet,
  PostformData as PostForm,
} from '../constants/httpService';
import ImageCropPicker from 'react-native-image-crop-picker';
import Colors from '../constants/Colors';
import {News_URL} from '../constants/constant';

const SliderScreen = ({navigation}) => {
  const {user, setUser} = useContext(UserContext);
  const [sliderList, setSliderList] = useState([]);
  const [slider, setSlider] = useState({
    SliderId: 0,
    SliderImage: '',
    OrderBy: '',
    IsActive: true,
    CreatedAt: null,
    CreatedBy: user.userId,
    LastUpdatedBy: null,
  });
  const [identityTypeList, setIdentityTypeList] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(null);
  const selectPhotoFromGallery = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImage(image.path);
      setType(image.mime);
    });
  };
  const [SliderDeleteId, setSliderDeleteId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const toggleStatusDropdown = () => {
    setShowStatusDropdown(!showStatusDropdown);
  };

  const selectStatus = selectedStatus => {
    setSlider(prevSlider => ({
      ...prevSlider,
      StringStatus: selectedStatus,
    }));
    setShowStatusDropdown(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      GetSliderList();
    }, []),
  );

  const GetSliderList = () => {
    httpGet('Slider/get')
      .then(response => {
        console.log(response.data, 'Slider list');
        setSliderList(response.data);
      })
      .catch(error => {
        console.error(error, 'slider list');
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };
  const GetSliderById = SliderId => {
    httpGet(`Slider/getById?Id=${SliderId}`)
      .then(response => {
        console.log(response.data, 'Get Slider By id');
        setSlider({
          SliderId: response.data.sliderId,
          SliderImage: response.data.sliderImage,
          OrderBy: response.data.orderBy.toString(),
          IsActive: response.data.isActive,
          CreatedAt: response.data.createdAt,
          CreatedBy: response.data.createdBy,
          LastUpdatedBy: user.userId,
        });
      })
      .catch(err => {
        console.error('Get Slider Get By Id Error : ', err);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };
  const handleSaveSlider = async () => {
    try {
      if (slider.SliderId !== 0) {
        console.log(JSON.stringify(slider), 'Form data request');
        const sliderdata = new FormData();
        sliderdata.append('SliderId', slider.SliderId);
        sliderdata.append('SliderImage', '');
        sliderdata.append('OrderBy', slider.OrderBy);
        sliderdata.append('IsActive', slider.IsActive);
        sliderdata.append('CreatedAt', slider.CreatedAt);
        sliderdata.append('CreatedBy', slider.CreatedBy);
        sliderdata.append('LastUpdatedBy', slider.LastUpdatedBy);
        if (image) {
          const imageUriParts = image.split('/');
          const imageName = imageUriParts[imageUriParts.length - 1];
          console.log(imageName, 'Get Image Name');
          const imageFile = {
            uri: image,
            type: type, // Adjust the type according to your image
            name: imageName, // Adjust the file name if needed
          };
          sliderdata.append('Image', imageFile);
        }
        await PostForm('Slider/put', sliderdata)
          .then(response => {
            if (response.status === 200) {
              Alert.alert('Success', 'Update Slider Successfully');
              setSlider({
                SliderId: 0,
                SliderImage: '',
                OrderBy: '',
                IsActive: true,
                CreatedAt: null,
                CreatedBy: user.userId,
                LastUpdatedBy: null,
              });
              navigation.navigate('HomeScreen');
            }
          })
          .catch(err => {
            console.error('Slider update error : ', err);
            Toast.show({
              type: 'error',
              text1: `${err}`,
              position: 'bottom',
              visibilityTime: 2000,
              autoHide: true,
            });
          });
      } else {
        const sliderdata = new FormData();
        sliderdata.append('SliderId', slider.SliderId);
        sliderdata.append('SliderImage', '');
        sliderdata.append('OrderBy', slider.OrderBy);
        sliderdata.append('IsActive', slider.IsActive);
        sliderdata.append('CreatedAt', slider.CreatedAt);
        sliderdata.append('CreatedBy', slider.CreatedBy);
        sliderdata.append('LastUpdatedBy', slider.LastUpdatedBy);
        if (image) {
          const imageUriParts = image.split('/');
          const imageName = imageUriParts[imageUriParts.length - 1];
          console.log(imageName, 'Get Image Name');
          const imageFile = {
            uri: image,
            type: type, // Adjust the type according to your image
            name: imageName, // Adjust the file name if needed
          };
          sliderdata.append('Image', imageFile);
          console.log(sliderdata, 'sliderData');
        }
        await PostForm('Slider/post', sliderdata)
          .then(response => {
            if (response.status === 200) {
              Alert.alert('Success', 'Add Slider Successfully');
              setSlider({
                SliderId: 0,
                SliderImage: '',
                OrderBy: '',
                IsActive: true,
                CreatedAt: null,
                CreatedBy: user.userId,
                LastUpdatedBy: null,
              });
              navigation.navigate('HomeScreen');
            }
          })
          .catch(err => {
            console.error('Slider Add error :', err);
            Toast.show({
              type: 'error',
              text1: `${err}`,
              position: 'bottom',
              visibilityTime: 2000,
              autoHide: true,
            });
          });
      }
    } catch (error) {
      console.error('Error saving Slider :', error);
      Toast.show({
        type: 'error',
        text1: `${error}`,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const DeleteSliderIdConfirm = Sliderid => {
    setSliderDeleteId(Sliderid);
  };

  const DeleteSliderIdConfirmYes = () => {
    httpGet(`Slider/delete?Id=${SliderDeleteId}`)
      .then(result => {
        console.log(result);
        GetSliderList();
        setSliderDeleteId(0);
        setShowDelete(false);
      })
      .catch(error => {
        console.error('Delete Student Identities error', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const DeleteSliderIdConfirmNo = () => {
    setSliderDeleteId(0);
    setShowDelete(false);
  };

  const renderIdentitiesCard = ({item}) => (
    <View
      style={{
        justifyContent: 'space-between',
        backgroundColor: Colors.background,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        shadowColor: Colors.shadow,
        shadowOffset: {width: 10, height: 2},
        shadowOpacity: 4,
        shadowRadius: 10,
        elevation: 10,
        borderWidth: 1.5,
        borderColor: Colors.primary,
      }}>
      <Image
        source={
          item.sliderImage == null || item.sliderImage == ''
            ? require('../icons/user.png')
            : {uri: News_URL + item.sliderImage}
        }
        style={{width: 'auto', aspectRatio: 16 / 9, marginBottom: 10}}
      />
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Order By : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
          {item.orderBy}
        </Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <TouchableOpacity
          style={{marginRight: 10}}
          onPress={() => {
            GetSliderById(item.sliderId);
            setShowModal(true);
          }}>
          <Icon
            name="pencil"
            size={20}
            color={'#5a67f2'}
            style={{marginLeft: 8, textAlignVertical: 'center'}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            DeleteSliderIdConfirm(item.sliderId), setShowDelete(true);
          }}>
          <Icon
            name="trash"
            size={20}
            color={'#f25252'}
            style={{marginRight: 8, textAlignVertical: 'center'}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View
        style={{
          padding: 16,
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
          onPress={() => {
            setShowModal(true);
          }}>
          <Text
            style={{
              color: Colors.background,
              fontSize: 14,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Add Slider
          </Text>
        </TouchableOpacity>

        {showModal && (
          <Modal transparent visible={showModal}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: Colors.background,
                  borderRadius: 10,
                  padding: 20,
                  width: '80%',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    marginBottom: 10,
                    color: Colors.shadow,
                    fontWeight: 'bold',
                  }}>
                  Slider
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 10,
                    justifyContent: 'space-between',
                  }}>
                  {image && (
                    <Image
                      source={{uri: image}}
                      style={{width: 200, height: 200, borderRadius: 10}}
                    />
                  )}
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={{justifyContent: 'flex-end'}}
                      onPress={selectPhotoFromGallery}>
                      <Icon
                        name="image"
                        size={30}
                        color={'#f25252'}
                        style={{marginRight: 8, textAlignVertical: 'center'}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <Image
                  source={
                    slider.SliderImage == null || slider.SliderImage == ''
                      ? require('../icons/user.png')
                      : {uri: News_URL + slider.SliderImage}
                  }
                  style={{width: 100, height: 100, marginBottom: 10}}
                />
                <Text
                  style={{
                    fontSize: 16,
                    marginBottom: 5,
                    color: Colors.secondary,
                  }}>
                  Order By :
                </Text>
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
                  value={slider.OrderBy}
                  onChangeText={value => setSlider({...slider, OrderBy: value})}
                  placeholder="Enter Order By"
                  keyboardType="numeric"
                />
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.primary,
                      borderRadius: 5,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      marginTop: 10,
                      marginRight: 3,
                    }}
                    onPress={() => {
                      handleSaveSlider();
                    }}>
                    <Text style={{fontSize: 16, color: Colors.background}}>
                      {slider.SliderId == 0 ? 'Add' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#f25252',
                      borderRadius: 5,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      marginTop: 10,
                    }}
                    onPress={() => {
                      setShowModal(false);
                    }}>
                    <Text style={{fontSize: 16, color: Colors.background}}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {showDelete && (
          <Modal transparent visible={showDelete}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: Colors.background,
                  borderRadius: 10,
                  padding: 28,
                  shadowColor: Colors.shadow,
                  width: '80%',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 5,
                    alignSelf: 'center',
                    fontWeight: 'bold',
                  }}>
                  Are You Sure You Want To Delete
                </Text>

                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.primary,
                      borderRadius: 5,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      marginTop: 10,
                      marginRight: 3,
                    }}
                    onPress={() => {
                      DeleteSliderIdConfirmYes();
                    }}>
                    <Text style={{fontSize: 16, color: Colors.background}}>
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#f25252',
                      borderRadius: 5,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      marginTop: 10,
                    }}
                    onPress={() => {
                      DeleteSliderIdConfirmNo();
                    }}>
                    <Text style={{fontSize: 16, color: Colors.background}}>
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        <FlatList
          data={sliderList}
          keyExtractor={item => item.sliderId.toString()}
          renderItem={renderIdentitiesCard}
        />
        <Toast ref={ref => Toast.setRef(ref)} />
      </View>
    </ScrollView>
  );
};

export default SliderScreen;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: 'white',
//     padding: 16,
//     justifyContent: 'center'
//   },
//   dropdown: {
//     height: 50,
//     borderColor: 'gray',
//     borderWidth: 0.5,
//     borderRadius: 8,
//     paddingHorizontal: 8,
//   },
//   addButton: {
//     backgroundColor: '#5a67f2',
//     borderRadius: 5,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     marginTop: 10,
//     alignSelf: 'flex-start',
//   },
//   addButtonText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   icon: {
//     marginRight: 5,
//   },
//   label: {
//     position: 'absolute',
//     backgroundColor: 'white',
//     left: 22,
//     top: 8,
//     zIndex: 999,
//     paddingHorizontal: 8,
//     fontSize: 14,
//   },
//   placeholderStyle: {
//     fontSize: 16,
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//   },
//   iconStyle: {
//     width: 20,
//     height: 20,
//   },
//   inputSearchStyle: {
//     height: 40,
//     fontSize: 16,
//   },
//   identitiesCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#ccc',
//     borderRadius: 10,
//     padding: 20,
//     marginBottom: 10,
//     marginTop: 10,
//     shadowColor: '#000000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   identitiesName: {
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
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     padding: 20,
//     width: '80%',
//   },
//   modalTextInput: {
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 8,
//     padding: 8,
//     marginBottom: 20,
//   },
//   modalButtonContainer: {
//     marginTop: 10,
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//   },
//   modalSaveButton: {
//     backgroundColor: '#5a67f2',
//     borderRadius: 5,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   modalCancelButton: {
//     backgroundColor: '#f25252',
//     borderRadius: 5,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     marginLeft: 10
//   },
//   modalButtonText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
// });

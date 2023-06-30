import React, { useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { RNCamera } from 'react-native-camera';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';

const CameraScreen = () => {
  const cameraRef = useRef(null);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const { uri } = await cameraRef.current.takePictureAsync(options);
      uploadPhoto(uri);
    }
  };

  const pickPhoto = () => {
    const options = {
      title: 'Select Photo',
      mediaType: 'photo',
      quality: 0.5,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.uri) {
        uploadPhoto(response.uri);
      }
    });
  };

  const uploadPhoto = (uri) => {
    const formData = new FormData();
    formData.append('photo', {
      uri: uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    axios.post('YOUR_UPLOAD_URL', formData)
      .then((response) => {
        console.log('Upload successful!', response.data);
      })
      .catch((error) => {
        console.error('Upload failed!', error);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        ref={cameraRef}
        style={{ flex: 1 }}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        captureAudio={false}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity onPress={takePhoto}>
          <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
            Take Photo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickPhoto}>
          <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
            Choose Photo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CameraScreen;
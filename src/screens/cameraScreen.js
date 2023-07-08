import React, { useState } from 'react';
import { View, Button, Image, TextInput } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';

const CameraScreen = () => {
  const [image, setImage] = useState(null);
  // const [video, setVideo] = useState(null);
  const [newsText, setNewsText] = useState('');
  const [newsTitle, setNewsTitle] = useState('');

  const selectImage = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.uri };
        setImage(source);
      }
    });
  };

  // const selectVideo = () => {
  //   const options = {
  //     title: 'Select Video',
  //     mediaType: 'video',
  //     storageOptions: {
  //       skipBackup: true,
  //       path: 'videos',
  //     },
  //   };

  //   ImagePicker.launchImageLibrary(options, (response) => {
  //     if (response.didCancel) {
  //       console.log('User cancelled video picker');
  //     } else if (response.error) {
  //       console.log('VideoPicker Error: ', response.error);
  //     } else {
  //       const source = { uri: response.uri };
  //       setVideo(source);
  //     }
  //   });
  // };

  const uploadNews = () => {
    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      type: 'image/jpeg',
      name: 'newsImage.jpg',
    });
    // formData.append('video', {
    //   uri: video.uri,
    //   type: 'video/mp4',
    //   name: 'newsVideo.mp4',
    // });
    formData.append('newsText', newsText);
    formData.append('newsTitle', newsTitle);

    axios.post('YOUR_API_ENDPOINT', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        // Handle successful news submission
        console.log('News uploaded successfully');
      })
      .catch((error) => {
        // Handle error
        console.log('News upload error: ', error);
      });
  };

  return (
    <View>
      {image && <Image source={image} style={{ width: 200, height: 200 }} />}
      <Button title="Select Image" onPress={selectImage} />
      {/* {video && <Video source={video} style={{ width: 200, height: 200 }} />}
      <Button title="Select Video" onPress={selectVideo} /> */}
      <TextInput
        value={newsText}
        onChangeText={setNewsText}
        placeholder="News Text"
      />
      <TextInput
        value={newsTitle}
        onChangeText={setNewsTitle}
        placeholder="News Title"
      />
      <Button title="Upload News" onPress={uploadNews} />
    </View>
  );
};

export default CameraScreen;
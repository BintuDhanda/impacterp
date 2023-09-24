import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const QRCodeScannerScreen = () =>  {
  // onRead = (e) => {
  //   // e.data will contain the scanned QR code data
  //   console.log('Scanned QR Code:', e.data);
  //   // You can handle the scanned data as needed, e.g., navigate to a new screen
  // }
  const [data, SetData] = useState('scan Something')

    return (
      // <View style={styles.container}>
        <QRCodeScanner
          onRead={({data}) => SetData(data)}
          reactivate={true}
          reactivateTimeout={500}
          showMarker={true}
          topContent={
          <View>
            <Text style={{
              color:'black',
              padding:20,
              fontSize:20,
              backgroundColor:'grey',
              margin:10,
            }}>{data}</Text>
          </View>
          }
          // cameraStyle={styles.cameraContainer}
          // containerStyle={styles.containerStyle}
          bottomContent={
            <View>
              <Text>{data}</Text>
            </View>
          }
        />
      // </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    height: 100, // Adjust the height as needed
  },
  containerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QRCodeScannerScreen;
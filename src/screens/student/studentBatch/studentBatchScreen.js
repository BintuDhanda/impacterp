import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Colors from '../../../constants/Colors';
import { useFocusEffect } from '@react-navigation/native';

const StudentBatchScreen = ({route, navigation}) => {
  const {studentId} = route.params;
  const [batchList, setBatchList] = useState([]);
  
  useFocusEffect(
    React.useCallback(() => {
      GetStudentBatchByStudentId();
    }, [])
  );

  const GetStudentBatchByStudentId = () => {
    axios.get(`http://192.168.1.7:5291/api/StudentBatch/getStudentBatchByStudentId?Id=${studentId}`, {
      headers: {
        'Content-Type': 'application/json', // Example header
        'User-Agent': 'react-native/0.64.2', // Example User-Agent header
      },
    })
      .then((response) => {
        console.log(response.data);
        setBatchList(response.data);
      })
      .catch((error) => {
        console.error(error, "Get Student Batch By Student Id Error");
      });
  }

  const handleAddStudentBatchNavigate = () => {
    navigation.navigate('StudentBatchFormScreen', {studentId: studentId})
  };

  const handleEditStudentBatchNavigate = (batchId) => {
    navigation.navigate('StudentBatchFormScreen', {studentId: studentId, batchId: batchId})
  }
  const handleBatchFeeNavigate = (studentBatchId) => {
    navigation.navigate('StudentBatchFeesScreen', {studentId: studentId, studentBatchId: studentBatchId})
  }

  const handleDeleteStudentBatch = (id) => {
    axios.delete(`http://192.168.1.7:5291/api/StudentBatch/delete?Id=${id}`)
      .then((result) => {
        console.log(result);
        GetStudentBatchByStudentId();
      })
      .catch(err => console.error("Delete Error", err));
  }

  const getFormattedDate = (datestring) => {
    const datetimeString = datestring;
    const date = new Date(datetimeString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

  const renderTokenCard = ({ item }) => (
    <View style={{
      justifyContent: 'space-between',
      backgroundColor: Colors.background,
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      marginTop: 10,
      shadowColor: Colors.shadow,
      shadowOffset: { width: 10, height: 2 },
      shadowOpacity: 4,
      shadowRadius: 10,
      elevation: 10,
      borderWidth: 0.5,
      borderColor: Colors.primary,
    }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 16 }}>Batch Name : </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.batchName}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 16 }}>Date Of Join : </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{getFormattedDate(item.dateOfJoin)}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 16 }}>Batch Start Date : </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{getFormattedDate(item.batchStartDate)}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 16 }}>Batch End Date : </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{getFormattedDate(item.batchEndDate)}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <TouchableOpacity style={{
          backgroundColor: '#5a67f2',
          borderRadius: 5,
          paddingVertical: 8,
          paddingHorizontal: 12,
          marginRight: 10,
        }} onPress={() => handleEditStudentBatchNavigate(item.id)}>
          <Text style={{
            color: Colors.background,
            fontSize: 14,
            fontWeight: 'bold',
          }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          backgroundColor: Colors.primary,
          borderRadius: 5,
          paddingVertical: 8,
          paddingHorizontal: 12,
          marginRight: 10,
        }} onPress={() => handleBatchFeeNavigate(item.id)}>
          <Text style={{
            color: Colors.background,
            fontSize: 14,
            fontWeight: 'bold',
          }}>Batch Fee</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          backgroundColor: '#f25252',
          borderRadius: 5,
          paddingVertical: 8,
          paddingHorizontal: 12,
        }} onPress={() => handleDeleteStudentBatch(item.id)}>
          <Text style={{
            color: Colors.background,
            fontSize: 14,
            fontWeight: 'bold',
          }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{
        padding: 16,
        justifyContent: 'center'
      }}>
        <TouchableOpacity style={{
          backgroundColor: Colors.primary,
          borderRadius: 5,
          paddingVertical: 10,
          paddingHorizontal: 20,
          marginBottom: 20,
        }} onPress={handleAddStudentBatchNavigate}>
          <Text style={{
            color: Colors.background,
            fontSize: 14,
            fontWeight: 'bold',
            textAlign: 'center'
          }}>Add Batch</Text>
        </TouchableOpacity>
        <FlatList
          data={batchList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTokenCard}
        />
      </View>
    </ScrollView>
  );
};

export default StudentBatchScreen;

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
//   batchCard: {
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
//   batchName: {
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
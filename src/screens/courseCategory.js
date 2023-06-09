import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Alert, ScrollView } from 'react-native';
import Colors from '../constants/Colors';

const CourseCategoryScreen = () => {
  const [courseCategory, setCourseCategory] = useState({ "Id": 0, "CourseCategoryName": "", "IsActive": true });
  const [courseCategoryList, setCourseCategoryList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    GetCourseCategoryList();
  }, []);
  const GetCourseCategoryList = () => {
    axios.get("http://192.168.1.11:5291/api/CourseCategory/get", {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((result) => {
        console.log(result.data)
        setCourseCategoryList(result.data)
      })
      .catch(err => console.log('Get CourseCategory error :', err))
  }
  const handleAddCourseCategory = () => {
    setCourseCategory({
      Id: 0,
      CourseCategoryName: "",
      IsActive: true,
    });
    setModalVisible(true);
  };

  const handleSaveCourseCategory = () => {
    try {
      if (courseCategory.Id !== 0) {
        axios.put(`http://192.168.1.11:5291/api/CourseCategory/put`, JSON.stringify(courseCategory), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            if (response.status === 200) {
              GetCourseCategoryList();
              Alert.alert('Sucees', 'Update CourseCategory Successfully')
              setCourseCategory({
                "Id": 0,
                "CourseCategoryName": "",
                "IsActive": true
              })
            }
          })
          .catch(err => console.log("CourseCategory update error : ", err));
      }
      else {
        axios.post(`http://192.168.1.11:5291/api/CourseCategory/post`, JSON.stringify(courseCategory), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            if (response.status === 200) {
              GetCourseCategoryList();
              Alert.alert('Success', 'Add CourseCategory Successfully')
              setCourseCategory({
                "Id": 0,
                "CourseCategoryName": "",
                "IsActive": true
              })
            }
          })
          .catch(err => console.log('CourseCategory Add error :', err));
      }
      setModalVisible(false);
    }
    catch (error) {
      console.log('Error saving CourseCategory:', error);
    }
  }

  const handleDeleteCourseCategory = (courseCategoryId) => {
    axios.delete(`http://192.168.1.11:5291/api/CourseCategory/delete?Id=${courseCategoryId}`)
      .then((result) => {
        console.log(result);
        GetCourseCategoryList();
      })
      .catch(err => console.error("Delete Error", err));
  };

  const handleEditCourseCategory = (courseCategoryId) => {
    axios.get(`http://192.168.1.11:5291/api/CourseCategory/getById?Id=${courseCategoryId}`)
      .then((response) => {
        setCourseCategory({
          Id: response.data.id,
          CourseCategoryName: response.data.courseCategoryName,
          IsActive: response.data.isActive
        })
      })
      .catch(error => console.log('CourseCategory Get By Id :', error))
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  }

  const renderCourseCategoryCard = ({ item }) => {
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.background,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 10, height: 2 },
        shadowOpacity: 4,
        shadowRadius: 10,
        elevation: 10,
        borderWidth: 0.5,
        borderColor: Colors.primary
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold',
        }}>{item.courseCategoryName}</Text>
        <View style={{ flexDirection: 'row', }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#5a67f2',
              borderRadius: 5,
              paddingVertical: 8,
              paddingHorizontal: 12,
              marginRight: 10,
            }} onPress={() => handleEditCourseCategory(item.id)} >
            <Text style={{
              color: Colors.background,
              fontSize: 14,
              fontWeight: 'bold',
            }}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#f25252',
              borderRadius: 5,
              paddingVertical: 8,
              paddingHorizontal: 12,
            }}
            onPress={() => handleDeleteCourseCategory(item.id)}
          >
            <Text style={{
              color: Colors.background,
              fontSize: 14,
              fontWeight: 'bold',
            }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View >
    );
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, padding: 20, }}>
        <TouchableOpacity style={{
          backgroundColor: Colors.primary,
          borderRadius: 5,
          paddingVertical: 10,
          paddingHorizontal: 20,
          marginBottom: 20,
        }} onPress={handleAddCourseCategory}>
          <Text style={{
            color: Colors.background,
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>Add Course Category</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
            <View style={{
              backgroundColor: Colors.background,
              borderRadius: 10,
              padding: 20,
              width: '80%',
              marginBottom: 20,
            }}>
              <TextInput
                style={{
                  width: '100%',
                  height: 40,
                  borderWidth: 1,
                  borderColor: Colors.primary,
                  marginBottom: 10,
                  paddingHorizontal: 10,
                }}
                placeholder="Course Category Name"
                value={courseCategory.CourseCategoryName}
                onChangeText={(text) => setCourseCategory({ ...courseCategory, CourseCategoryName: text })}
              />

              <TouchableOpacity style={{
                backgroundColor: Colors.primary,
                borderRadius: 5,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginBottom: 10,
              }} onPress={handleSaveCourseCategory}>
                <Text style={{
                  color: Colors.background,
                  fontSize: 16,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>{courseCategory.Id !== 0 ? 'Save' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#f25252',
                borderRadius: 5,
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}
              onPress={handleClose}
            >
              <Text style={{
                color: Colors.background,
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <FlatList
          data={courseCategoryList}
          renderItem={renderCourseCategoryCard}
          keyExtractor={(item) => item.id.toString()}
        // contentContainerStyle={{ flexGrow: 1, }}
        />
      </View>
    </ScrollView>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   addButton: {
//     backgroundColor: '#5a67f2',
//     borderRadius: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   addButtonLabel: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     padding: 20,
//     width: '80%',
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     height: 40,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
//   addModalButton: {
//     backgroundColor: '#5a67f2',
//     borderRadius: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginBottom: 10,
//   },
//   addModalButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   closeModalButton: {
//     backgroundColor: '#f25252',
//     borderRadius: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   closeModalButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   courseCategoryList: {
//     flexGrow: 1,
//   },
//   courseCategoryCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     padding: 20,
//     marginBottom: 10,
//     shadowColor: '#000000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   courseCategoryName: {
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
// });

export default CourseCategoryScreen;
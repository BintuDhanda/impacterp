import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import Colors from '../constants/Colors';

const CourseScreen = () => {
  const [course, setCourse] = useState({ "Id": 0, "CourseName": "", "Fees": "", "Duration": "", "IsActive": true, "CourseCategoryId": "" });
  const [courseCategoryData, setCourseCategoryData] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    GetCourseCategoryList();
  }, []);

  console.log(course, "course")
  const GetCourseCategoryList = () => {
    axios.get('http://192.168.1.7:5291/api/CourseCategory/get', {
      headers: {
        'Content-Type': 'application/json', // Example header
        'User-Agent': 'react-native/0.64.2', // Example User-Agent header
      },
    })
      .then((response) => {
        console.log(response.data);
        const courseCategoryArray = response.data.map((courseCategory) => ({
          value: courseCategory.id,
          label: courseCategory.courseCategoryName,
        }));
        setCourseCategoryData(courseCategoryArray);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const fetchCoursesByCourseCategoryId = async (courseCategoryId) => {
    try {
      const response = await axios.get(`http://192.168.1.7:5291/api/Course/getCourseByCourseCategoryId?Id=${courseCategoryId}`, {
        headers: {
          'Content-Type': 'application/json', // Example header
          'User-Agent': 'react-native/0.64.2', // Example User-Agent header
        },
      });
      setCourseList(response.data);
      console.log(courseList, 'courseList')
    } catch (error) {
      console.log('Error fetching Courses:', error);
    }
  };
  const handleCourseCategorySelect = (courseCategory) => {
    setValue(courseCategory.value);
    fetchCoursesByCourseCategoryId(courseCategory.value);
  };


  const handleAddCourse = () => {
    setCourse({
      Id: 0,
      CourseName: "",
      Fees: "",
      Duration: "",
      IsActive: true,
      CourseCategoryId: ""
    });
    setModalVisible(true);
  };

  const handleEditCourse = (id) => {
    axios.get(`http://192.168.1.7:5291/api/Course/getById?Id=${id}`)
      .then((result) => {
        console.log(result);
        setCourse(
          {
            Id: result.data.id,
            CourseName: result.data.courseName,
            Fees: result.data.fees,
            Duration: result.data.duration,
            CourseCategoryId: result.data.courseCategoryId,
            IsActive: result.data.isActive
          }
        );
      })
      .catch(err => console.error("Get By Id Error", err));
    setModalVisible(true);
  };

  const handleDeleteCourse = (id) => {
    axios.delete(`http://192.168.1.7:5291/api/Course/delete?Id=${id}`)
      .then((result) => {
        console.log(result);
        fetchCoursesByCourseCategoryId(result.data.courseCategoryId)
      })
      .catch(err => console.error("Delete Error", err));
  }

  const handleSaveCourse = async () => {
    try {
      if (course.Id !== 0) {
        await axios.put(`http://192.168.1.7:5291/api/Course/put`, JSON.stringify(course), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            if (response.status === 200) {
              fetchCoursesByCourseCategoryId(response.data.courseCategoryId);
              Alert.alert('Sucess', 'Data fetched successfully');
              setCourse({
                "Id": 0,
                "CourseName": "",
                "Fees": "",
                "Duration": "",
                "CourseCategoryId": "",
                "IsActive": true
              });
            }
          })
          .catch(err => console.error("Post error in Course", err));
      } else {
        await axios.post('http://192.168.1.7:5291/api/Course/post', JSON.stringify(course), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            if (response.status === 200) {
              fetchCoursesByCourseCategoryId(response.data.courseCategoryId);
              Alert.alert('Sucess', 'Course is Added Successfully')
              setCourse({
                "Id": 0,
                "CourseName": "",
                "Fees": "",
                "Duration": "",
                "CourseCategoryId": "",
                "IsActive": true
              });
            }
          })
      }
      setModalVisible(false);
    } catch (error) {
      console.log('Error saving Course:', error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };


  const renderCourseCard = ({ item }) => (
    <View style={{
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
      borderColor: Colors.primary
    }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 16 }}>Course Name : </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.courseName}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 16 }}>Fees : </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.fees}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 16 }}>Duration : </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, }}>{item.duration}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
        <TouchableOpacity style={{
          backgroundColor: '#5a67f2',
          borderRadius: 5,
          paddingVertical: 8,
          paddingHorizontal: 12,
          marginRight: 10,
        }} onPress={() => handleEditCourse(item.id)}>
          <Text style={{
            color: Colors.background,
            fontSize: 14,
            fontWeight: 'bold',
          }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          backgroundColor: '#f25252',
          borderRadius: 5,
          paddingVertical: 8,
          paddingHorizontal: 12,
        }} onPress={() => handleDeleteCourse(item.id)}>
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
        <Dropdown
          style={[{
            height: 50,
            borderColor: Colors.primary,
            borderWidth: 0.5,
            borderRadius: 8,
            paddingHorizontal: 8,
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
          data={courseCategoryData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select Course Category' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={handleCourseCategorySelect}
        />
        <TouchableOpacity style={{
          backgroundColor: Colors.primary,
          borderRadius: 5,
          paddingVertical: 8,
          paddingHorizontal: 12,
          marginTop: 10,
          alignSelf: 'flex-start',
        }} onPress={handleAddCourse}>
          <Text style={{
            color: Colors.background,
            fontSize: 14,
            fontWeight: 'bold',
          }}>Add Course</Text>
        </TouchableOpacity>
        <FlatList
          data={courseList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCourseCard}
        />

        {modalVisible && (
          <Modal transparent visible={modalVisible}>
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <View style={{
                backgroundColor: Colors.background,
                borderRadius: 10,
                padding: 20,
                width: '80%',
              }}>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.primary,
                    borderRadius: 8,
                    padding: 8,
                    marginBottom: 20,
                  }}
                  placeholder="Course Name"
                  value={course.CourseName}
                  onChangeText={(text) => setCourse({ ...course, CourseName: text })}
                />
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.primary,
                    borderRadius: 8,
                    padding: 8,
                    marginBottom: 20,
                  }}
                  placeholder="Fees"
                  value={course.Fees.toString()}
                  keyboardType='numeric'
                  onChangeText={(text) => setCourse({ ...course, Fees: text })}
                />
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.primary,
                    borderRadius: 8,
                    padding: 8,
                    marginBottom: 20,
                  }}
                  placeholder="Duration"
                  value={course.Duration}
                  onChangeText={(text) => setCourse({ ...course, Duration: text })}
                />
                <Dropdown
                  style={[{
                    height: 50,
                    borderColor: Colors.primary,
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 8,
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
                  data={courseCategoryData}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? 'Select item' : '...'}
                  searchPlaceholder="Search..."
                  value={course.CourseCategoryId}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(value) => setCourse({ ...course, CourseCategoryId: value.value })}
                />
                <View style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>
                  <TouchableOpacity style={{
                    backgroundColor: Colors.primary,
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                  }} onPress={handleSaveCourse}>
                    <Text style={{
                      color: Colors.background,
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}>{course.Id === 0 ? 'Add' : 'Save'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{
                    backgroundColor: '#f25252',
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginLeft: 10
                  }} onPress={handleCloseModal}>
                    <Text style={{
                      color: Colors.background,
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </ScrollView>
  );
};

export default CourseScreen;

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
//   courseCard: {
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
//   courseName: {
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
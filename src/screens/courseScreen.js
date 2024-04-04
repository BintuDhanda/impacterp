import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {FlatList} from '@src/components/flatlist';
import Colors from '../constants/Colors';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import {UserContext} from '../../App';
import {useContext} from 'react';
import {Get as httpGet, Post as httpPost} from '../constants/httpService';

const CourseScreen = ({route, navigation}) => {
  const {user, setUser} = useContext(UserContext);
  const {courseCategoryId, courseCategoryName} = route.params;
  const [course, setCourse] = useState({
    CourseId: 0,
    CourseName: '',
    IsActive: true,
    CourseCategoryId: courseCategoryId,
    CreatedAt: null,
    CreatedBy: user.userId,
    LastUpdatedBy: null,
  });
  const [courseList, setCourseList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [courseDeleteId, setCourseDeleteId] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    fetchCoursesByCourseCategoryId();
  }, []);

  const fetchCoursesByCourseCategoryId = async () => {
    try {
      const response = await httpGet(
        `Course/getCourseByCourseCategoryId?Id=${courseCategoryId}`,
      );
      setCourseList(response.data);
    } catch (error) {
      console.log('Error fetching Courses:', error);
      Toast.show({
        type: 'error',
        text1: `${error}`,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const handleAddCourse = () => {
    setCourse({
      CourseId: 0,
      CourseName: '',
      IsActive: true,
      CourseCategoryId: courseCategoryId,
      CreatedAt: null,
      CreatedBy: user.userId,
      LastUpdatedBy: null,
    });
    setModalVisible(true);
  };

  const handleEditCourse = id => {
    httpGet(`Course/getById?Id=${id}`)
      .then(result => {
        console.log(result);
        setCourse({
          CourseId: result.data.courseId,
          CourseName: result.data.courseName,
          CourseCategoryId: result.data.courseCategoryId,
          IsActive: result.data.isActive,
          CreatedAt: result.data.createdAt,
          CreatedBy: result.data.CreatedBy,
          LastUpdatedBy: user.userId,
        });
      })
      .catch(err => {
        console.error('Get By Id Error', err);
        Toast.show({
          type: 'error',
          text1: `${err}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
    setModalVisible(true);
  };

  const DeleteCourseIdConfirm = courseid => {
    setCourseDeleteId(courseid);
  };

  const DeleteCourseIdConfirmYes = () => {
    httpGet(`Course/delete?Id=${courseDeleteId}`)
      .then(result => {
        console.log(result);
        fetchCoursesByCourseCategoryId();
        setCourseDeleteId(0);
        setShowDelete(false);
      })
      .catch(error => {
        console.error('Delete Course error', error);
        Toast.show({
          type: 'error',
          text1: `${error}`,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
      });
  };

  const DeleteCourseIdConfirmNo = () => {
    setCourseDeleteId(0);
    setShowDelete(false);
  };

  const handleSaveCourse = async () => {
    try {
      if (course.CourseId !== 0) {
        await httpPost('Course/put', course)
          .then(response => {
            if (response.status === 200) {
              fetchCoursesByCourseCategoryId();
              Alert.alert('Sucess', 'Data fetched successfully');
              setCourse({
                CourseId: 0,
                CourseName: '',
                CourseCategoryId: courseCategoryId,
                IsActive: true,
                CreatedAt: null,
                CreatedBy: user.userId,
                LastUpdatedBy: null,
              });
            }
          })
          .catch(err => {
            console.error('Put error in Course', err);
            Toast.show({
              type: 'error',
              text1: `${err}`,
              position: 'bottom',
              visibilityTime: 2000,
              autoHide: true,
            });
          });
      } else {
        await httpPost('Course/post', course).then(response => {
          if (response.status === 200) {
            fetchCoursesByCourseCategoryId();
            Alert.alert('Sucess', 'Course is Added Successfully');
            setCourse({
              CourseId: 0,
              CourseName: '',
              CourseCategoryId: courseCategoryId,
              IsActive: true,
              CreatedAt: null,
              CreatedBy: user.userId,
              LastUpdatedBy: null,
            });
          }
        });
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving Course:', error);
      Toast.show({
        type: 'error',
        text1: `${error}`,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const handleNavigate = (courseId, courseName) => {
    navigation.navigate('BatchScreen', {
      courseId: courseId,
      courseName: courseName,
    });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const renderCourseCard = ({item}) => (
    <View
      style={{
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
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 16}}>Course Name : </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          {item.courseName}
        </Text>
        <View
          style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
          <TouchableOpacity
            style={{marginRight: 10}}
            onPress={() => handleEditCourse(item.courseId)}>
            <Icon
              name="pencil"
              size={20}
              color={'#5a67f2'}
              style={{marginLeft: 8, textAlignVertical: 'center'}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginRight: 10}}
            onPress={() => handleNavigate(item.courseId, item.courseName)}>
            <Icon
              name="cogs"
              size={20}
              color={Colors.primary}
              style={{marginRight: 8, textAlignVertical: 'center'}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              DeleteCourseIdConfirm(item.courseId);
              setShowDelete(true);
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
    </View>
  );

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{flexGrow: 1}}>
      <View
        style={{
          padding: 16,
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          Course Category Name : {courseCategoryName}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginTop: 10,
            marginBottom: 10,
          }}
          onPress={handleAddCourse}>
          <Text
            style={{
              color: Colors.background,
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Add Course
          </Text>
        </TouchableOpacity>

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
                      DeleteCourseIdConfirmYes();
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
                      DeleteCourseIdConfirmNo();
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
          data={courseList}
          keyExtractor={item => item.courseId.toString()}
          renderItem={renderCourseCard}
        />

        {modalVisible && (
          <Modal transparent visible={modalVisible}>
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
                  onChangeText={text =>
                    setCourse({...course, CourseName: text})
                  }
                />

                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.primary,
                      borderRadius: 5,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                    }}
                    onPress={handleSaveCourse}>
                    <Text
                      style={{
                        color: Colors.background,
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}>
                      {course.CourseId === 0 ? 'Add' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#f25252',
                      borderRadius: 5,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      marginLeft: 10,
                    }}
                    onPress={handleCloseModal}>
                    <Text
                      style={{
                        color: Colors.background,
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
        <Toast ref={ref => Toast.setRef(ref)} />
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

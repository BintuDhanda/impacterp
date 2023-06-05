import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';

const CourseCategoryScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [courseCategoryName, setCourseCategoryName] = useState('');
  const [courseCategorys, setCourseCategorys] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editCourseCategoryId, setEditCourseCategoryId] = useState(null);

  const handleAddCourseCategory = () => {
    const newCourseCategory = {
      id: editMode ? editCourseCategoryId : courseCategorys.length + 1,
      courseCategoryName: courseCategoryName.trim(),
    };

    if (newCourseCategory.courseCategoryName !== '') {
      if (editMode) {
        const updatedCourseCategorys = courseCategorys.map((courseCategory) =>
          courseCategory.id === editCourseCategoryId ? { ...courseCategory, courseCategoryName: newCourseCategory.courseCategoryName } : courseCategory
        );
        setCourseCategorys(updatedCourseCategorys);
        setEditMode(false);
        setEditCourseCategoryId(null);
      } else {
        setCourseCategorys([...courseCategorys, newCourseCategory]);
      }

      setCourseCategoryName('');
      setModalVisible(false);
    }
  };

  const handleDeleteCourseCategory = (courseCategoryId) => {
    const updatedCourseCategorys = courseCategorys.filter((courseCategory) => courseCategory.id !== courseCategoryId);
    setCourseCategorys(updatedCourseCategorys);
  };

  const handleEditCourseCategory = (courseCategoryId, courseCategoryName) => {
    setEditMode(true);
    setEditCourseCategoryId(courseCategoryId);
    setCourseCategoryName(courseCategoryName);
    setModalVisible(true);
  };

  const renderCourseCategoryCard = ({ item }) => {
    return (
      <View style={styles.courseCategoryCard}>
        <Text style={styles.courseCategoryName}>{item.courseCategoryName}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditCourseCategory(item.id, item.courseCategoryName)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteCourseCategory(item.id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonLabel}>Add CourseCategory</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <TextInput
              style={styles.input}
              placeholder="CourseCategory Name"
              value={courseCategoryName}
              onChangeText={setCourseCategoryName}
            />

            <TouchableOpacity style={styles.addModalButton} onPress={handleAddCourseCategory}>
              <Text style={styles.addModalButtonText}>{editMode ? 'Save' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => {
              setModalVisible(false);
              setCourseCategoryName('');
              setEditMode(false);
              setEditCourseCategoryId(null);
            }}
          >
            <Text style={styles.closeModalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <FlatList
        data={courseCategorys}
        renderItem={renderCourseCategoryCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.courseCategoryList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    backgroundColor: '#5a67f2',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addButtonLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  addModalButton: {
    backgroundColor: '#5a67f2',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  addModalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeModalButton: {
    backgroundColor: '#f25252',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeModalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  courseCategoryList: {
    flexGrow: 1,
  },
  courseCategoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  courseCategoryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#5a67f2',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#f25252',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CourseCategoryScreen;
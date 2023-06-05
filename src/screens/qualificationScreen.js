import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';

const QualificationScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [qualificationName, setQualificationName] = useState('');
  const [qualifications, setQualifications] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editQualificationId, setEditQualificationId] = useState(null);

  const handleAddQualification = () => {
    const newQualification = {
      id: editMode ? editQualificationId : qualifications.length + 1,
      qualificationName: qualificationName.trim(),
    };

    if (newQualification.qualificationName !== '') {
      if (editMode) {
        const updatedQualifications = qualifications.map((qualification) =>
          qualification.id === editQualificationId ? { ...qualification, qualificationName: newQualification.qualificationName } : qualification
        );
        setQualifications(updatedQualifications);
        setEditMode(false);
        setEditQualificationId(null);
      } else {
        setQualifications([...qualifications, newQualification]);
      }

      setQualificationName('');
      setModalVisible(false);
    }
  };

  const handleDeleteQualification = (qualificationId) => {
    const updatedQualifications = qualifications.filter((qualification) => qualification.id !== qualificationId);
    setQualifications(updatedQualifications);
  };

  const handleEditQualification = (qualificationId, qualificationName) => {
    setEditMode(true);
    setEditQualificationId(qualificationId);
    setQualificationName(qualificationName);
    setModalVisible(true);
  };

  const renderQualificationCard = ({ item }) => {
    return (
      <View style={styles.qualificationCard}>
        <Text style={styles.qualificationName}>{item.qualificationName}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditQualification(item.id, item.qualificationName)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteQualification(item.id)}
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
        <Text style={styles.addButtonLabel}>Add Qualification</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <TextInput
              style={styles.input}
              placeholder="Qualification Name"
              value={qualificationName}
              onChangeText={setQualificationName}
            />

            <TouchableOpacity style={styles.addModalButton} onPress={handleAddQualification}>
              <Text style={styles.addModalButtonText}>{editMode ? 'Save' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => {
              setModalVisible(false);
              setQualificationName('');
              setEditMode(false);
              setEditQualificationId(null);
            }}
          >
            <Text style={styles.closeModalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <FlatList
        data={qualifications}
        renderItem={renderQualificationCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.qualificationList}
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
  qualificationList: {
    flexGrow: 1,
  },
  qualificationCard: {
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
  qualificationName: {
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

export default QualificationScreen;
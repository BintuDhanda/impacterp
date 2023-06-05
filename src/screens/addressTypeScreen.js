import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';

const AddressTypeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addressTypeName, setAddressTypeName] = useState('');
  const [addressTypes, setAddressTypes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editAddressTypeId, setEditAddressTypeId] = useState(null);

  const handleAddAddressType = () => {
    const newAddressType = {
      id: editMode ? editAddressTypeId : addressTypes.length + 1,
      addressTypeName: addressTypeName.trim(),
    };

    if (newAddressType.addressTypeName !== '') {
      if (editMode) {
        const updatedAddressTypes = addressTypes.map((addressType) =>
          addressType.id === editAddressTypeId ? { ...addressType, addressTypeName: newAddressType.addressTypeName } : addressType
        );
        setAddressTypes(updatedAddressTypes);
        setEditMode(false);
        setEditAddressTypeId(null);
      } else {
        setAddressTypes([...addressTypes, newAddressType]);
      }

      setAddressTypeName('');
      setModalVisible(false);
    }
  };

  const handleDeleteAddressType = (addressTypeId) => {
    const updatedAddressTypes = addressTypes.filter((addressType) => addressType.id !== addressTypeId);
    setAddressTypes(updatedAddressTypes);
  };

  const handleEditAddressType = (addressTypeId, addressTypeName) => {
    setEditMode(true);
    setEditAddressTypeId(addressTypeId);
    setAddressTypeName(addressTypeName);
    setModalVisible(true);
  };

  const renderAddressTypeCard = ({ item }) => {
    return (
      <View style={styles.addressTypeCard}>
        <Text style={styles.addressTypeName}>{item.addressTypeName}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditAddressType(item.id, item.addressTypeName)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteAddressType(item.id)}
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
        <Text style={styles.addButtonLabel}>Add AddressType</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <TextInput
              style={styles.input}
              placeholder="AddressType Name"
              value={addressTypeName}
              onChangeText={setAddressTypeName}
            />

            <TouchableOpacity style={styles.addModalButton} onPress={handleAddAddressType}>
              <Text style={styles.addModalButtonText}>{editMode ? 'Save' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => {
              setModalVisible(false);
              setAddressTypeName('');
              setEditMode(false);
              setEditAddressTypeId(null);
            }}
          >
            <Text style={styles.closeModalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <FlatList
        data={addressTypes}
        renderItem={renderAddressTypeCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.addressTypeList}
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
  addressTypeList: {
    flexGrow: 1,
  },
  addressTypeCard: {
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
  addressTypeName: {
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

export default AddressTypeScreen;
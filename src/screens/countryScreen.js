import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';

const CountryScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [countryName, setCountryName] = useState('');
  const [countrys, setCountrys] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editCountryId, setEditCountryId] = useState(null);

  const handleAddCountry = () => {
    const newCountry = {
      id: editMode ? editCountryId : countrys.length + 1,
      countryName: countryName.trim(),
    };

    if (newCountry.countryName !== '') {
      if (editMode) {
        const updatedCountrys = countrys.map((country) =>
          country.id === editCountryId ? { ...country, countryName: newCountry.countryName } : country
        );
        setCountrys(updatedCountrys);
        setEditMode(false);
        setEditCountryId(null);
      } else {
        setCountrys([...countrys, newCountry]);
      }

      setCountryName('');
      setModalVisible(false);
    }
  };

  const handleDeleteCountry = (countryId) => {
    const updatedCountrys = countrys.filter((country) => country.id !== countryId);
    setCountrys(updatedCountrys);
  };

  const handleEditCountry = (countryId, countryName) => {
    setEditMode(true);
    setEditCountryId(countryId);
    setCountryName(countryName);
    setModalVisible(true);
  };

  const renderCountryCard = ({ item }) => {
    return (
      <View style={styles.countryCard}>
        <Text style={styles.countryName}>{item.countryName}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditCountry(item.id, item.countryName)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteCountry(item.id)}
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
        <Text style={styles.addButtonLabel}>Add Country</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <TextInput
              style={styles.input}
              placeholder="Country Name"
              value={countryName}
              onChangeText={setCountryName}
            />

            <TouchableOpacity style={styles.addModalButton} onPress={handleAddCountry}>
              <Text style={styles.addModalButtonText}>{editMode ? 'Save' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => {
              setModalVisible(false);
              setCountryName('');
              setEditMode(false);
              setEditCountryId(null);
            }}
          >
            <Text style={styles.closeModalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <FlatList
        data={countrys}
        renderItem={renderCountryCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.CountryList}
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
  countryList: {
    flexGrow: 1,
  },
  countryCard: {
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
  countryName: {
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

export default CountryScreen;
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';

const AccountCategoryScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [accountCategoryName, setAccountCategoryName] = useState('');
  const [accountCategorys, setAccountCategorys] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editAccountCategoryId, setEditAccountCategoryId] = useState(null);

  const handleAddAccountCategory = () => {
    const newAccountCategory = {
      id: editMode ? editAccountCategoryId : accountCategorys.length + 1,
      accountCategoryName: accountCategoryName.trim(),
    };

    if (newAccountCategory.accountCategoryName !== '') {
      if (editMode) {
        const updatedAccountCategorys = accountCategorys.map((accountCategory) =>
          accountCategory.id === editAccountCategoryId ? { ...accountCategory, accountCategoryName: newAccountCategory.accountCategoryName } : accountCategory
        );
        setAccountCategorys(updatedAccountCategorys);
        setEditMode(false);
        setEditAccountCategoryId(null);
      } else {
        setAccountCategorys([...accountCategorys, newAccountCategory]);
      }

      setAccountCategoryName('');
      setModalVisible(false);
    }
  };

  const handleDeleteAccountCategory = (accountCategoryId) => {
    const updatedAccountCategorys = accountCategorys.filter((accountCategory) => accountCategory.id !== accountCategoryId);
    setAccountCategorys(updatedAccountCategorys);
  };

  const handleEditAccountCategory = (accountCategoryId, accountCategoryName) => {
    setEditMode(true);
    setEditAccountCategoryId(accountCategoryId);
    setAccountCategoryName(accountCategoryName);
    setModalVisible(true);
  };

  const renderAccountCategoryCard = ({ item }) => {
    return (
      <View style={styles.accountCategoryCard}>
        <Text style={styles.accountCategoryName}>{item.accountCategoryName}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditAccountCategory(item.id, item.accountCategoryName)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteAccountCategory(item.id)}
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
        <Text style={styles.addButtonLabel}>Add AccountCategory</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <TextInput
              style={styles.input}
              placeholder="AccountCategory Name"
              value={accountCategoryName}
              onChangeText={setAccountCategoryName}
            />

            <TouchableOpacity style={styles.addModalButton} onPress={handleAddAccountCategory}>
              <Text style={styles.addModalButtonText}>{editMode ? 'Save' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => {
              setModalVisible(false);
              setAccountCategoryName('');
              setEditMode(false);
              setEditAccountCategoryId(null);
            }}
          >
            <Text style={styles.closeModalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <FlatList
        data={accountCategorys}
        renderItem={renderAccountCategoryCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.accountCategoryList}
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
  accountCategoryList: {
    flexGrow: 1,
  },
  accountCategoryCard: {
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
  accountCategoryName: {
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

export default AccountCategoryScreen;
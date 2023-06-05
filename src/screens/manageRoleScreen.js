import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';

const ManageRoleScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roles, setRoles] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);

  const handleAddRole = () => {
    const newRole = {
      id: editMode ? editRoleId : roles.length + 1,
      roleName: roleName.trim(),
    };

    if (newRole.roleName !== '') {
      if (editMode) {
        const updatedRoles = roles.map((role) =>
          role.id === editRoleId ? { ...role, roleName: newRole.roleName } : role
        );
        setRoles(updatedRoles);
        setEditMode(false);
        setEditRoleId(null);
      } else {
        setRoles([...roles, newRole]);
      }

      setRoleName('');
      setModalVisible(false);
    }
  };

  const handleDeleteRole = (roleId) => {
    const updatedRoles = roles.filter((role) => role.id !== roleId);
    setRoles(updatedRoles);
  };

  const handleEditRole = (roleId, roleName) => {
    setEditMode(true);
    setEditRoleId(roleId);
    setRoleName(roleName);
    setModalVisible(true);
  };

  const renderRoleCard = ({ item }) => {
    return (
      <View style={styles.roleCard}>
        <Text style={styles.roleName}>{item.roleName}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditRole(item.id, item.roleName)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteRole(item.id)}
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
        <Text style={styles.addButtonLabel}>Add Role</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <TextInput
              style={styles.input}
              placeholder="Role Name"
              value={roleName}
              onChangeText={setRoleName}
            />

            <TouchableOpacity style={styles.addModalButton} onPress={handleAddRole}>
              <Text style={styles.addModalButtonText}>{editMode ? 'Save' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => {
              setModalVisible(false);
              setRoleName('');
              setEditMode(false);
              setEditRoleId(null);
            }}
          >
            <Text style={styles.closeModalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <FlatList
        data={roles}
        renderItem={renderRoleCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.roleList}
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
  roleList: {
    flexGrow: 1,
  },
  roleCard: {
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
  roleName: {
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

export default ManageRoleScreen;
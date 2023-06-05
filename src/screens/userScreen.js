import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Button, Modal } from 'react-native';
import UserCardComponent from '../components/userCardComponent';
import UserModalComponent from '../components/userModalComponent';

const UserScreen = () => {
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const addUser = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
    setModalVisible(false);
  };

  const updateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setModalVisible(false);
    setSelectedUser(null);
  };

  const openModal = () => {
    setModalVisible(true);
    setSelectedUser(null);
  };

  const openEditModal = (user) => {
    setModalVisible(true);
    setSelectedUser(user);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  return (
    <View style={styles.container}>
      <Button title="Add User" onPress={openModal} />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserCardComponent user={item} onEdit={() => openEditModal(item)} />
        )}
      />
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <UserModalComponent
            user={selectedUser}
            onSave={selectedUser ? updateUser : addUser}
            onClose={closeModal}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default UserScreen;
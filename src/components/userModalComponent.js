import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const UserModal = ({ user, onSave, onClose }) => {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (user) {
      setUserName(user.userName);
      setUserPassword(user.userPassword);
      setPhoneNumber(user.phoneNumber);
    }
  }, [user]);

  const handleSave = () => {
    const updatedUser = {
      id: user ? user.id : new Date().getTime(),
      userName,
      userPassword,
      phoneNumber,
    };
    onSave(updatedUser);
    setUserName('');
    setUserPassword('');
    setPhoneNumber('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder="User Password"
        value={userPassword}
        onChangeText={setUserPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType='numeric'
        maxLength={10}
      />
      <View style={styles.buttonContainer}>
        <Button title="Close" onPress={onClose} />
        <Button title={user ? 'Save' : 'Add'} onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default UserModal;
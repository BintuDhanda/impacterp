import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const stateData = {
  USA: ['California', 'New York', 'Texas'],
  Canada: ['Ontario', 'Quebec', 'British Columbia'],
  Australia: ['New South Wales', 'Victoria', 'Queensland']
};

const StateScreen = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedState(null);
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
  };

  const renderStates = () => {
    if (!selectedCountry) return null;

    const states = stateData[selectedCountry];

    return (
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select State:</Text>
        <Dropdown
          label={'Select State'}
          data={states}
          value={selectedState}
          onChange={handleStateChange}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select Country:</Text>
        <DropDown
          label={'Select Country'}
          data={Object.keys(stateData)}
          value={selectedCountry}
          onChange={handleCountryChange}
        />
      </View>

      {renderStates()}

      {selectedState && (
        <View style={styles.selectedStateContainer}>
          <Text style={styles.selectedStateText}>Selected State: {selectedState}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  dropdownContainer: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  selectedStateContainer: {
    marginTop: 20,
    backgroundColor: '#EDEDED',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8
  },
  selectedStateText: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default StateScreen;
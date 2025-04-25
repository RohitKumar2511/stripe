import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, Platform, PermissionsAndroid } from 'react-native';
import { useStripeTerminal } from 'stripe-terminal-react-native';

async function requestBluetoothPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 23) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH,
        {
          title: 'Bluetooth Permission',
          message: 'This app needs access to your Bluetooth to connect to readers.',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Bluetooth permission granted');
      } else {
        console.log('Bluetooth permission denied');
        Alert.alert(
          'Permission Denied',
          'Bluetooth permission is required to use Stripe Terminal functionality.'
        );
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

function DiscoverReadersScreen() {
  const { discoverReaders, discoveredReaders } = useStripeTerminal({
    onUpdateDiscoveredReaders: (readers) => {
      console.log('Discovered readers:', readers);
    },
  });

  useEffect(() => {
    requestBluetoothPermission(); // Request Bluetooth permission when the screen loads
    handleDiscoverReaders();
  }, []);

  const handleDiscoverReaders = async () => {
    const { error } = await discoverReaders({
      discoveryMethod: 'bluetoothScan', // Or 'usbScan' based on your setup
    });

    if (error) {
      Alert.alert('Discover readers error:', `${error.code}, ${error.message}`);
    }
  };

  return (
    <View>
      <Text>Discovered Readers:</Text>
      {discoveredReaders.map((reader, index) => (
        <View key={index}>
          <Text>{reader.label}</Text>
        </View>
      ))}
      <Button title="Discover Readers" onPress={handleDiscoverReaders} />
    </View>
  );
}

export default DiscoverReadersScreen;

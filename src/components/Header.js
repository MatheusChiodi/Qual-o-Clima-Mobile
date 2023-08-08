import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerLeftText}>
          <Entypo name="location-pin" style={styles.iconLocation}/>
          Araraqura, SP
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    marginTop: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginLeft: -20,
    padding: 0,
  },
  headerLeftText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  iconLocation: {
    color: '#FFF',
    fontSize: 24,
  },
});

export default Header;

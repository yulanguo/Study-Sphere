import React from 'react';
import { Button, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { Pressable } from 'react-native';

export default function Settings({
  navigation,
  route,
  users,
  courses,
  studySessions,
  userId,
  setUsers,
  setCourses,
  setStudySessions,
  setUserId,
}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <LinearGradient colors={['#B6B2E6', '#C5DDBA']} style={styles.background}>
        <Pressable
          style={styles.nextPage}
          onPress={() => {
            navigation.navigate('Login');
          }}
        >
          <Text style={styles.nextPageBtnText}>Logout</Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  background: {
    height: '100%',
    width: '100%',
  },
  nextPage: {
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 20,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  nextPageBtnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

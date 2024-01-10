import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Overlay } from 'react-native-elements';
import userIcon from '../assets/user.png';
import { formatTime } from '../utils/helpers';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function StudySessionDetails({
  navigation,
  route,
  users,
  userId,
}) {
  const { studySessionInfo, sessionIdx, handleLeave } = route.params;
  const owner = users.filter((user) => user.id === studySessionInfo.owner);
  const [visibleAlert, setVisibleAlert] = useState(false);
  const isOwner = userId === studySessionInfo.owner;

  useEffect(() => {
    navigation.setOptions({ title: studySessionInfo.title });
  }, [navigation, studySessionInfo.title]);

  return (
    <LinearGradient colors={['#B6B2E6', '#C5DDBA']} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.buttonsContainer}>
          {!isOwner && (
            <TouchableOpacity
              style={styles.buttonLeave}
              onPress={() => setVisibleAlert(true)}
            >
              <Text style={styles.buttonLeaveText}>Leave</Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView contentContainerStyle={styles.containerInner}>
          <View style={styles.detailsContainer}>
            <View style={styles.details}>
              <Text style={styles.detailsTitle}>Course: </Text>
              <Text style={styles.detailsInfo}>{studySessionInfo.course}</Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.detailsTitle}>Date: </Text>
              <Text style={styles.detailsInfo}>
                {studySessionInfo.dateFormatted}
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.detailsTitle}>Time: </Text>
              <Text style={styles.detailsInfo}>
                {`${formatTime(
                  studySessionInfo.fromTime.hours,
                  studySessionInfo.fromTime.minutes
                )} - ${formatTime(
                  studySessionInfo.toTime.hours,
                  studySessionInfo.toTime.minutes
                )}`}
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.detailsTitle}>Members: </Text>
              <Text style={styles.detailsInfo}>
                {studySessionInfo.participants.length + 1}
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.detailsTitle}>Location: </Text>
              {studySessionInfo.location ? (
                <Text style={styles.detailsInfo}>
                  {studySessionInfo.location}
                </Text>
              ) : (
                <Text style={styles.detailsInfo}>
                  Owner hasn't specified a location!
                </Text>
              )}
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.heading}>List of Members:</Text>
            {studySessionInfo.participants.map((participant, idx) => {
              return (
                <View key={idx} style={styles.userContainer}>
                  <Image
                    source={userIcon}
                    accessible={false}
                    style={styles.userIcon}
                  />
                  <Text style={styles.userName}>{participant}</Text>
                </View>
              );
            })}
            <View style={styles.userContainer}>
              <Image
                source={userIcon}
                accessible={false}
                style={styles.userIcon}
              />
              <Text style={styles.userName}>{owner[0].name} (Owner)</Text>
            </View>
          </View>
        </ScrollView>
      </View>
      <Overlay
        isVisible={visibleAlert}
        onBackdropPress={() => setVisibleAlert(false)}
        overlayStyle={styles.overlay}
      >
        <View style={styles.modal}>
          <Text style={styles.modalHeading}>
            Please confirm before continuing.
          </Text>
          <Text style={styles.message}>
            Are you sure you want to leave this study session?
          </Text>
          <View style={styles.modalButtonsView}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setVisibleAlert(false)}
            >
              <Text style={styles.modalButtonText}>No, Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.leaveConfirmButton}
              onPress={() => {
                setVisibleAlert(false);
                handleLeave(sessionIdx);
                navigation.navigate('Study Sessions');
              }}
            >
              <Text style={styles.modalButtonTextLeave}>Yes, Leave</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  containerInner: {
    minHeight: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  background: {
    height: '100%',
    width: '100%',
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    minHeight: 30,
  },
  tabLabel: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderStyle: 'solid',
    textAlign: 'center',
    overflow: 'hidden',
    fontWeight: 'bold',
  },
  topTab: {
    backgroundColor: '#c1c3ec',
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  innerSearchContainer: { backgroundColor: 'white' },
  searchPlaceholder: { fontWeight: 'bold' },
  accessDeniedView: {
    margin: 20,
    padding: 10,
    borderRadius: 10,
    borderColor: '#6A74CF',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  icon_message_box: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  message: {
    // flex: 1,
    padding: 10,
    textAlign: 'center',
  },
  buttonJoin: {
    padding: 10,
    color: 'white',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#22810B',
    marginHorizontal: 20,
  },
  buttonLeave: {
    padding: 10,
    color: 'white',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#D72424',
  },
  buttonJoinText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonLeaveText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    width: '100%',
  },
  modalHeading: {
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center',
    fontSize: 20,
  },
  modalButtonsView: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  cancelButton: {
    padding: 10,
    color: 'white',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  modalButtonTextLeave: {
    color: '#D72424',
    fontWeight: 'bold',
  },
  leaveConfirmButton: {
    padding: 10,
    color: 'white',
    backgroundColor: 'white',
    borderColor: '#D72424',
    borderWidth: 2,
    borderRadius: 5,
  },
  messageConfirm: {
    padding: 15,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 5,
  },
  detailsContainer: {
    justifyContent: 'center',
    borderColor: '#6A74CF',
    borderWidth: 2,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    backgroundColor: 'white',
  },
  detailsTitle: {
    fontWeight: 'bold',
  },
  detailsInfo: {
    fontWeight: 'light',
  },
  details: {
    flexDirection: 'row',
    marginTop: 5,
    flexWrap: 'wrap',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  userIcon: {
    height: 30,
    width: 30,
  },
  userName: {
    fontWeight: 'semibold',
    marginLeft: 10,
  },
  study_sessions_button: {
    margin: 20,
    padding: 10,
    backgroundColor: '#9747FF',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 2,
  },
  study_sessions_button_text: {
    color: 'white',
    fontWeight: 'bold',
  },
  overlay: {
    borderRadius: 10,
  },
});

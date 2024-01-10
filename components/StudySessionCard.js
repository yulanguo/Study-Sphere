import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Overlay } from 'react-native-elements';
import dayjs from 'dayjs';
import 'dayjs/locale/en-au';

export default function StudySessionCard({
  studySessionInfo,
  userId,
  navigation,
  sessionIdx,
  handleJoin,
  handleLeave,
}) {
  const {
    course,
    location,
    participants,
    date,
    dateFormatted,
    time,
    title,
    members,
  } = studySessionInfo;

  const dayOfWeek = dayjs(date).locale('en-au').format('ddd');
  const shortHandDate = dayjs(date).locale('en-au').format('D/MM');
  const [isMember, setIsMember] = useState(
    members.some((member) => member === userId)
  );
  const [visibleAlert, setVisibleAlert] = useState(false);
  const isOwner = studySessionInfo.owner === userId;

  useEffect(() => {
    setIsMember(members.some((member) => member === userId));
  }, [members, userId]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        if (isMember) {
          navigation.navigate('StudySessionDetails', {
            studySessionInfo,
            userId,
            sessionIdx,
            handleLeave,
          });
        }
      }}
    >
      <View style={styles.informationBox}>
        <View style={styles.timeBox}>
          <Text style={styles.dayText}>{dayOfWeek}</Text>
          <Text style={styles.shortHandDateTxt}>{shortHandDate}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: 'bold' }}>{title}</Text>
          <Text>{course}</Text>
          {location ? (
            <Text>
              {location}
              <Entypo name='location-pin' size={17} color='black' />
            </Text>
          ) : null}
          {/* Counting the owner as well?! */}
          <Text>{participants.length + 1} Members</Text>
        </View>
      </View>
      {isOwner ? null : !isMember ? (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.buttonJoin}
            onPress={() => {
              setIsMember(true);
              handleJoin(sessionIdx);
            }}
          >
            <Text style={styles.buttonJoinText}>Join</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.buttonLeave}
            onPress={() => setVisibleAlert(true)}
          >
            <Text style={styles.buttonLeaveText}>Leave</Text>
          </TouchableOpacity>
        </View>
      )}
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
                setIsMember(false);
                setVisibleAlert(false);
                handleLeave(sessionIdx);
              }}
            >
              <Text style={styles.modalButtonTextLeave}>Yes, Leave</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#C1C3EC',
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    padding: 10,
    borderColor: '#6A74CF',
    borderWidth: 1,
    borderRadius: 10,
  },
  timeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6A74CF',
    padding: 5,
    borderRadius: 8,
    marginRight: 10,
    minWidth: 60,
  },
  dayText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  informationBox: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    overflowWrap: 'break-word',
    width: '70%',
  },
  shortHandDateTxt: {
    color: 'white',
    fontSize: 13,
  },
  buttonJoinText: {
    color: '#22810B',
    fontWeight: 'bold',
  },
  buttonLeaveText: {
    color: '#D72424',
    fontWeight: 'bold',
  },
  buttonJoin: {
    padding: 10,
    color: '#22810B',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#22810B',
    backgroundColor: 'white',
  },
  buttonLeave: {
    padding: 10,
    color: '#D72424',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#D72424',
    backgroundColor: 'white',
  },
  buttonsContainer: {
    // flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 30,
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
    // backgroundColor: 'gray',
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
  message: {
    padding: 15,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 5,
  },
  overlay: {
    borderRadius: 10,
  },
});

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import image from '../assets/course_images/comp3121_icon.png';
import { Overlay } from 'react-native-elements';

export default function ClassBox({
  courseKey,
  classKey,
  classTutor,
  classTime,
  participants,
  navigation,
  userId,
  users,
  setUsers,
  courses,
  setCourses,
}) {
  const [isMember, setIsMember] = useState(participants.includes(userId));
  const [visibleAlert, setVisibleAlert] = useState(false);

  useEffect(() => {
    setIsMember(participants.includes(userId));
  }, [participants, userId]);
  return (
    <View>
      <Overlay
        isVisible={visibleAlert}
        onBackdropPress={() => setVisibleAlert((v) => !v)}
        overlayStyle={styles.overlay}
      >
        <View style={styles.modal}>
          <Text style={styles.modalHeading}>
            Please confirm before continuing.
          </Text>
          <Text style={styles.message}>
            Are you sure you want to leave {courseKey} {classKey}?
          </Text>
          <View style={styles.modalButtonsView}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setVisibleAlert((v) => !v)}
            >
              <Text style={styles.modalButtonText}>No, Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.leaveConfirmButton}
              onPress={() => {
                setIsMember(false);
                const userIndex = users.findIndex((x) => x.id === userId);
                if (userIndex !== -1) {
                  const updatedUsers = [...users];
                  if (courseKey in updatedUsers[userIndex].courses_classes) {
                    updatedUsers[userIndex].courses_classes[courseKey] =
                      updatedUsers[userIndex].courses_classes[courseKey].filter(
                        (x) => x !== userId
                      );
                    setUsers(updatedUsers);
                  }
                }
                if (courseKey in courses) {
                  const newCourses = { ...courses };
                  if (classKey in newCourses[courseKey].classes) {
                    newCourses[courseKey].classes[classKey].participants =
                      newCourses[courseKey].classes[
                        classKey
                      ].participants.filter((x) => x !== userId);
                  }
                  setCourses(newCourses);
                }
              }}
            >
              <Text style={styles.modalButtonTextLeave}>Yes, Leave Class</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>
      <TouchableOpacity
        style={styles.container}
        accessible={true}
        accessibilityLabel=''
        accessibilityHint=''
        onPress={() =>
          navigation.navigate('ClassDetails', {
            title: `${courseKey.charAt(0).toUpperCase()}${courseKey
              .substr(1)
              .toLowerCase()} ${classKey}`,
            courseKey,
            isMember,
            classKey,
          })
        }
      >
        <View style={styles.informationBox}>
          {image && (
            <Image
              accessible={false}
              aria-hidden
              source={image}
              style={styles.image}
            />
          )}
          <View>
            <Text style={{ fontWeight: 'bold' }}>{classKey}</Text>
            <Text>{classTutor}</Text>
            <Text>{classTime}</Text>
            <Text>{participants.length} Members</Text>
          </View>
        </View>
        {!isMember ? (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.buttonJoin}
              accessibilityLabel={`Join ${classKey}`}
              onPress={() => {
                setIsMember(true);
                const userIndex = users.findIndex(
                  (x) => x.id === userId.toString()
                );
                if (userIndex !== -1) {
                  const updatedUsers = [...users];
                  if (courseKey in updatedUsers[userIndex].courses_classes) {
                    updatedUsers[userIndex].courses_classes[courseKey] = [
                      ...updatedUsers[userIndex].courses_classes[courseKey],
                      classKey,
                    ];
                    setUsers(updatedUsers);
                  }
                }
                if (courseKey in courses) {
                  const newCourses = { ...courses };
                  if (classKey in newCourses[courseKey].classes) {
                    newCourses[courseKey].classes[classKey].participants = [
                      ...newCourses[courseKey].classes[classKey].participants,
                      userId,
                    ];
                  }
                  setCourses(newCourses);
                }
              }}
            >
              <Text style={styles.buttonJoinText}>Join</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.buttonLeave}
              accessibilityLabel={`Leave ${classKey}`}
              onPress={() => {
                setVisibleAlert(true);
              }}
            >
              <Text style={styles.buttonLeaveText}>Leave</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflowWrap: 'break-word',
    // width: "100%",
    backgroundColor: '#C1C3EC',
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    padding: 10,
    borderColor: '#6A74CF',
    borderWidth: 1,
    borderRadius: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  informationBox: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    overflowWrap: 'break-word',
  },
  image: {
    height: 40,
    width: 40,
    alignSelf: 'center',
    borderRadius: 20,
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
  buttonJoinText: {
    color: '#22810B',
    fontWeight: 'bold',
  },
  buttonLeaveText: {
    color: '#D72424',
    fontWeight: 'bold',
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
  leaveConfirmButton: {
    padding: 10,
    color: 'white',
    backgroundColor: 'white',
    borderColor: '#D72424',
    borderWidth: 2,
    borderRadius: 5,
  },
  overlay: {
    borderRadius: 10,
  },
  modalButtonTextLeave: {
    color: '#D72424',
    fontWeight: 'bold',
  },
  message: {
    padding: 15,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 5,
  },
});

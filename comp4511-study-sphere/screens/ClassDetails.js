import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { Overlay } from 'react-native-elements';
import userIcon from '../assets/user.png';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

import warning from '../assets/warning.png';

export default function ClassDetails({
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
  const { title, courseKey, isMember, classKey } = route.params;
  const [isClassMember, setIsClassMember] = useState(isMember);
  useEffect(() => navigation.setOptions({ title }), [title]);
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [nextStudySession, setNextStudySession] = useState(null);

  const compareDates = (list_of_sessions, myStudy_sessions) => {
    let currNextSessions = null;
    for (const sessionId of list_of_sessions) {
      const sessionIndex = myStudy_sessions.findIndex(
        (ss) => sessionId === ss.id
      );
      if (sessionIndex !== -1) {
        const [date, month, year] =
          myStudy_sessions[sessionIndex].time.from.date.split('/');
        const [currNextDate, currNextMonth, currNextYear] = currNextSessions
          ? currNextSessions.split('/')
          : [null, null, null];
        const sessionTime = new Date(`${year}-${month}-${date}`).getTime();
        const currNextSessionTime = currNextSessions
          ? new Date(
              `${currNextYear}-${currNextMonth}-${currNextDate}`
            ).getTime()
          : null;
        const todayTime = new Date().getTime();
        if (
          currNextSessionTime &&
          sessionTime > todayTime &&
          sessionTime < currNextSessionTime
        ) {
          currNextSessions = myStudy_sessions[sessionIndex].time.from.date;
        } else if (currNextSessionTime === null && sessionTime > todayTime) {
          currNextSessions = myStudy_sessions[sessionIndex].time.from.date;
        }
      }
    }
    return currNextSessions;
  };
  useEffect(() => {
    setNextStudySession(
      compareDates(
        courses[courseKey].classes[classKey].study_sessions,
        studySessions
      )
    );
  }, [studySessions, courses]);
  const Details = () => {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.containerInner}>
          <View style={styles.detailsContainer}>
            <View style={styles.details}>
              <Text style={styles.detailsTitle}>Tutored By: </Text>
              <Text style={styles.detailsInfo}>
                {courses[courseKey].classes[classKey].tutor}
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.detailsTitle}>Time: </Text>
              <Text style={styles.detailsInfo}>
                {courses[courseKey].classes[classKey].time}
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.detailsTitle}>Members: </Text>
              <Text style={styles.detailsInfo}>
                {courses[courseKey].classes[classKey].participants.length}
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.detailsTitle}>Next Study Session: </Text>
              {nextStudySession ? (
                <Text style={styles.detailsInfo}>{nextStudySession}</Text>
              ) : (
                <Text style={styles.detailsInfo}>
                  No study sessions scheduled
                </Text>
              )}
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.heading}>List of Members:</Text>
            {courses[courseKey].classes[classKey].participants.map((p) => {
              const userIndex = users.findIndex((u) => u.id === p);
              let name = 'Error. No name found.';
              if (userIndex !== -1) {
                name = users[userIndex].name;
                if (p === userId) {
                  name += ' (You)';
                }
              }
              return (
                <View key={p} style={styles.userContainer}>
                  <Image
                    source={userIcon}
                    accessible={false}
                    style={styles.userIcon}
                  />
                  <Text style={styles.userName}>{name}</Text>
                </View>
              );
            })}
          </View>
          <TouchableOpacity
            style={styles.study_sessions_button}
            onPress={() => {
              navigation.navigate('Tabs', {
                screen: 'Study Sessions',
              });
            }}
          >
            <Text style={styles.study_sessions_button_text}>
              Go to Study Sessions
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  const Resources = () => {
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.containerInner}></ScrollView>
    </View>;
  };

  const renderScene = SceneMap({
    first: Details,
    second: Resources,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'first',
      title: 'Details',
      accessibilityLabel: 'Class Details',
    },
    {
      key: 'second',
      title: 'Resources',
      accessibilityLabel: 'Class Resources',
    },
  ]);

  return (
    <View style={styles.container}>
      {isClassMember ? (
        <LinearGradient
          // Background Linear Gradient
          colors={['#B6B2E6', '#C5DDBA']}
          style={styles.background}
        >
          <View style={styles.topTab}>
            <Overlay
              isVisible={visibleAlert}
              onBackdropPress={() => setVisibleAlert((v) => !v)}
              overlayStyle={styles.overlay}
            >
              <View style={styles.modal}>
                <Text style={styles.modalHeading}>
                  Please confirm before continuing.
                </Text>
                <Text style={styles.messageConfirm}>
                  Are you sure you want to leave {courseKey}?
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
                      // navigation.navigate("Classes", {
                      //   title: `${courseKey.charAt(0).toUpperCase()}${courseKey
                      //     .substr(1)
                      //     .toLowerCase()} Classes`,
                      //   // userId,
                      //   // users,
                      //   // courses,
                      //   courseKey,
                      //   // isMember: true,
                      //   // action: {
                      //   //   type: "leave",
                      //   //   classKey,
                      //   // },
                      // });
                      setIsClassMember(false);
                      setVisibleAlert(false);
                      const userIndex = users.findIndex((x) => x.id === userId);
                      if (userIndex !== -1) {
                        const updatedUsers = [...users];
                        if (
                          courseKey in updatedUsers[userIndex].courses_classes
                        ) {
                          updatedUsers[userIndex].courses_classes[courseKey] =
                            updatedUsers[userIndex].courses_classes[
                              courseKey
                            ].filter((x) => x !== userId);
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
                    <Text style={styles.modalButtonTextLeave}>
                      Yes, Leave Class
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Overlay>
            <TouchableOpacity
              style={styles.buttonLeave}
              onPress={() => {
                setVisibleAlert(true);
              }}
            >
              <Text style={styles.buttonLeaveText}>Leave Class</Text>
            </TouchableOpacity>
          </View>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={(props) => {
              return (
                <TabBar
                  {...props}
                  style={styles.shadowProp}
                  tabStyle={styles.topTab}
                  renderLabel={({ route, focused, color }) => (
                    <Text
                      style={{
                        ...styles.tabLabel,
                        color: `${focused ? 'white' : 'black'}`,
                        backgroundColor: `${focused ? 'black' : 'transparent'}`,
                        borderColor: `${focused ? 'white' : 'transparent'}`,
                        width: Number((layout.width / 2).toFixed() - 4),
                      }}
                    >
                      {route.title}
                    </Text>
                  )}
                />
              );
            }}
          />
        </LinearGradient>
      ) : (
        <LinearGradient
          // Background Linear Gradient
          colors={['#B6B2E6', '#C5DDBA']}
          style={styles.background}
        >
          <View style={styles.accessDeniedView}>
            <Text style={styles.heading}>
              {courses[courseKey].name} {classKey}
            </Text>
            <View style={styles.icon_message_box}>
              <Image
                source={warning}
                aria-hidden
                accessible={false}
                style={styles.icon}
              />
              <Text style={styles.message}>
                Before accessing resources and details for {courseKey}{' '}
                {classKey} you must join the class.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.buttonJoin}
            onPress={() => {
              // navigation.navigate("Classes", {
              //   title: `${courseKey.charAt(0).toUpperCase()}${courseKey
              //     .substr(1)
              //     .toLowerCase()} Classes`,
              //   // userId,
              //   // users,
              //   // courses,
              //   courseKey,
              //   // isMember: true,
              //   // action: {
              //   //   type: "join",
              //   //   classKey,
              //   // },
              // });
              setIsClassMember(true);
              setVisibleAlert(false);
              const userIndex = users.findIndex((x) => x.id === userId);
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
            <Text style={styles.buttonJoinText}>Join Class</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
    </View>
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
    // textWrap: "wrap",
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
    // textWrap: "wrap",
  },
  icon: {
    width: 40,
    height: 40,
  },
  message: {
    flex: 1,
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
    // marginHorizontal: 10,
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
    // textWrap: "wrap",
  },
  detailsTitle: {
    fontWeight: 'bold',
    // textWrap: "wrap",
  },
  detailsInfo: {
    fontWeight: 'light',
    // textWrap: "wrap",
  },
  details: {
    flexDirection: 'row',
    marginTop: 5,
    // textWrap: "wrap",
    flexWrap: 'wrap',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    // textWrap: "wrap",
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
});

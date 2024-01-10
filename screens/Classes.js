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
import { SearchBar, Overlay } from 'react-native-elements';
import { filterFn, myClassesOnly } from '../utils/helpers';
import ClassBox from '../components/ClassBox';
import warning from '../assets/warning.png';

const CurrTab = ({
  courseKey,
  screenName,
  currClasses,
  navigation,
  userId,
  users,
  setUsers,
  courses,
  setCourses,
}) => {
  const [search, setSearch] = useState('');
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.containerInner}>
        <SearchBar
          placeholder={`Search ${screenName}`}
          onChangeText={setSearch}
          value={search}
          lightTheme
          round
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.innerSearchContainer}
          inputStyle={styles.searchPlaceholder}
          placeholderTextColor='#6A74CF'
          accessibilityRole='search'
        />
        {Object.entries(currClasses)
          .filter(([key, val]) => filterFn(search, key, val.time))
          .map(([classKey, val]) => {
            return (
              <ClassBox
                courseKey={courseKey}
                classKey={classKey}
                classTutor={val.tutor}
                classTime={val.time}
                participants={val.participants}
                navigation={navigation}
                userId={userId}
                key={classKey}
                users={users}
                setUsers={setUsers}
                courses={courses}
                setCourses={setCourses}
              />
            );
          })}
      </ScrollView>
    </View>
  );
};

export default function Classes({
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
  const { title, courseKey } = route.params;
  const [isMember, setIsMember] = useState(
    courses[courseKey].participants.includes(userId)
  );
  useEffect(() => navigation.setOptions({ title, courseKey }), [title]);
  const [visibleAlert, setVisibleAlert] = useState(false);

  // useEffect(() => {
  //   if (action) {
  //     if (action.type === "join") {
  //       const userIndex = myUsers.findIndex((x) => x.id === userId);
  //       if (userIndex !== -1) {
  //         const updatedUsers = [...myUsers];
  //         if (courseKey in updatedUsers[userIndex].courses_classes) {
  //           updatedUsers[userIndex].courses_classes[courseKey] = [
  //             ...updatedUsers[userIndex].courses_classes[courseKey],
  //             action.classKey,
  //           ];
  //           setMyUsers(updatedUsers);
  //         }
  //       }
  //       if (courseKey in myCourses) {
  //         const newCourses = { ...myCourses };
  //         if (action.classKey in newCourses[courseKey].classes) {
  //           newCourses[courseKey].classes[action.classKey].participants = [
  //             ...newCourses[courseKey].classes[action.classKey].participants,
  //             userId,
  //           ];
  //         }
  //         setMyCourses(newCourses);
  //       }
  //       navigation.navigate("ClassDetails", {
  //         title: `${courseKey.charAt(0).toUpperCase()}${courseKey
  //           .substr(1)
  //           .toLowerCase()} ${action.classKey}`,
  //         userId,
  //         users: myUsers,
  //         courses,
  //         courseKey,
  //         isMember: true,
  //         classKey: action.classKey,
  //       });
  //     } else if (action.type === "leave") {
  //       const userIndex = myUsers.findIndex((x) => x.id === userId);
  //       if (userIndex !== -1) {
  //         const updatedUsers = [...myUsers];
  //         if (courseKey in updatedUsers[userIndex].courses_classes) {
  //           updatedUsers[userIndex].courses_classes[courseKey] = updatedUsers[
  //             userIndex
  //           ].courses_classes[courseKey].filter((x) => x !== userId);
  //           setMyUsers(updatedUsers);
  //         }
  //       }
  //       if (courseKey in myCourses) {
  //         const newCourses = { ...myCourses };
  //         if (action.classKey in newCourses[courseKey].classes) {
  //           newCourses[courseKey].classes[action.classKey].participants =
  //             newCourses[courseKey].classes[
  //               action.classKey
  //             ].participants.filter((x) => x !== userId);
  //         }
  //         setMyCourses(newCourses);
  //       }
  //     }
  //   }
  // }, [action]);
  const AllClasses = () => {
    return (
      <CurrTab
        courseKey={courseKey}
        screenName={'All Classes'}
        currClasses={courses[courseKey].classes}
        navigation={navigation}
        userId={userId}
        users={users}
        setUsers={setUsers}
        courses={courses}
        setCourses={setCourses}
      />
    );
  };

  const MyClasses = () => {
    const [myClasses, setMyClasses] = useState(
      myClassesOnly(userId, courses[courseKey].classes)
    );
    useEffect(() => {
      setMyClasses(myClassesOnly(userId, courses[courseKey].classes));
    }, [userId, courses[courseKey].classes]);
    return (
      <CurrTab
        courseKey={courseKey}
        screenName={'My Classes'}
        currClasses={myClasses}
        navigation={navigation}
        userId={userId}
        users={users}
        setUsers={setUsers}
        courses={courses}
        setCourses={setCourses}
      />
    );
  };

  const renderScene = SceneMap({
    first: AllClasses,
    second: MyClasses,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'first',
      title: 'All Classes',
      accessibilityLabel: 'Viewing all Classes',
    },
    {
      key: 'second',
      title: 'My Classes',
      accessibilityLabel: 'Viewing my joined Classes',
    },
  ]);

  return (
    <View style={styles.container}>
      {isMember ? (
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
                <Text style={styles.message}>
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
                      // navigation.navigate("Tabs", {
                      //   screen: "Courses",
                      //   params: {
                      //     user: { id: userId },
                      //     action: {
                      //       type: "leave",
                      //       courseKey,
                      //     },
                      //   },
                      // });
                      setVisibleAlert(false);
                      setIsMember(false);
                      setUsers((u) => {
                        const userIndex = u.findIndex((x) => x.id === userId);
                        if (userIndex !== -1) {
                          const updatedUsers = [...u];
                          if (
                            updatedUsers[userIndex].courses_classes[courseKey]
                          ) {
                            delete updatedUsers[userIndex].courses_classes[
                              courseKey
                            ];
                            return [...updatedUsers];
                          }
                        }
                        return u;
                      });
                      setCourses((c) => {
                        if (courseKey in c) {
                          const newCourses = { ...c };
                          for (const classInCourse of Object.keys(
                            newCourses[courseKey].classes
                          )) {
                            newCourses[courseKey].classes[
                              classInCourse
                            ].participants = newCourses[courseKey].classes[
                              classInCourse
                            ].participants.filter((x) => x !== userId);
                          }
                          newCourses[courseKey].participants = newCourses[
                            courseKey
                          ].participants.filter((x) => x !== userId);
                          return { ...newCourses };
                        }
                        return c;
                      });
                    }}
                  >
                    <Text style={styles.modalButtonTextLeave}>
                      Yes, Leave Course
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
              <Text style={styles.buttonLeaveText}>Leave Course</Text>
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
            <Text style={styles.heading}>{courses[courseKey].name}</Text>
            <View style={styles.icon_message_box}>
              <Image
                source={warning}
                aria-hidden
                accessible={false}
                style={styles.icon}
              />
              <Text style={styles.message}>
                Before accessing classes for {courseKey} you must join the
                course.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.buttonJoin}
            onPress={() => {
              // navigation.navigate("Tabs", {
              //   screen: "Courses",
              //   params: {
              //     user: { id: userId },
              //     action: {
              //       type: "join",
              //       courseKey,
              //     },
              //   },
              // });
              setVisibleAlert(false);
              setIsMember(true);
              setUsers((u) => {
                const userIndex = users.findIndex((x) => x.id === userId);
                if (userIndex !== -1) {
                  const updatedUsers = [...u];
                  if (!(courseKey in updatedUsers[userIndex].courses_classes)) {
                    if (!updatedUsers[userIndex].courses_classes) {
                      updatedUsers[userIndex].courses_classes = {};
                    }
                    updatedUsers[userIndex].courses_classes[courseKey] = [];
                    return [...updatedUsers];
                  }
                  return u;
                }
              });
              setCourses((c) => {
                if (courseKey in c) {
                  const newCourses = { ...c };
                  newCourses[courseKey].participants = [
                    ...newCourses[courseKey].participants,
                    userId,
                  ];
                  return { ...newCourses };
                }
                return c;
              });
            }}
          >
            <Text style={styles.buttonJoinText}>Join Course</Text>
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
  message: {
    padding: 15,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 5,
  },
  overlay: {
    borderRadius: 10,
  },
  modalButtonTextLeave: {
    color: '#D72424',
    fontWeight: 'bold',
  },
});

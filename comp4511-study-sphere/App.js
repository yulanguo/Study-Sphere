import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Svg, { Path, Text as SvgText } from "react-native-svg";

import Courses from "./screens/Courses";
import StudySessions from "./screens/StudySessions";
import Availabilities from "./screens/Availabilities";
import StudyTools from "./screens/StudyTools";
import Settings from "./screens/Settings";
import CreateStudySessionScreen from "./screens/CreateStudySession";

import LogIn from "./screens/Login";
import SignUp from "./screens/SignUp";
import Classes from "./screens/Classes";
import ClassDetails from "./screens/ClassDetails";

import Create from "./screens/Create";
import Edit from "./screens/Edit";
import Detail from "./screens/Detail";
import Timer from "./screens/Timer";

import dbUsers from "./database/users.json";
import dbCourses from "./database/courses.json";
import dbStudySession from "./database/study_sessions.json";
import StoreService from "./services/StoreService";
import StudySessionDetails from "./screens/StudySessionDetails";
import FilterStudySessions from "./screens/FilterStudySessions";

function MyTabBar({ state, descriptors, navigation }) {
  const tabIcons = {
    Courses: {
      svg: (
        <Svg
          width="74"
          height="62"
          viewBox="0 0 74 62"
          fill="black"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M73.064 48.5849C73.064 67.9148 34.1116 60.3701 14.7816 60.3701C-4.54831 60.3701 -3.43591 17.3654 9.56409 6.58487C30.0641 -10.4151 32.4991 10.8701 52.7816 10.8701C73.064 10.8701 73.064 29.2549 73.064 48.5849Z"
            fill="black"
          />
          <Path
            d="M42.5 12.5C43.163 12.5 43.7989 12.7634 44.2678 13.2322C44.7366 13.7011 45 14.337 45 15V35C45 35.663 44.7366 36.2989 44.2678 36.7678C43.7989 37.2366 43.163 37.5 42.5 37.5H27.5C26.837 37.5 26.2011 37.2366 25.7322 36.7678C25.2634 36.2989 25 35.663 25 35V15C25 14.337 25.2634 13.7011 25.7322 13.2322C26.2011 12.7634 26.837 12.5 27.5 12.5H42.5ZM42.5 15H36.25V25L33.125 22.1875L30 25V15H27.5V35H42.5V15Z"
            fill="#B0AFFF"
          />
          <SvgText
            x="50%"
            y="80%"
            fontSize="9"
            textAnchor="middle"
            // alignmentBaseline="middle"
            fill="#B0AFF1"
          >
            Courses
          </SvgText>
        </Svg>
      ),
      text: "Course",
      icon: "book-outline",
    },
    "Study Sessions": {
      svg: (
        <Svg
          width="74"
          height="62"
          viewBox="0 0 74 62"
          fill="black"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M73.064 48.5849C73.064 67.9148 34.1116 60.3701 14.7816 60.3701C-4.54831 60.3701 -3.43591 17.3654 9.56409 6.58487C30.0641 -10.4151 32.4991 10.8701 52.7816 10.8701C73.064 10.8701 73.064 29.2549 73.064 48.5849Z"
            fill="black"
          />
          <Path
            d="M32.75 23.75H35.25V26.25H32.75V23.75ZM50.25 16.25V33.75C50.25 35.1375 49.1375 36.25 47.75 36.25H30.25C28.8625 36.25 27.75 35.125 27.75 33.75V16.25C27.75 14.875 28.875 13.75 30.25 13.75H31.5V11.25H34V13.75H44V11.25H46.5V13.75H47.75C49.1375 13.75 50.25 14.875 50.25 16.25ZM30.25 18.75H47.75V16.25H30.25V18.75ZM47.75 33.75V21.25H30.25V33.75H47.75ZM42.75 26.25V23.75H45.25V26.25H42.75ZM37.75 26.25V23.75H40.25V26.25H37.75ZM32.75 28.75H35.25V31.25H32.75V28.75ZM42.75 31.25V28.75H45.25V31.25H42.75ZM37.75 31.25V28.75H40.25V31.25H37.75Z"
            fill="#B0AFF1"
          />
          <SvgText
            x="50%"
            y="80%"
            fontSize="9"
            textAnchor="middle"
            // alignmentBaseline="middle"
            fill="#B0AFF1"
          >
            Study Sessions
          </SvgText>
        </Svg>
      ),
      text: "Study Sessions",
      icon: "calendar-month-outline",
    },
    Availabilities: {
      svg: (
        <Svg
          width="74"
          height="62"
          viewBox="0 0 74 62"
          fill="black"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M73.064 48.5849C73.064 67.9148 34.1116 60.3701 14.7816 60.3701C-4.54831 60.3701 -3.43591 17.3654 9.56409 6.58487C30.0641 -10.4151 32.4991 10.8701 52.7816 10.8701C73.064 10.8701 73.064 29.2549 73.064 48.5849Z"
            fill="black"
          />
          <Path
            d="M37.5 34.5C40.1522 34.5 42.6957 33.4464 44.5711 31.5711C46.4464 29.6957 47.5 27.1522 47.5 24.5C47.5 21.8478 46.4464 19.3043 44.5711 17.4289C42.6957 15.5536 40.1522 14.5 37.5 14.5C34.8478 14.5 32.3043 15.5536 30.4289 17.4289C28.5536 19.3043 27.5 21.8478 27.5 24.5C27.5 27.1522 28.5536 29.6957 30.4289 31.5711C32.3043 33.4464 34.8478 34.5 37.5 34.5ZM37.5 12C39.1415 12 40.767 12.3233 42.2835 12.9515C43.8001 13.5797 45.1781 14.5004 46.3388 15.6612C47.4996 16.8219 48.4203 18.1999 49.0485 19.7165C49.6767 21.233 50 22.8585 50 24.5C50 27.8152 48.683 30.9946 46.3388 33.3388C43.9946 35.683 40.8152 37 37.5 37C30.5875 37 25 31.375 25 24.5C25 21.1848 26.317 18.0054 28.6612 15.6612C31.0054 13.317 34.1848 12 37.5 12ZM38.125 18.25V24.8125L43.75 28.15L42.8125 29.6875L36.25 25.75V18.25H38.125Z"
            fill="#B0AFF1"
          />
          <SvgText
            x="50%"
            y="80%"
            fontSize="9"
            textAnchor="middle"
            // alignmentBaseline="middle"
            fill="#B0AFF1"
          >
            Availabilities
          </SvgText>
        </Svg>
      ),
      text: "Availabilities",
      icon: "clock-outline",
    },
    "Study Tools": {
      svg: (
        <Svg
          width="74"
          height="62"
          viewBox="0 0 74 62"
          fill="black"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M73.064 48.5849C73.064 67.9148 34.1116 60.3701 14.7816 60.3701C-4.54831 60.3701 -3.43591 17.3654 9.56409 6.58487C30.0641 -10.4151 32.4991 10.8701 52.7816 10.8701C73.064 10.8701 73.064 29.2549 73.064 48.5849Z"
            fill="black"
          />
          <Path
            d="M26.0125 31.825V36.5125H30.7L44.525 22.675L39.8375 17.9875L26.0125 31.825ZM50.525 33.2125L45.2125 38.525L38.7125 32.025L40.925 29.8125L42.175 31.0625L45.2625 27.9625L47.0375 29.7375L45.2125 31.5125L46.5375 32.7625L48.3125 31.0125L50.525 33.2125ZM30.525 23.8L24 17.3125L29.3125 12L31.5125 14.2125L28.425 17.3125L29.7625 18.6375L32.8375 15.5375L34.6125 17.3125L32.8375 19.075L34.0875 20.325L30.525 23.8ZM48.15 19.0125C48.6375 18.525 48.6375 17.7625 48.15 17.25L45.225 14.375C44.7625 13.8875 43.95 13.8875 43.4625 14.375L41.1625 16.6625L45.85 21.35L48.15 19.0125Z"
            fill="#B0AFFF"
          />
          <SvgText
            x="50%"
            y="80%"
            fontSize="9"
            textAnchor="middle"
            // alignmentBaseline="middle"
            fill="#B0AFF1"
          >
            Study Tools
          </SvgText>
        </Svg>
      ),
      text: "Study Tools",
      icon: "pencil-ruler",
    },
    Settings: {
      svg: (
        <Svg
          width="74"
          height="62"
          viewBox="0 0 74 62"
          fill="black"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M73.064 48.5849C73.064 67.9148 34.1116 60.3701 14.7816 60.3701C-4.54831 60.3701 -3.43591 17.3654 9.56409 6.58487C30.0641 -10.4151 32.4991 10.8701 52.7816 10.8701C73.064 10.8701 73.064 29.2549 73.064 48.5849Z"
            fill="black"
          />
          <Path
            d="M35 29.375C33.8397 29.375 32.7269 28.9141 31.9065 28.0936C31.086 27.2731 30.625 26.1603 30.625 25C30.625 23.8397 31.086 22.7269 31.9065 21.9064C32.7269 21.0859 33.8397 20.625 35 20.625C36.1604 20.625 37.2732 21.0859 38.0936 21.9064C38.9141 22.7269 39.375 23.8397 39.375 25C39.375 26.1603 38.9141 27.2731 38.0936 28.0936C37.2732 28.9141 36.1604 29.375 35 29.375ZM44.2875 26.2125C44.3375 25.8125 44.375 25.4125 44.375 25C44.375 24.5875 44.3375 24.175 44.2875 23.75L46.925 21.7125C47.1625 21.525 47.225 21.1875 47.075 20.9125L44.575 16.5875C44.425 16.3125 44.0875 16.2 43.8125 16.3125L40.7 17.5625C40.05 17.075 39.375 16.65 38.5875 16.3375L38.125 13.025C38.075 12.725 37.8125 12.5 37.5 12.5H32.5C32.1875 12.5 31.925 12.725 31.875 13.025L31.4125 16.3375C30.625 16.65 29.95 17.075 29.3 17.5625L26.1875 16.3125C25.9125 16.2 25.575 16.3125 25.425 16.5875L22.925 20.9125C22.7625 21.1875 22.8375 21.525 23.075 21.7125L25.7125 23.75C25.6625 24.175 25.625 24.5875 25.625 25C25.625 25.4125 25.6625 25.8125 25.7125 26.2125L23.075 28.2875C22.8375 28.475 22.7625 28.8125 22.925 29.0875L25.425 33.4125C25.575 33.6875 25.9125 33.7875 26.1875 33.6875L29.3 32.425C29.95 32.925 30.625 33.35 31.4125 33.6625L31.875 36.975C31.925 37.275 32.1875 37.5 32.5 37.5H37.5C37.8125 37.5 38.075 37.275 38.125 36.975L38.5875 33.6625C39.375 33.3375 40.05 32.925 40.7 32.425L43.8125 33.6875C44.0875 33.7875 44.425 33.6875 44.575 33.4125L47.075 29.0875C47.225 28.8125 47.1625 28.475 46.925 28.2875L44.2875 26.2125Z"
            fill="#B0AFF1"
          />
          <SvgText
            x="50%"
            y="80%"
            fontSize="9"
            textAnchor="middle"
            // alignmentBaseline="middle"
            fill="#B0AFF1"
          >
            Settings
          </SvgText>
        </Svg>
      ),
      text: "Settings",
      icon: "cog",
    },
  };

  return (
    <View style={{ flexDirection: "row" }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const tabIcon = tabIcons[route.name];
        // const iconName = ["book-outline", "calendar-month-outline", "clock-outline","pencil-ruler", "cog"]
        const isFocused = state.routeNames[state.index] === route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 20,
            }}
          >
            {isFocused ? (
              tabIcon.svg
            ) : (
              <View style={{ alignItems: "center" }}>
                <MaterialCommunityIcons
                  name={tabIcon.icon}
                  size={30}
                  color="black"
                />
                <Text style={{ fontSize: 9 }}>{tabIcon.text}</Text>
              </View>
            )}

            {/* <Text style={{ color: isFocused ? "#673ab7" : "#222" }}>
              {tabIcon.text}
            </Text> */}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const Tabs = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

export default function App() {
  const [users, setUsers] = useState(dbUsers);
  const [courses, setCourses] = useState(dbCourses);
  const [studySessions, setStudySessions] = useState(dbStudySession);
  const [userId, setUserId] = useState(null);
  const [isLoadedIntially, setIsLoadedIntially] = useState(false);

  // Load info from store
  useEffect(() => {
    StoreService.getDB()
      .then((db) => {
        if ("users" in db && db.users) {
          setUsers(db.users);
        } else {
          setUsers(dbUsers);
        }
        if ("courses" in db && db.courses) {
          setCourses(db.courses);
        } else {
          setCourses(dbCourses);
        }
        if ("studySessions" in db && db.studySessions) {
          setStudySessions(db.studySessions);
        } else {
          setStudySessions(dbStudySession);
        }
        if ("userId" in db && db.userId && db.userId !== "") {
          setUserId(db.userId);
        } else {
          setUserId(null);
        }
      })
      .then(() => setIsLoadedIntially(true));
  }, []);

  // Save info to store
  useEffect(() => {
    StoreService.saveDB({
      courses,
      users,
      studySessions,
      userId: userId ? userId : "",
    });
  }, [users, courses, studySessions, userId]);

  const BottomTabs = (params) => {
    return (
      <View style={styles.background}>
        <Tabs.Navigator
          tabBar={(props) => <MyTabBar {...props} />}
          screenOptions={{
            headerStyle: { backgroundColor: "#C1C3EC" },
            tabBarActiveBackgroundColor: "#C1C3EC",
            tabBarActiveTintColor: "black",
          }}
          style={styles.background}
        >
          <Tabs.Screen
            name="Courses"
            options={{
              tabBarIcon: ({ size }) => (
                <MaterialCommunityIcons
                  name="book-outline"
                  size={size}
                  color="black"
                />
              ),
              headerTitle: "Courses",
            }}
            style={styles.background}
          >
            {(props) => <Courses {...params} {...props} />}
          </Tabs.Screen>
          <Tabs.Screen
            name="Study Sessions"
            options={{
              tabBarIcon: ({ size }) => (
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={size}
                  color="black"
                />
              ),
              headerTitle: "Study Sessions",
            }}
          >
            {(props) => <StudySessions {...params} {...props} />}
          </Tabs.Screen>
          <Tabs.Screen
            name="Availabilities"
            options={{
              tabBarIcon: ({ size }) => (
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={size}
                  color="black"
                />
              ),
              headerTitle: "Availabilities",
            }}
          >
            {(props) => <Availabilities {...params} {...props} />}
          </Tabs.Screen>
          <Tabs.Screen
            name="Study Tools"
            options={{
              tabBarIcon: ({ size }) => (
                <MaterialCommunityIcons
                  name="pencil-ruler"
                  size={size}
                  color="black"
                />
              ),
              headerTitle: "Study Tools",
            }}
            style={styles.background}
          >
            {(props) => <StudyTools {...params} {...props} />}
          </Tabs.Screen>
          <Tabs.Screen
            name="Settings"
            options={{
              tabBarIcon: ({ size }) => (
                <MaterialCommunityIcons name="cog" size={size} color="black" />
              ),
              headerTitle: "Settings",
            }}
          >
            {(props) => <Settings {...params} {...props} />}
          </Tabs.Screen>
        </Tabs.Navigator>
      </View>
    );
  };
  return (
    <View style={styles.background}>
      {!isLoadedIntially ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <NavigationContainer style={styles.background}>
          <RootStack.Navigator
            initialRouteName={
              userId && userId <= users.length ? "Tabs" : "Login"
            }
            style={styles.background}
            screenOptions={{
              headerStyle: { backgroundColor: "#C1C3EC" },
              tabBarActiveBackgroundColor: "#C1C3EC",
              headerTintColor: "black",
            }}
          >
            <RootStack.Screen name="Login" options={{ headerShown: false }}>
              {(props) => (
                <LogIn
                  {...props}
                  users={users}
                  courses={courses}
                  studySessions={studySessions}
                  userId={userId}
                  setUsers={setUsers}
                  setCourses={setCourses}
                  setStudySessions={setStudySessions}
                  setUserId={setUserId}
                />
              )}
            </RootStack.Screen>
            <RootStack.Screen
              name="SignUp"
              options={{ headerTitle: "Sign Up", headerBackTitle: "Log In" }}
            >
              {(props) => (
                <SignUp
                  {...props}
                  users={users}
                  courses={courses}
                  studySessions={studySessions}
                  userId={userId}
                  setUsers={setUsers}
                  setCourses={setCourses}
                  setStudySessions={setStudySessions}
                  setUserId={setUserId}
                />
              )}
            </RootStack.Screen>
            <RootStack.Screen
              name="Tabs"
              options={{ headerShown: false }}
              style={styles.background}
            >
              {(props) => (
                <BottomTabs
                  {...props}
                  users={users}
                  courses={courses}
                  studySessions={studySessions}
                  userId={userId}
                  setUsers={setUsers}
                  setCourses={setCourses}
                  setStudySessions={setStudySessions}
                  setUserId={setUserId}
                />
              )}
            </RootStack.Screen>
            <RootStack.Screen
              name="Detail"
              options={{ headerBackTitle: "Back" }}
            >
              {(props) => (
                <Detail
                  {...props}
                  users={users}
                  courses={courses}
                  studySessions={studySessions}
                  userId={userId}
                  setUsers={setUsers}
                  setCourses={setCourses}
                  setStudySessions={setStudySessions}
                  setUserId={setUserId}
                />
              )}
            </RootStack.Screen>
            <RootStack.Screen
              name="Classes"
              options={{ headerBackTitle: "Back" }}
            >
              {(props) => (
                <Classes
                  {...props}
                  users={users}
                  courses={courses}
                  studySessions={studySessions}
                  userId={userId}
                  setUsers={setUsers}
                  setCourses={setCourses}
                  setStudySessions={setStudySessions}
                  setUserId={setUserId}
                />
              )}
            </RootStack.Screen>
            <RootStack.Screen
              name="ClassDetails"
              options={{ headerBackTitle: "Back" }}
            >
              {(props) => (
                <ClassDetails
                  {...props}
                  users={users}
                  courses={courses}
                  studySessions={studySessions}
                  userId={userId}
                  setUsers={setUsers}
                  setCourses={setCourses}
                  setStudySessions={setStudySessions}
                  setUserId={setUserId}
                />
              )}
            </RootStack.Screen>
            <RootStack.Screen
              name="StudySessionDetails"
              options={{ headerBackTitle: "Back" }}
            >
              {(props) => (
                <StudySessionDetails
                  {...props}
                  users={users}
                  courses={courses}
                  studySessions={studySessions}
                  userId={userId}
                  setUsers={setUsers}
                  setCourses={setCourses}
                  setStudySessions={setStudySessions}
                  setUserId={setUserId}
                />
              )}
            </RootStack.Screen>
            <RootStack.Screen
              name="Filter Study Sessions"
              options={{ headerBackTitle: "Back" }}
            >
              {(props) => <FilterStudySessions {...props} />}
            </RootStack.Screen>
            <RootStack.Screen name="Create" options={{ presentation: "modal" }}>
              {(props) => (
                <Create
                  {...props}
                  users={users}
                  courses={courses}
                  studySessions={studySessions}
                  userId={userId}
                  setUsers={setUsers}
                  setCourses={setCourses}
                  setStudySessions={setStudySessions}
                  setUserId={setUserId}
                />
              )}
            </RootStack.Screen>
            <RootStack.Screen name="Edit" options={{ presentation: "modal" }}>
              {(props) => (
                <Edit
                  {...props}
                  users={users}
                  courses={courses}
                  studySessions={studySessions}
                  userId={userId}
                  setUsers={setUsers}
                  setCourses={setCourses}
                  setStudySessions={setStudySessions}
                  setUserId={setUserId}
                />
              )}
            </RootStack.Screen>
            <RootStack.Screen
              name="Timer"
              options={{ headerBackTitle: "Back" }}
            >
              {(props) => (
                <Timer
                  {...props}
                  users={users}
                  courses={courses}
                  studySessions={studySessions}
                  userId={userId}
                  setUsers={setUsers}
                  setCourses={setCourses}
                  setStudySessions={setStudySessions}
                  setUserId={setUserId}
                />
              )}
            </RootStack.Screen>
            <RootStack.Screen
              name="CreateStudySession"
              options={{
                // tabBarIcon: ({ size }) => (
                //   // Custom icon or MaterialCommunityIcons
                //   // Add your preferred icon here
                //   <MaterialCommunityIcons name='plus' size={size} color='black' />
                // ),
                headerTitle: "Create Study Session",
              }}
            >
              {/* Render the CreateStudySession component */}
              {(props) => (
                <CreateStudySessionScreen {...props} userId={userId} />
              )}
            </RootStack.Screen>
          </RootStack.Navigator>
        </NavigationContainer>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    height: "100%",
  },
  background: {
    height: "100%",
    width: "100%",
  },
  btmNavBackground: {
    height: "100%",
    width: "100%",
    borderRadius: 5,
    color: "white",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

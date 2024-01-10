import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StudySessionCard from '../components/StudySessionCard';
import { ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment/moment';
import { MaterialIcons } from '@expo/vector-icons';

export default function StudySessions({ navigation, users, userId }) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'first',
      title: 'All Sessions',
      accessibilityLabel: 'Viewing all study sessions',
    },
    {
      key: 'second',
      title: 'My Sessions',
      accessibilityLabel: 'Viewing my study sessions',
    },
  ]);
  const layout = useWindowDimensions();
  const [listOfStudySessions, setListOfStudySessions] = useState([]);
  const [receivedFilters, setReceivedFilters] = useState({
    filteredCourse: [],
    filteredDate: null,
    filteredTimeFrom: null,
    filteredTimeTo: null,
  });

  const userOfInterest = users.filter((user) => user.id === userId);
  useEffect(() => {
    getCreatedStudySessions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getCreatedStudySessions();
    }, [])
  );

  const handleJoin = async (idx) => {
    try {
      const dataOfInterest = await AsyncStorage.getItem('createSessionData');
      if (dataOfInterest) {
        const parsedData = JSON.parse(dataOfInterest);
        const currSession = parsedData[idx];

        if (!currSession.members.includes(userId)) {
          const updatedSessions = parsedData.map((data, sessionIdx) => {
            if (sessionIdx === idx) {
              return {
                ...data,
                members: [...data.members, userId],
                participants: [...data.participants, userOfInterest[0].name],
              };
            }
            return data;
          });
          await AsyncStorage.setItem(
            'createSessionData',
            JSON.stringify(updatedSessions)
          );
          setListOfStudySessions(updatedSessions);
        } else {
          alert('User already exists in this session!');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const setFiltersWhenSent = (filters) => {
    setReceivedFilters(filters);
  };

  const handleLeave = async (idx) => {
    try {
      const dataOfInterest = await AsyncStorage.getItem('createSessionData');

      if (dataOfInterest) {
        const parsedData = JSON.parse(dataOfInterest);
        const updatedSessions = parsedData.map((data, sessionIdx) => {
          if (sessionIdx === idx) {
            // update the members by filtering out any entries that have the userId
            // update the participants by filtering out any entries that have the user's name
            return {
              ...data,
              members: data.members.filter((member) => userId !== member),
              participants: data.participants.filter(
                (participant) => userOfInterest[0].name !== participant
              ),
            };
          }
          return data;
        });

        await AsyncStorage.setItem(
          'createSessionData',
          JSON.stringify(updatedSessions)
        );
        setListOfStudySessions(updatedSessions);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filterSessions = listOfStudySessions.filter((data) => {
    const filterByCourse =
      receivedFilters.filteredCourse.length === 0 ||
      receivedFilters.filteredCourse.includes(data.course);

    const filterByDates =
      new Date(receivedFilters.filteredDate).toDateString() ===
        new Date(data.date).toDateString() || !receivedFilters.filteredDate;

    const fromTime = moment(data.date).set({
      hour: data.fromTime?.hours || 0,
      minute: data.fromTime?.minutes || 0,
    });
    const toTime = moment(data.date).set({
      hour: data.toTime?.hours || 0,
      minute: data.toTime?.minutes || 0,
    });
    const filteredFromTime = moment(new Date(receivedFilters.filteredDate)).set(
      {
        hour: receivedFilters.filteredTimeFrom?.hours || 0,
        minute: receivedFilters.filteredTimeFrom?.minutes || 0,
      }
    );
    const filteredToTime = moment(new Date(receivedFilters.filteredDate)).set({
      hour: receivedFilters.filteredTimeTo?.hours || 23,
      minute: receivedFilters.filteredTimeTo?.minutes || 59,
    });

    //     fromTime ---------- toTime
    // filteredFrom --------------------- filteredTo
    // Only accept if the time from and toTime are between the filtered range
    const filterByTime =
      (!receivedFilters.filteredTimeFrom ||
        fromTime.isSameOrAfter(filteredFromTime)) &&
      (!receivedFilters.filteredTimeTo ||
        toTime.isSameOrBefore(filteredToTime));

    return filterByCourse && filterByDates && filterByTime;
  });

  const removeFilters = () => {
    const initialState = {
      filteredCourse: [],
      filteredDate: null,
      filteredTimeFrom: null,
      filteredTimeTo: null,
    };
    setReceivedFilters(initialState);
  };

  // checks if the at least one value is returned
  // for the filter request
  const checkFilterApplied =
    receivedFilters.filteredCourse.length > 0 ||
    receivedFilters.filteredDate ||
    receivedFilters.filteredTimeFrom ||
    receivedFilters.filteredTimeTo;

  /**
   * Checks if there has been a filter applied, if so
   * go ahead and display the filter button
   */
  const clearFiltersButton = checkFilterApplied ? (
    <Pressable style={[styles.filterContainer]} onPress={removeFilters}>
      <Text style={styles.filterText}>Clear Existing Filters</Text>
      <Pressable onPress={removeFilters}>
        <MaterialIcons name='delete' size={20} color='black' />
      </Pressable>
    </Pressable>
  ) : null;

  const filterButton = checkFilterApplied ? (
    clearFiltersButton
  ) : (
    <Pressable
      onPress={() =>
        navigation.navigate('Filter Study Sessions', {
          applyFilters: setFiltersWhenSent,
        })
      }
      style={styles.filterContainer}
    >
      <Text style={styles.filterText}>Filter Sessions</Text>
      <Pressable onPress={() => navigation.navigate('Filter Study Sessions')}>
        <FontAwesome5 name='filter' size={20} color='black' />
      </Pressable>
    </Pressable>
  );

  const logout = () => {
    navigation.navigate('Login');
  };
  // logout();

  const renderAllSessions = () => {
    const [search, setSearch] = useState('');
    const searchedSessions = listOfStudySessions.filter((data) =>
      data.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <ScrollView style={styles.container}>
        <View style={styles.filterContainer}>{filterButton}</View>

        <SearchBar
          placeholder='Search for study sessions'
          value={search}
          onChangeText={setSearch}
          lightTheme
          round
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.innerSearchContainer}
          inputStyle={styles.searchPlaceholder}
          placeholderTextColor='#6A74CF'
          accessibilityRole='search'
        />

        {/* if filters are applied then go ahead and display the filteredSessions else the searchSessions */}
        {checkFilterApplied
          ? filterSessions.map((data, idx) => (
              <StudySessionCard
                key={idx}
                studySessionInfo={data}
                userId={userId}
                navigation={navigation}
                sessionIdx={idx}
                handleJoin={handleJoin}
                handleLeave={handleLeave}
              />
            ))
          : searchedSessions.map((data, idx) => (
              <StudySessionCard
                key={idx}
                studySessionInfo={data}
                userId={userId}
                navigation={navigation}
                sessionIdx={idx}
                handleJoin={handleJoin}
                handleLeave={handleLeave}
              />
            ))}
      </ScrollView>
    );
  };

  const checkAsyncStorage = async () => {
    console.log(await AsyncStorage.getItem('buttonColorsByDate'));
  };

  const renderMySessions = () => {
    const [search, setSearch] = useState('');

    const sessionsOwner = listOfStudySessions.filter((session) =>
      session.members.includes(userId)
    );

    const searchedSessions = sessionsOwner.filter((data) =>
      data.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <ScrollView style={styles.container}>
        <View style={styles.filterContainer}>{filterButton}</View>
        <SearchBar
          placeholder='Search for my study sessions'
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
        {/* if filters are applied then go ahead and display the filteredSessions else the searchSessions */}
        {checkFilterApplied
          ? filterSessions.map((data, idx) => (
              <StudySessionCard
                key={idx}
                studySessionInfo={data}
                userId={userId}
                navigation={navigation}
                sessionIdx={idx}
                handleJoin={handleJoin}
                handleLeave={handleLeave}
              />
            ))
          : searchedSessions.map((data, idx) => (
              <StudySessionCard
                key={idx}
                studySessionInfo={data}
                userId={userId}
                navigation={navigation}
                sessionIdx={idx}
                handleJoin={handleJoin}
                handleLeave={handleLeave}
              />
            ))}
      </ScrollView>
    );
  };

  const getCreatedStudySessions = async () => {
    try {
      const dataOfInterest = await AsyncStorage.getItem('createSessionData');
      if (dataOfInterest) {
        const parsedData = JSON.parse(dataOfInterest);
        setListOfStudySessions(parsedData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const renderScene = SceneMap({
    first: renderAllSessions,
    second: renderMySessions,
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#B6B2E6', '#C5DDBA']} style={styles.background}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              style={styles.shadowProp}
              tabStyle={styles.topTab}
              renderLabel={({ route, focused, color }) => (
                <Text
                  style={{
                    ...styles.tabLabel,
                    color: focused ? 'white' : 'black',
                    backgroundColor: focused ? 'black' : 'transparent',
                    borderColor: focused ? 'white' : 'transparent',
                    width: Number((layout.width / routes.length).toFixed() - 4),
                  }}
                >
                  {route.title}
                </Text>
              )}
            />
          )}
        />
        <Pressable
          accessibilityLabel='Create study session'
          onPress={() => navigation.navigate('CreateStudySession')}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            paddingRight: 10,
          }}
        >
          <MaterialCommunityIcons name='plus-circle' size={80} color='black' />
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
  contentContainer: {
    flex: 1,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingRight: 6,
  },
  filterText: {
    fontWeight: 'bold',
    marginRight: 5,
    textDecorationLine: 'underline',
  },
});

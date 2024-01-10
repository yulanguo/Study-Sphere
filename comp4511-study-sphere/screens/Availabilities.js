import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Button,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { SearchBar } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";

export default function Availabilities({
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
  const today = new Date().toISOString().split("T")[0];
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "myAvailability", title: "Personal" },
    { key: "groupAvailabilities", title: "Group" },
  ]);

  const getAvailabilityText = (color) => {
    if (color === "green") {
      return "Available";
    } else {
      return "Unavailable";
    }
  };

  const getAvailabilityText2 = (color) => {
    if (color === "green") {
      return "Unavailable";
    } else {
      return "Available";
    }
  };

  const dateFormat = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const buttonstyle = (color) => ({
    ...styles.timeSlot,
    backgroundColor: color === "green" ? "#DFF2BF" : "#FFB6B6",
    //paddingVertical: 25,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 2,
  });

  const ToggleButton = ({ title, isSelected, onSelect }) => {
    return (
      <TouchableOpacity
        style={[styles.button2, isSelected ? styles.selectedButton : {}]}
        onPress={() => onSelect(title)}
      >
        <Text
          style={[
            styles.buttonText,
            isSelected ? styles.selectedButtonText : {},
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const timeSlots = [
    { time: "7 AM", availability: 0 },
    { time: "8 AM", availability: 25 },
    { time: "9 AM", availability: 25 },
    { time: "10 AM", availability: 50 },
    { time: "11 AM", availability: 25 },
    { time: "12 AM", availability: 100 },
    { time: "1 AM", availability: 25 },
    { time: "2 AM", availability: 25 },
    { time: "3 AM", availability: 25 },
    { time: "4 AM", availability: 75 },
    { time: "5 PM", availability: 0 },
  ];

  const GroupAvailabilitiesScene = () => {
    const [search, setSearch] = useState("");
    const [selectedButton, setSelectedButton] = useState("COMP3511");
    const [selectedDate, setSelectedDate] = useState(null);
    const handleSelect = (title) => {
      setSelectedButton(title);
    };

    const getButtonColor = (availability) => {
      if (availability === 0) return "#FFB6B6";
      if (availability === 25) return "#FFDAA5";
      if (availability === 50) return "#8DB4E2";
      if (availability === 75) return "#8497B0";
      if (availability === 100) return "#90EE90";
      return "#FFFFFF";
    };

    const storeSelectedDate = async (dateString) => {
      try {
        await AsyncStorage.setItem("selectedDate", dateString);
      } catch (e) {
        console.error("Failure");
      }
    };

    const loadSelectedDate = async () => {
      try {
        const dateString = await AsyncStorage.getItem("selectedDate");
        return dateString;
      } catch (e) {
        console.error("Failure");
      }
    };

    useEffect(() => {
      const initializeDate = async () => {
        const storedDate = await loadSelectedDate();
        if (storedDate) {
          setSelectedDate(storedDate);
        }
      };

      initializeDate();
    }, []);

    const renderAvailability = () => {
      if (!selectedDate) {
        return null;
      }
      return timeSlots.map((slot, index) => (
        <View
          key={index}
          style={[
            buttonstyle2(getButtonColor(slot.availability)),
            styles.timeSlotButton,
          ]}
        >
          <View style={styles.slot}>
            <Text style={styles.timeText}>{slot.time}</Text>
            <Text style={styles.timeTextAvailability}>
              {getAvailabilityText2(getButtonColor(slot.availability))} (
              {slot.availability}%)
            </Text>
          </View>
        </View>
      ));
    };

    const buttonstyle2 = (color) => ({
      ...styles.timeSlot,
      borderWidth: 1,
      borderColor: "gray",
      backgroundColor: color,
      justifyContent: "flex-start",
      alignItems: "flex-start",
    });

    const changeDate2 = (date) => {
      const dateString = new Date(date).toISOString().split("T")[0];
      setSelectedDate(dateString);
      storeSelectedDate(dateString);
    };

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#B6B2E6", "#C5DDBA"]}
          style={styles.background}
        >
          <ScrollView contentContainerStyle={styles.containerInner}>
            <SearchBar
              placeholder={`Add Courses to View Availability`}
              onChangeText={setSearch}
              value={search}
              lightTheme
              round
              containerStyle={styles.searchContainer}
              inputContainerStyle={styles.innerSearchContainer}
              inputStyle={styles.searchPlaceholder}
              placeholderTextColor="#6A74CF"
              accessibilityRole="search"
            />
            <View>
              <View style={styles.buttonContainer}>
                <ToggleButton
                  title="COMP3511"
                  isSelected={selectedButton === "COMP3511"}
                  onSelect={handleSelect}
                />
                <ToggleButton
                  title="COMP4511"
                  isSelected={selectedButton === "COMP4511"}
                  onSelect={handleSelect}
                />
              </View>
            </View>
            <Text style={styles.title}>
              {"   "}Select a Date To View Availability
            </Text>
            <View style={styles.calendarContainer}>
              <View style={styles.calendarInnerContainer}>
                <CalendarPicker
                  onDateChange={changeDate2}
                  width={300}
                  selectedStartDate={
                    selectedDate ? new Date(selectedDate) : new Date()
                  }
                />
              </View>
              <View style={styles.timeSlotsContainer}>
                {selectedDate && (
                  <Text style={styles.dateText}>
                    {dateFormat(selectedDate)}
                  </Text>
                )}
                {renderAvailability()}
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  };

  const MyAvailabilityScene = () => {
    const [selectedDate, setSelectedDate] = useState(today);
    const [buttonColorsByDate, setButtonColorsByDate] = useState({});

    const changeDate = (date) => {
      const dateString = new Date(date).toISOString().split("T")[0];
      setSelectedDate(dateString);
      if (!(dateString in buttonColorsByDate)) {
        setButtonColorsByDate({
          ...buttonColorsByDate,
          [dateString]: {
            "7 AM": "green",
            "8 AM": "green",
            "9 AM": "green",
            "10 AM": "green",
            "11 AM": "green",
            "12 PM": "green",
            "1 PM": "green",
            "2 PM": "green",
            "3 PM": "green",
            "4 PM": "green",
            "5 PM": "green",
          },
        });
      }
      setSelectedDate(dateString);
    };

    const changeButtonColor = (buttonTitle) => {
      if (selectedDate) {
        const color1 = buttonColorsByDate[selectedDate];
        const color2 = color1[buttonTitle];
        let color3;
        if (color2 === "green") {
          color3 = "red";
        } else {
          color3 = "green";
        }
        setButtonColorsByDate((prevColorsByDate) => ({
          ...prevColorsByDate,
          [selectedDate]: {
            ...prevColorsByDate[selectedDate],
            [buttonTitle]: color3,
          },
        }));
      }
    };

    useEffect(() => {
      const loadData = async () => {
        try {
          const storedButtonColors = await AsyncStorage.getItem(
            "buttonColorsByDate"
          );
          changeDate(new Date());
          if (storedButtonColors !== null) {
            setButtonColorsByDate(JSON.parse(storedButtonColors));
          }
        } catch (e) {
          console.error("Failure");
        }
      };
      loadData();
    }, []);

    useEffect(() => {
      const saveData = async () => {
        try {
          await AsyncStorage.setItem(
            "buttonColorsByDate",
            JSON.stringify(buttonColorsByDate)
          );
        } catch (e) {
          console.error("Failure");
        }
      };
      saveData();
    }, [buttonColorsByDate]);

    return (
      <View>
        <LinearGradient
          colors={["#B6B2E6", "#C5DDBA"]}
          style={styles.background}
        >
          <View style={styles.container3}>
            <ScrollView>
              <Text style={styles.title}>
                Select a Date To View Availability
              </Text>
              <View style={styles.calendarContainer}>
                <View style={styles.calendarInnerContainer}>
                  <CalendarPicker
                    onDateChange={changeDate}
                    width={300}
                    selectedStartDate={new Date(selectedDate)}
                  />
                </View>
              </View>
              {selectedDate && buttonColorsByDate[selectedDate] && (
                <View>
                  <Text style={styles.dateText}>
                    {dateFormat(selectedDate)}
                  </Text>
                  {Object.keys(buttonColorsByDate[selectedDate]).map(
                    (timeSlot, index) => (
                      <TouchableOpacity
                        key={index}
                        style={buttonstyle(
                          buttonColorsByDate[selectedDate][timeSlot]
                        )}
                        onPress={() => changeButtonColor(timeSlot)}
                      >
                        <View style={styles.slot}>
                          <Text style={styles.timeText}>{timeSlot}</Text>
                          <Text style={styles.timeTextAvailability}>
                            {getAvailabilityText(
                              buttonColorsByDate[selectedDate][timeSlot]
                            )}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={SceneMap({
        myAvailability: MyAvailabilityScene,
        groupAvailabilities: GroupAvailabilitiesScene,
      })}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          style={styles.shadowProp}
          tabStyle={styles.topTab}
          renderLabel={({ route, focused, color }) => (
            <Text
              style={{
                ...styles.tabLabel,
                color: `${focused ? "white" : "black"}`,
                backgroundColor: `${focused ? "black" : "transparent"}`,
                borderColor: `${focused ? "white" : "transparent"}`,
                width: Number((layout.width / 2).toFixed() - 4),
              }}
            >
              {route.title}
            </Text>
          )}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  calendarInnerContainer: {
    backgroundColor: "white",
    padding: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
  },

  container2: {
    flex: "1",
  },

  container3: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  containerInner: {
    minHeight: "100%",
    width: "100%",
  },

  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginVertical: 4,
  },

  dateText: {
    marginVertical: 6,
    fontSize: 16,
  },

  button: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    // paddingVertical: 25,
    borderWidth: 1,
    borderColor: "gray",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  buttonText: {
    fontSize: 10,
  },

  calendarContainer: {
    marginVertical: 10,
    alignSelf: "center",
    width: 350,
    backgroundColor: "FFFFFF",
  },

  timeSlot: {
    // paddingVertical: 25,
    paddingHorizontal: 25,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    alignSelf: "stretch",
  },

  timeText: {
    fontSize: 16,
    color: "#5C5C5C",
    justifyContent: "flex-start",
    paddingTop: 5,

    alignSelf: "flex-start",

  },
  timeTextAvailability: {
    fontSize: 16,
    color: "#5C5C5C",
    paddingVertical: 20,
    paddingLeft: 30,
  },

  tabLabel: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderStyle: "solid",
    textAlign: "center",
    overflow: "hidden",
    fontWeight: "bold",
  },
  topTab: {
    backgroundColor: "#c1c3ec",
  },

  searchContainer: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    borderTopWidth: 0,
    marginBottom: 10,
    paddingBottom: 15,
    paddingHorizontal: 10,
  },

  innerSearchContainer: {
    backgroundColor: "white",
    height: 15,
    borderWidth: 1,
    borderColor: "gray",
  },

  searchPlaceholder: { fontWeight: "bold", fontSize: 14 },

  buttonContainer: {
    paddingTop: 2,
    paddingBottom: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  button2: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 20,
    height: 40,
    width: 60,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 8,
  },
  selectedButton: {
    backgroundColor: "#6A74CF",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
  },
  selectedButtonText: {
    color: "white",
  },

  background: {
    height: "100%",
    width: "100%",
  },
  timeSlotButton: {
    borderRadius: 5,
    marginBottom: 2,
  },
  slot: {
    width: "100%",
    flexDirection: "row",
  },
});


import React, { useCallback, useState } from "react";
import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "react-native-ui-datepicker";
import { TimePickerModal } from "react-native-paper-dates";
import { FontAwesome5 } from "@expo/vector-icons";
import dayjs from "dayjs";
import { Button } from "react-native-paper";
import { formatTime } from "../utils/helpers";
import { TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

export default function FilterStudySessions({ navigation, route }) {
  const [timeVisible, setTimeVisible] = useState(false);
  const [toTimeVisible, setToTimeVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [fromTime, setFromTime] = useState({ hours: 12, minutes: 0 });
  const [toTime, setToTime] = useState({ hours: 12, minutes: 0 });
  const [courseArray, setCourseArray] = useState([]);
  const [enteredCourse, setEnteredCourse] = useState("");

  const onTimeDismiss = useCallback(() => {
    setTimeVisible(false);
  }, [setTimeVisible]);

  const onTimeConfirm = useCallback(
    ({ hours, minutes }) => {
      setTimeVisible(false);
      setFromTime({ hours, minutes });
    },
    [setTimeVisible, setFromTime]
  );

  const onToTimeDismiss = useCallback(() => {
    setToTimeVisible(false);
  }, [setToTimeVisible]);

  const onToTimeConfirm = useCallback(
    ({ hours, minutes }) => {
      setToTimeVisible(false);
      setToTime({ hours, minutes });
    },
    [setToTimeVisible, setToTime]
  );

  const handleAddCourse = () => {
    if (enteredCourse) {
      // only add one course
      setCourseArray([enteredCourse]);
      setEnteredCourse("");
    }
  };

  const removeItemGivenIndex = (idx, setArrayState, arrayState) => {
    const currentState = [...arrayState];
    // go ahead and remove this entity
    currentState.splice(idx, 1);
    setArrayState(currentState);
  };

  const getItemsAdded = (itemsArray, removeItemFunction) => {
    return (
      <View style={styles.bubbleParentContainer}>
        {itemsArray.map((item, idx) => (
          <View style={styles.bubbleContainer} key={idx}>
            <Pressable style={styles.purpleBubble}>
              <View style={styles.bubbleContent}>
                <Text style={styles.bubbleText}>{item}</Text>
                <Pressable
                  style={styles.removeButton}
                  onPress={() => removeItemFunction(idx)}
                >
                  <MaterialIcons
                    name="highlight-remove"
                    size={30}
                    color="white"
                  />
                </Pressable>
              </View>
            </Pressable>
          </View>
        ))}
      </View>
    );
  };

  const sendFilteredDataParent = () => {
    const filteredRequest = {
      filteredCourse: courseArray,
      filteredDate: selectedDate,
      filteredTimeFrom: fromTime,
      filteredTimeTo: toTime,
    };

    route.params.applyFilters(filteredRequest);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#B6B2E6", "#C5DDBA"]} style={styles.background}>
        <View style={styles.formContainer}>
          <Text
            style={{
              marginBottom: 10,
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Select course to filter:
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Please enter the course"
              value={enteredCourse}
              onChangeText={(text) => setEnteredCourse(text)}
              style={styles.textInput}
            />
            <Pressable style={styles.addButton} onPress={handleAddCourse}>
              <FontAwesome5 name="plus" size={20} color="white" />
            </Pressable>
          </View>
          <View>
            {getItemsAdded(courseArray, (idx) =>
              removeItemGivenIndex(idx, setCourseArray, courseArray)
            )}
          </View>
          <Text
            style={{
              marginBottom: 10,
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Select date to filter:
          </Text>
          <View style={{ backgroundColor: "white", borderRadius: 15 }}>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              locale="en"
              onValueChange={(date) => setSelectedDate(dayjs(date))}
              displayFullDays={false}
              selectedItemColor="#4f46e5"
            />
          </View>

          <Text
            style={{
              marginBottom: 10,
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 20,
            }}
          >
            Select time to filter:
          </Text>
          <View style={styles.selectTimeSection}>
            <View style={styles.timeBtns}>
              <Button
                onPress={() => setTimeVisible(true)}
                uppercase={false}
                mode="outlined"
                style={{
                  backgroundColor: "#4f46e5",
                  width: "50%",
                  marginRight: 5,
                }}
                labelStyle={{ color: "white" }}
              >
                Select Start Time
              </Button>
              <TimePickerModal
                visible={timeVisible}
                onDismiss={onTimeDismiss}
                onConfirm={onTimeConfirm}
                hours={fromTime.hours}
                minutes={fromTime.minutes}
              />
              <Button
                onPress={() => setToTimeVisible(true)}
                uppercase={false}
                mode="outlined"
                style={{
                  backgroundColor: "#4f46e5",
                  width: "50%",
                }}
                labelStyle={{ color: "white" }}
              >
                Select Finish Time
              </Button>
              <TimePickerModal
                visible={toTimeVisible}
                onDismiss={onToTimeDismiss}
                onConfirm={onToTimeConfirm}
                hours={toTime.hours}
                minutes={toTime.minutes}
              />
            </View>
            <Text
              style={{
                marginTop: 20,
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {`From ${formatTime(
                fromTime.hours,
                fromTime.minutes
              )} - To ${formatTime(toTime.hours, toTime.minutes)}`}
            </Text>
          </View>

          <Pressable
            style={[styles.backNextButton]}
            onPress={() => {
              // console.log(
              //   `Selected Course: ${courseArray}\nSelected Date: ${selectedDate}\nSelected Start Time: ${fromTime}\nSelected To Time: ${toTime}`
              // );
              sendFilteredDataParent();
              navigation.navigate("Study Sessions");
            }}
          >
            <Text style={styles.nextPageBtnText}>Filter Results</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  background: {
    height: "100%",
    width: "100%",
  },
  textInput: {
    height: 50,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 8,
    marginBottom: 10,
    fontSize: 16,
    paddingLeft: 20,
    width: 330,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  formContainer: {
    padding: 8,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
  },
  addButton: {
    backgroundColor: "#4f46e5",
    borderRadius: 20,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    fontWeight: "bold",
  },
  purpleBubble: {
    backgroundColor: "#4f46e5",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  bubbleText: {
    color: "white",
    fontSize: 15,
  },
  bubbleParentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  bubbleContainer: {
    flexDirection: "row",
  },
  bubbleContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  removeButton: {
    marginLeft: 8,
  },
  nextPageBtnText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  selectTimeSection: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    marginBottom: 50,
  },
  timeBtns: {
    flexDirection: "row",
  },
  backNextButton: {
    backgroundColor: "#4f46e5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: 20,
    marginLeft: 5,
  },
});

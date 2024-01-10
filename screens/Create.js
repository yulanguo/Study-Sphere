import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Button,
  Image,
  Text,
  TextInput,
  View,
  ScrollView,
  Pressable,
  Platform,
  TouchableOpacity,
  Animated,
  Modal,
  Alert,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import Slider from "@react-native-community/slider";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const tagData = [
  { label: "To-do", value: "To-do" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
  { label: "Create New Tag", value: "Create New Tag" },
];

export default function Create({ route, navigation }) {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState(null);
  const [body, setBody] = useState("");
  const [img, setImg] = useState(null);
  const [isFocusTag, setIsFocusTag] = useState(false);

  // const [date, setDate] = useState(new Date());
  // const [showPicker, setShowPicker] = useState(false);

  const [datePicker, setDatePickerVisibile] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(null));
  const [formattedDate, setFormattedDate] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // base64: true,
    });
    if (!result.canceled) {
      setImg(result.assets[0].uri);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibile(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibile(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    setSelectedDate(date);

    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formatted = new Intl.DateTimeFormat("en-US", options).format(date);
    setFormattedDate(
      formatted.replace(/, (\d{1,2})/, " $1").replace(/ at/, ",")
    );
  };

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  // const toggleDatePicker = () => {
  //   setShowPicker(!showPicker);
  // };

  // const confirmIOSDate = () => {
  //   // setDate(date)
  //   toggleDatePicker();
  // };

  // const onChange = (event, selectedDate) => {
  //   console.log(event);
  //   if (event.type === "dismissed") {
  //     console.log("true");
  //     toggleDatePicker();
  //     return null;
  //   } else {
  //     const currentDate = selectedDate || date;
  //     setDate(currentDate);
  //     console.log("false");
  //   }
  // };

  const [sliderValue, setSliderValue] = useState(0);
  const animatedValue = new Animated.Value(0);
  const [modalVisible, setModalVisible] = useState(false);

  const onSliderSliding = (value) => {
    setSliderValue(value);
    animatedValue.setValue(value);
  };

  const openEditModal = () => {
    setModalVisible(true);
  };

  const closeEditModal = () => {
    setModalVisible(false);
  };

  const confirmSliderChange = (value) => {
    onSliderSliding(value);
    setModalVisible(false);
  };

  const [numericInput, setNumericInput] = useState(0);

  const handleNumericInput = (text) => {
    const numericText = text.replace(/[^0-9]/g, "");
    setNumericInput(parseInt(numericText));
  };

  const handleCreateNewTag = (item) => {
    if (item.value === "Create New Tag") {
    } else {
      setTag(item.value);
      setIsFocusTag(false);
    }
  };

  // useEffect(() => {
  //   animatedValue.setValue(sliderValue);
  // }, [sliderValue]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Text
          aria-label="Label for Task"
          nativeID="labelTask"
          style={{ marginBottom: 10, fontSize: 16, fontWeight: 600 }}
        >
          Task
        </Text>
        <Text style={{ color: "red" }}> *</Text>
      </View>
      {/* <MaterialCommunityIcons name="asterisk" color="red" size={10} /> */}
      <TextInput
        accessibilityLabel="Task"
        accessibilityHint="The todo's task"
        placeholder="Enter a Task Name"
        value={title}
        onChangeText={(t) => {
          setTitle(t);
          // console.log(t, "t");
        }}
        style={styles.textInput}
      />
      <View style={{ flexDirection: "row" }}>
        <Text
          aria-label="Label for Tag"
          nativeID="labelTag"
          style={{ marginBottom: 10, fontSize: 16, fontWeight: 600 }}
        >
          Tag
        </Text>
        <Text style={{ color: "red" }}> *</Text>
      </View>
      <Dropdown
        style={[styles.dropdown, isFocusTag && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={tagData}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocusTag ? "Select Tag" : "..."}
        searchPlaceholder="Search..."
        value={tag}
        onFocus={() => setIsFocusTag(true)}
        onBlur={() => setIsFocusTag(false)}
        onChange={(item) => {
          handleCreateNewTag(item);
        }}
      />
      <Text
        aria-label="Label for Due Date"
        nativeID="labelDueDate"
        style={{ marginBottom: 10, fontSize: 16, fontWeight: 600 }}
      >
        Due Date
      </Text>
      <View>
        <TextInput
          accessibilityLabel="Due date"
          accessibilityHint="The todo's due date"
          style={styles.textInput}
          placeholder="Select date and time"
          value={formattedDate}
          onPressIn={showDatePicker}
          editable={false}
        />
        <DateTimePickerModal
          testID="dateTimePicker"
          isVisible={datePicker}
          mode="datetime"
          display="inline"
          // date={selectedDate}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
      {/* <View style={styles.hr}></View> */}
      {/* {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          mode="date"
          display="spinner"
          value={date}
          onChange={onChange}
          // onChange={(event, selectedDate) => {
          //   setDate(selectedDate.toJSON());
          // }}
          style={styles.datePicker}
        />
      )}
      {showPicker && Platform.OS === "ios" && (
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity style={styles.cancelButton} onPress={toggleDatePicker}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: "#5D69D7" }]}
            onPress={confirmIOSDate}
          >
            <Text style={[styles.cancelButtonText, { color: "#fff" }]}>Confirm</Text>
          </TouchableOpacity>
        </View>
      )}
      {!showPicker && (
        <Pressable onPress={toggleDatePicker}>
          <TextInput
            accessibilityLabel="Due date"
            accessibilityHint="The todo's due date"
            placeholder="Sat Aug 21 2004"
            value={date.toDateString()}
            onChangeText={setDate}
            editable={false}
            onPressIn={toggleDatePicker}
            style={styles.textInput}
          />
        </Pressable>
      )} */}
      {/* <View style={{ flexDirection: "row" }}>
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(date)}
          mode={"date"}
          // display="spinner"
          is24Hour={true}
          onChange={(event, selectedDate) => {
            setDate(selectedDate.toJSON());
          }}
        />
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(date)}
          mode={"time"}
          // display="spinner"
          is24Hour={true}
          onChange={(event, selectedDate) => {
            setDate(selectedDate.toJSON());
          }}
        />
      </View> */}
      {/* <View style={styles.hr}></View> */}
      <Text
        aria-label="Label for Description"
        nativeID="labelDescription"
        style={{ marginBottom: 10, fontSize: 16, fontWeight: 600 }}
      >
        Description
      </Text>
      <TextInput
        accessibilityLabel={"Description"}
        accessibilityHint="The todo's description"
        placeholder="Description"
        value={body}
        onChangeText={setBody}
        style={[styles.textInput, { height: 150, backgroundColor: "white" }]}
        multiline={true}
      />
      <Text
        aria-label="Label for Estimated Time"
        nativeID="labelEstimatedTime"
        style={{ marginBottom: 10, fontSize: 16, fontWeight: 600 }}
      >
        Estimate Time Taken (Minutes)
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <Animated.Text
            style={[
              styles.sliderText,
              { marginLeft: animatedValue, marginBottom: 10 },
              sliderValue >= 280 && { marginLeft: 280 },
            ]}
          >
            {sliderValue}
          </Animated.Text>
          <Slider
            lowerLimit={1}
            step={5}
            minimumValue={0}
            maximumValue={300}
            minimumTrackTintColor="#9B8CE6"
            value={sliderValue}
            onValueChange={onSliderSliding}
          />
        </View>
        <TouchableOpacity
          style={[styles.browseButton]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.browseButtonText]}>Edit</Text>
        </TouchableOpacity>
        {/* <MaterialCommunityIcons
          name="pencil"
          size={15}
          color="black"
          onPress={openEditModal}
        /> */}
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Enter a number from 1 to 300 minutes for setting the time taken
            </Text>

            <TextInput
              style={[
                styles.textInput,
                { width: 200, backgroundColor: "white" },
              ]}
              keyboardType="numeric"
              value={numericInput.toString()}
              onChangeText={handleNumericInput}
              placeholder="Enter number"
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeEditModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: "#5D69D7" }]}
                onPress={() => confirmSliderChange(numericInput)}
              >
                <Text style={[styles.cancelButtonText, { color: "#fff" }]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* <View style={styles.hr}></View> */}
      {img ? (
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              aria-label="Label for Image"
              nativeID="labelImage"
              style={{ marginBottom: 10, fontSize: 16, fontWeight: 600 }}
            >
              Image
            </Text>
            <TouchableOpacity style={styles.browseButton} onPress={pickImage}>
              <Text style={styles.browseButtonText}>Browse...</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: img }}
            style={{ height: 200, width: 300, alignSelf: "center" }}
          />
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            aria-label="Label for Image"
            nativeID="labelImage"
            style={{ marginBottom: 10, fontSize: 16, fontWeight: 600 }}
          >
            Choose {img && "a different "}image
          </Text>
          <TouchableOpacity style={styles.browseButton} onPress={pickImage}>
            <Text style={styles.browseButtonText}>Browse...</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.navigate("Study Tools", {
              title,
              // dueDate: date,
              dueDate: selectedDate ? selectedDate.toJSON() : "",
              tag,
              body,
              duration: sliderValue,
              img,
              payload: { action: "cancel" },
            });
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cancelButton, { backgroundColor: "#5D69D7" }]}
          onPress={() => {
            if (title.trim() === "" || tag === null) {
              Alert.alert("Error", "Please fill the required fields");
            } else {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
              // console.log(
              //   "pressed create",
              //   title,
              //   selectedDate,
              //   tag,
              //   body,
              //   sliderValue
              // );
              navigation.navigate("Study Tools", {
                title,
                // dueDate: date,
                dueDate: selectedDate ? selectedDate.toJSON() : "",
                tag,
                body,
                duration: sliderValue,
                img,
                payload: { action: "add" },
              });
            }
          }}
        >
          <Text style={[styles.cancelButtonText, { color: "#fff" }]}>
            Create
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  textInput: {
    height: 50,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    paddingHorizontal: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  cancelButton: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "#efefef",
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#5D69D7",
    padding: 20,
  },
  browseButton: {
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "#efefef",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
  },
  browseButtonText: {
    fontSize: 14,
    fontWeight: "500",
    // color: "#5D69D7",
  },
  sliderText: {
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  editButton: {
    borderRadius: 20,
    // padding: 10,
    // elevation: 2,
  },
  editButtonOpen: {
    backgroundColor: "#F194FF",
  },
  editButtonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  hr: {
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
    marginBottom: 10,
  },
});

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Button,
  Image,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
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
];

export default function Edit({ route, navigation }) {
  const {
    origTitle,
    origDueDate,
    origTag,
    origKey,
    origBody,
    origDuration,
    origImg,
  } = route.params ?? {};
  const [title, setTitle] = useState(origTitle ? origTitle : "");
  const [tag, setTag] = useState(origTag ? origTag : "To-do");
  const [body, setBody] = useState(origBody ? origBody : "");
  const [img, setImg] = useState(origImg);
  const [isFocusTag, setIsFocusTag] = useState(false);
  const [date, setDate] = useState(
    origDueDate ? origDueDate : new Date().toJSON()
  );

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

  const [datePicker, setDatePickerVisibile] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    origDueDate ? new Date(origDueDate) : null
  );
  const [duration, setDuration] = useState(origDuration);
  const [formattedDate, setFormattedDate] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // base64: true,
    });
    // console.log(result.assets);
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

    setFormattedDate(changeDateFormat(date));
  };

  const changeDateFormat = (str) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formatted = str
      ? new Intl.DateTimeFormat("en-US", options).format(str)
      : "";
    return formatted.replace(/, (\d{1,2})/, " $1").replace(/ at/, ",");
  };

  const showDate = selectedDate
    ? changeDateFormat(selectedDate)
    : "Select date and time";

  const [sliderValue, setSliderValue] = useState(0);
  const animatedValue = new Animated.Value(duration);
  const [modalVisible, setModalVisible] = useState(false);

  const onSliderSliding = (value) => {
    setDuration(value);
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

  const changeDurationFormat = (text) => {
    const numericText = text.replace(/[^0-9]/g, "");
    setDuration(parseInt(numericText));
    // setNumericInput(parseInt(numericText));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text
        aria-label="Label for Task"
        nativeID="labelTask"
        style={{ marginBottom: 10, fontSize: 16, fontWeight: 600 }}
      >
        Task
      </Text>
      <TextInput
        accessibilityLabel="Task"
        accessibilityHint="The todo's task"
        placeholder="Enter a Task Name"
        value={title}
        onChangeText={setTitle}
        style={styles.textInput}
      />
      <Text
        aria-label="Label for Tag"
        nativeID="labelTag"
        style={{ marginBottom: 10, fontSize: 16, fontWeight: 600 }}
      >
        Tag
      </Text>
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
          setTag(item.value);
          setIsFocusTag(false);
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
          placeholder={showDate}
          value={showDate}
          onPressIn={showDatePicker}
          editable={false}
        />
        <DateTimePickerModal
          testID="dateTimePicker"
          isVisible={datePicker}
          mode="datetime"
          display="inline"
          date={selectedDate}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
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
              duration >= 280 && { marginLeft: 280 },
            ]}
          >
            {duration}
          </Animated.Text>
          <Slider
            lowerLimit={1}
            step={5}
            minimumValue={0}
            maximumValue={300}
            minimumTrackTintColor="#9B8CE6"
            value={duration}
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
              // value={numericInput.toString()}
              value={duration.toString()}
              onChangeText={changeDurationFormat}
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
                onPress={() => confirmSliderChange(duration)}
                // onPress={() => confirmSliderChange(numericInput)}
              >
                <Text style={[styles.cancelButtonText, { color: "#fff" }]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.navigate("Study Tools", {
              title: origTitle,
              dueDate: origDueDate,
              tag: origTag,
              img: origImg,
              body: origBody,
              duration: origDuration,
              payload: { action: "cancel" },
            });
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cancelButton, { backgroundColor: "#5D69D7" }]}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.navigate("Study Tools", {
              title,
              dueDate: selectedDate ? selectedDate.toJSON() : "",
              tag,
              img,
              body,
              duration: duration,
              payload: { action: "edit", oldTag: origTag, key: origKey },
            });
          }}
        >
          <Text style={[styles.cancelButtonText, { color: "#fff" }]}>
            Save Changes
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
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
});

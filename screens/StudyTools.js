import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Button,
  ScrollView,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import StoreService from "../services/StoreService";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TodoBox from "../components/TodoBox";
import { Dimensions } from "react-native";

export default function StudyTools({ route, navigation }) {
  const { title, dueDate, tag, img, body, duration, payload } =
    route.params ?? {};
  // console.log(title, "title");
  // const [todos, setTodos] = useState([]);
  // const [inprogressTodos, setInprogressTodos] = useState([]);
  // const [completedTodos, setCompletedTodos] = useState([]);
  const [nextKey, setNextKey] = useState(0);
  const [selectedTag, setSelectedTag] = useState([]);
  const [tags, setTags] = useState([
    // {
    //   name: "To-do",
    //   color: "#FFE599",
    //   todos: [],
    // },
    // {
    //   name: "In Progress",
    //   color: "#EA9999",
    //   todos: [],
    // },
    // {
    //   name: "Completed",
    //   color: "#B6D7A8",
    //   todos: [],
    // },
    // {
    //   name: "To-do",
    //   color: "#FFE599",
    //   todos: [{ title: "", dueDate: "", tag: "", img: "", body: "", key: "" }],
    // },
    // {
    //   name: "In Progress",
    //   color: "#EA9999",
    //   todos: [{ title: "", dueDate: "", tag: "", img: "", body: "", key: "" }],
    // },
    // {
    //   name: "Completed",
    //   color: "#B6D7A8",
    //   todos: [{ title: "", dueDate: "", tag: "", img: "", body: "", key: "" }],
    // },
  ]);

  const windowHeight = Dimensions.get("window").height;

  const addToArray = (
    currTitle,
    currTag,
    currDueDate,
    currImg,
    currBody,
    currDuration
  ) => {
    setTags((prevTags) => {
      if (prevTags.length === 0) {
        return [
          {
            name: currTag,
            color: "#FFE599",
            todos: [
              {
                title: currTitle,
                dueDate: currDueDate,
                tag: currTag,
                img: currImg,
                body: currBody,
                key: nextKey,
              },
            ],
          },
        ];
      }
      const updatedTags = prevTags.map((elem) => {
        if (elem.name === currTag) {
          if (elem.todos) {
            const updatedTodos = [
              ...elem.todos,
              {
                title: currTitle,
                dueDate: currDueDate,
                tag: currTag,
                img: currImg,
                body: currBody,
                duration: currDuration,
                key: nextKey,
              },
            ];
            return {
              ...elem,
              todos: updatedTodos,
            };
          } else {
            return {
              ...elem,
              todos: [
                {
                  title: currTitle,
                  dueDate: currDueDate,
                  tag: currTag,
                  img: currImg,
                  body: currBody,
                  duration: currDuration,
                  key: nextKey,
                },
              ],
            };
          }
        }
        return elem;
      });
      setNextKey((k) => k + 1);
      return updatedTags;
    });
  };

  const removeFromArray = (currTag, currKey) => {
    setTags((prevTags) => {
      const updatedTags = prevTags.map((elem) => {
        if (elem.name === currTag) {
          const updatedTodos = elem.todos.filter(
            (todo) => todo.key !== currKey
          );
          return {
            ...elem,
            todos: updatedTodos,
          };
        }
        return elem;
      });
      return updatedTags;
    });
  };

  const toggleVisibility = (tag) => {
    setSelectedTag((prevTags) => {
      if (prevTags.indexOf(tag) !== -1) {
        return prevTags.filter((t) => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  const checkValidInput = (title, tag) => {
    if (title !== "" && tag !== "") {
      return true;
    }
    return false;
  };

  // useEffect(() => {
  //   StoreService.getTags().then((storedTags) => {
  //     if (storedTags && storedTags.length > 0) {
  //       setTags(storedTags);
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   if (tags && tags.length > 0) {
  //     StoreService.saveTags(tags);
  //   }
  // }, [tags]);

  useEffect(() => {
    // if (title && dueDate && tag && payload && body) {
    // print("hi");
    if (title && tag && payload) {
      if (payload.action === "add") {
        // console.log("working?", title, tag, dueDate, img, body, duration);
        addToArray(title, tag, dueDate, img, body, duration);
        if (!selectedTag.includes(tag)) {
          toggleVisibility(tag);
        }
      } else if (payload.action === "edit") {
        removeFromArray(payload.oldTag, payload.key);
        addToArray(title, tag, dueDate, img, body, duration);
        if (!selectedTag.includes(tag)) {
          toggleVisibility(tag);
        }
      } else if (payload.action === "delete") {
        removeFromArray(tag, payload.key);
      }
    }
  }, [title, dueDate, tag, payload, img, body, duration]);

  // When todos screen first mounts load todos from store
  useEffect(() => {
    StoreService.getTodos().then((todos) => {
      setTags(todos.tags);
      // setTodos(todos.todos);
      // setInprogressTodos(todos.inprogress);
      // setCompletedTodos(todos.complete);
      setNextKey(todos.nextKey);
    });
  }, []);

  // When ever todos is updated save the todos to the store
  useEffect(() => {
    if (nextKey) {
      StoreService.saveTodos({
        tags,
        // todos,
        // inprogress: inprogressTodos,
        // complete: completedTodos,
        nextKey,
      });
    }
    console.log(tags)
    // }, [tags, todos, inprogressTodos, completedTodos]);
  }, [tags]);

  return (
    <View style={styles.containerInner}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#B6B2E6", "#C5DDBA"]}
        style={styles.background}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { height: windowHeight }]}
        >
          {/* {tags.map((elem, index) => ())} */}
          {/* {console.log(tags)} */}
          {tags.map((elem, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.tagHeadings}
                onPress={() => toggleVisibility(elem.name)}
              >
                <Text style={{ fontSize: 20, backgroundColor: elem.color }}>
                  {elem.name}
                </Text>
                {selectedTag.includes(elem.name) ? (
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    color="black"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="chevron-up"
                    size={20}
                    color="black"
                  />
                )}
              </TouchableOpacity>
              {selectedTag.includes(elem.name) &&
                elem.todos.map(
                  ({ title, dueDate, tag, img, body, duration, key }, idx) => {
                    // console.log("Todo:", title, tag);
                    return checkValidInput(title, tag) ? (
                      <TodoBox
                        key={idx}
                        title={title}
                        dueDate={dueDate}
                        tag={tag}
                        myKey={key}
                        img={img}
                        body={body}
                        duration={duration}
                        navigation={navigation}
                      />
                    ) : (
                      <React.Fragment key={idx} />
                    );
                  }
                )}
              {/* {elem.todos.map(
                ({ title, dueDate, tag, img, body, key }, idx) => {
                  // console.log("Todo:", title, tag);
                  return checkValidInput(title, tag) ? (
                    <TodoBox
                      key={idx}
                      title={title}
                      dueDate={dueDate}
                      tag={tag}
                      myKey={key}
                      img={img}
                      body={body}
                      navigation={navigation}
                    />
                  ) : (
                    <React.Fragment key={idx} />
                  );
                }
              )} */}
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
      <Pressable
        accessibilityLabel="Create todo"
        onPress={() => navigation.navigate("Create")}
        style={{
          ...styles.addButton,
        }}
      >
        <MaterialCommunityIcons name="plus-circle" size={80} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    minHeight: "100%",
    width: "100%",
  },
  containerInner: {
    flex: 1,
    width: "100%",
  },
  background: {
    height: "100%",
    width: "100%",
  },
  addButton: {
    position: "absolute",
    bottom: 0,
    // left: 0,
    alignSelf: "flex-end",
    paddingRight: 10,
    marginBottom: 20,
  },
  tagHeadings: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: -1 },
    shadowOpacity: 0.2,
    // marginTop: 2,
    padding: 10,
  },
});

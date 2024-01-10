import AsyncStorage from "@react-native-async-storage/async-storage";

// const TODOS_STORE_KEY = "@todos";
// const INPROGRESS_STORE_KEY = "@inprogress";
// const COMPLETED_STORE_KEY = "@complete";
const TAGS_STORE_KEY = "@tags";
const NEXT_KEY = "@nextkey";
const USERS_KEY = "@userskey";
const USERID_KEY = "@userIDkey";
const COURSES_KEY = "@courseskey";
const STUDY_SESSIONS_KEY = "@sskey";

const defaultTags = [
  { name: "To-do", color: "#FFE599", todos: [] },
  { name: "In Progress", color: "#EA9999", todos: [] },
  { name: "Completed", color: "#B6D7A8", todos: [] },
];

export default {
  async getDB() {
    try {
      // await AsyncStorage.removeItem(USERS_KEY);
      // await AsyncStorage.removeItem(COURSES_KEY);
      // await AsyncStorage.removeItem(USERID_KEY);
      // await AsyncStorage.removeItem(STUDY_SESSIONS_KEY);
      const users = await AsyncStorage.getItem(USERS_KEY);
      const courses = await AsyncStorage.getItem(COURSES_KEY);
      const userId = await AsyncStorage.getItem(USERID_KEY);
      const studySessions = await AsyncStorage.getItem(STUDY_SESSIONS_KEY);
      const retval = {
        users: users ? JSON.parse(users) : null,
        courses: courses ? JSON.parse(courses) : null,
        userId: userId ? userId : "",
        studySessions: studySessions ? JSON.parse(studySessions) : null,
      };
      return retval;
    } catch (error) {
      console.log("Failed to get DB data", error);
    }
  },
  async saveDB(info) {
    try {
      // console.log("info", info);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(info.users));
      await AsyncStorage.setItem(COURSES_KEY, JSON.stringify(info.courses));
      await AsyncStorage.setItem(
        STUDY_SESSIONS_KEY,
        JSON.stringify(info.studySessions)
      );
      await AsyncStorage.setItem(USERID_KEY, info.userId);
    } catch (error) {
      console.log("Failed to save DB", error);
    }
  },
  async getTodos() {
    try {
      let storedTags = await AsyncStorage.getItem(TAGS_STORE_KEY);
      // const storedTodos = await AsyncStorage.getItem(TODOS_STORE_KEY);
      // const storedInprogress = await AsyncStorage.getItem(INPROGRESS_STORE_KEY);
      // const storedComplete = await AsyncStorage.getItem(COMPLETED_STORE_KEY);
      let nextKey = await AsyncStorage.getItem(NEXT_KEY);

      if (storedTags === null) {
        await AsyncStorage.setItem(TAGS_STORE_KEY, JSON.stringify(defaultTags));
        storedTags = await AsyncStorage.getItem(TAGS_STORE_KEY);
      }

      

      const retval = {
        tags: JSON.parse(storedTags),
        // todos: storedTodos ? JSON.parse(storedTodos) : [],
        // inprogress: storedInprogress ? JSON.parse(storedInprogress) : [],
        // complete: storedComplete ? JSON.parse(storedComplete) : [],
        nextKey: nextKey ? Number(nextKey) : 0,
      };

      return retval;
    } catch (error) {
      console.log("Failed to get todos", error);
    }
  },
  async saveTodos(todos) {
    try {
      await AsyncStorage.setItem(TAGS_STORE_KEY, JSON.stringify(todos.tags));
      // await AsyncStorage.setItem(TODOS_STORE_KEY, JSON.stringify(todos.todos));
      // await AsyncStorage.setItem(
      //   INPROGRESS_STORE_KEY,
      //   JSON.stringify(todos.inprogress)
      // );
      // await AsyncStorage.setItem(
      //   COMPLETED_STORE_KEY,
      //   JSON.stringify(todos.complete)
      // );
      await AsyncStorage.setItem(NEXT_KEY, todos.nextKey.toString());
    } catch (error) {
      console.log("Failed to save todos", error);
    }
  },
  async deleteTodos() {
    await AsyncStorage.removeItem(TAGS_STORE_KEY);
    // await AsyncStorage.removeItem(TODOS_STORE_KEY);
    // await AsyncStorage.removeItem(INPROGRESS_STORE_KEY);
    // await AsyncStorage.removeItem(COMPLETED_STORE_KEY);
    await AsyncStorage.removeItem(NEXT_KEY);
  },
};

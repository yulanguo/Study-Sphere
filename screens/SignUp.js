import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import icon from "../assets/icon.png";

const checkSignUp = (
  userName,
  name,
  email,
  password,
  confirmPassword,
  setErrorEmail,
  setErrorName,
  setErrorPassword,
  setErrorUserName,
  setErrorConfirmPassword,
  users,
  setUsers,
  setUserId
) => {
  setErrorEmail(null);
  setErrorPassword(null);
  setErrorUserName(null);
  setErrorName(null);
  setErrorConfirmPassword(null);
  if (name.trim() === "") {
    setErrorName("Please enter a name");
    return false;
  }
  if (userName.trim() === "") {
    setErrorUserName("Please enter a User Name");
    return false;
  }
  if (email.trim() === "") {
    setErrorEmail("Please enter an email");
    return false;
  }
  if (password === "") {
    setErrorPassword("Please enter password");
    return false;
  }
  if (confirmPassword === "") {
    setErrorConfirmPassword("Please confirm password");
    return false;
  }
  if (password !== confirmPassword) {
    setErrorConfirmPassword("Passwords do not match");
    return false;
  }
  for (const user of users) {
    if (user.username.toLowerCase() == userName.toLowerCase()) {
      setErrorUserName("User Name already in use");
      return false;
    }
    if (user.email.toLowerCase() === email.toLowerCase()) {
      setErrorEmail("Email already in use");
      return false;
    }
  }
  const newId = (users.length + 1).toString();
  const newUser = {
    id: newId,
    username: userName,
    name,
    email,
    password,
    courses_classes: [],
    availabilities: [],
  };
  const newUsers = [...users];
  newUsers.push(newUser);
  setUsers(newUsers);
  setUserId(newId);
  return true;
};

export default function SignUp({
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
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(null);
  const [errorUserName, setErrorUserName] = useState(null);
  const [errorName, setErrorName] = useState(null);

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#B6B2E6", "#C5DDBA"]}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.containerInner}>
          <Text accessibilityRole="header" style={styles.heading}>
            Welcome to Study Sphere!
          </Text>
          <Text style={styles.heading}>Sign Up</Text>
          <TextInput
            placeholder="Name"
            accessible={true}
            accessibilityLabel="Name"
            accessibilityHint="Enter your name"
            onChangeText={(value) => setName(value)}
            style={styles.input}
          />
          {errorName && (
            <Text
              accessible={true}
              accessibilityLabel="Error in the name field"
              style={styles.error}
            >
              {errorName}
            </Text>
          )}
          <TextInput
            placeholder="User Name"
            accessible={true}
            accessibilityLabel="User name"
            accessibilityHint="Enter a user name"
            onChangeText={(value) => setUserName(value)}
            style={styles.input}
          />
          {errorUserName && (
            <Text
              accessible={true}
              accessibilityLabel="Error in the user name field"
              style={styles.error}
            >
              {errorUserName}
            </Text>
          )}
          <TextInput
            placeholder="Email"
            accessible={true}
            accessibilityLabel="Email"
            accessibilityHint="Enter your email"
            onChangeText={(value) => setEmail(value)}
            style={styles.input}
          />
          {errorEmail && (
            <Text
              accessible={true}
              accessibilityLabel="Error in the email field"
              style={styles.error}
            >
              {errorEmail}
            </Text>
          )}
          <TextInput
            placeholder="Password"
            accessible={true}
            accessibilityLabel="Password"
            accessibilityHint="Enter your password"
            secureTextEntry={true}
            onChangeText={(value) => setPassword(value)}
            style={styles.input}
          />
          {errorPassword && (
            <Text
              accessible={true}
              accessibilityLabel="Error in the password field"
              style={styles.error}
            >
              {errorPassword}
            </Text>
          )}
          <TextInput
            placeholder="Confirm Password"
            accessible={true}
            accessibilityLabel="Confirm Password"
            accessibilityHint="Enter the same password from the password field"
            secureTextEntry={true}
            onChangeText={(value) => setConfirmPassword(value)}
            style={styles.input}
          />
          {errorConfirmPassword && (
            <Text
              accessible={true}
              accessibilityLabel="Error in the confirm password field"
              style={styles.error}
            >
              {errorConfirmPassword}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => {
              const user = checkSignUp(
                userName,
                name,
                email,
                password,
                confirmPassword,
                setErrorEmail,
                setErrorName,
                setErrorPassword,
                setErrorUserName,
                setErrorConfirmPassword,
                users,
                setUsers,
                setUserId
              );
              if (user) {
                navigation.navigate("Tabs", {
                  screen: "Courses",
                });
              }
            }}
            style={styles.button}
            accessible={true}
            accessibilityLabel="Sign Up Button"
            accessibilityHint="Click to Sign Up"
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  containerInner: {
    // minHeight: "100%",
    alignContent: "center",
    justifyContent: "center",
    padding: 30,
  },
  background: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderRadius: 15,
    fontSize: 16,
    marginTop: 20,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
    marginVertical: 30,
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#6A74CF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 15,
    fontSize: 16,
    marginTop: 20,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginTop: 5,
  },
  image: {
    height: 150,
    width: 150,
    alignSelf: "center",
  },
});

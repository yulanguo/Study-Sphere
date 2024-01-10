import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import icon from "../assets/icon.png";

const checkLogIn = (
  email,
  password,
  setErrorEmail,
  setErrorPassword,
  users,
  setUserId
) => {
  setErrorEmail(null);
  setErrorPassword(null);
  if (email.trim() === "") {
    setErrorEmail("Please enter an email");
    return false;
  }
  if (password === "") {
    setErrorPassword("Please enter password");
    return false;
  }
  for (const user of users) {
    if (user.email.toLowerCase() === email.toLowerCase()) {
      if (password === user.password) {
        setUserId(user.id);
        return true;
      } else {
        setErrorPassword("Incorrect Password");
        return false;
      }
    }
  }
  setErrorEmail("Email not found");
  return false;
};

export default function LogIn({
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#B6B2E6", "#C5DDBA"]}
        style={styles.background}
      >
        <Text accessibilityRole="header" style={styles.heading}>
          Welcome to Study Sphere!
        </Text>
        <Image
          accessible={true}
          accessibilityLabel="Study Sphere Icon"
          source={icon}
          style={styles.image}
        />
        <Text style={styles.subTitle}>
          The one stop platform for all things Study Sessions.
        </Text>
        <Text style={styles.heading}>Log In</Text>
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
        <TouchableOpacity
          onPress={() => {
            const user = checkLogIn(
              email,
              password,
              setErrorEmail,
              setErrorPassword,
              users,
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
          accessibilityLabel="Log In Button"
          accessibilityHint="Click to Log In"
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Sign Up Button"
          accessibilityHint="Click to navigate to Sign Up Page"
          style={styles.signUpButton}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.buttonTextSignUp}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
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
    minHeight: "100%",
    width: "100%",
  },
  background: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  input: {
    width: "80%",
    height: 40,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    // borderWidth: 1,
    borderRadius: 15,
    fontSize: 16,
    marginTop: 10,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
    marginVertical: 30,
  },
  subTitle: {
    marginTop: 20,
    fontWeight: "light",
    fontSize: 20,
    textAlign: "center",
  },
  button: {
    width: "80%",
    height: 40,
    backgroundColor: "#6A74CF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 15,
    fontSize: 16,
    marginTop: 10,
  },
  signUpButton: {
    width: "80%",
    height: 40,
    fontSize: 16,
    marginTop: 30,
  },
  buttonTextSignUp: {
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
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

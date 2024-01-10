import React, { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import {
  CountdownCircleTimer,
  useCountdown,
} from "react-native-countdown-circle-timer";

export default function Timer({ route, navigation }) {
  const { duration } = route.params ?? {};
  const [isPlay, setIsPlay] = useState(true);
  //   const {
  //     path,
  //     pathLength,
  //     stroke,
  //     strokeDashoffset,
  //     remainingTime,
  //     elapsedTime,
  //     size,
  //     strokeWidth,
  //   } = useCountdown({
  //     isPlaying: true,
  //     duration: duration * 60,
  //     colors: "#abc",
  //   });
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "50%",
      }}
    >
      <CountdownCircleTimer
        isPlaying={isPlay}
        duration={duration * 60}
        colors={["#6A74CF", "#F04444", "#FF0000"]}
        colorsTime={[duration * 60, 60, 0]}
        size={300}
      >
        {({ remainingTime }) => (
          <Text style={{ fontSize: 50 }}>
            {Math.floor(remainingTime / 3600)} :{" "}
            {Math.floor((remainingTime % 3600) / 60)} : {remainingTime % 60}
          </Text>
        )}
      </CountdownCircleTimer>
      <View>
        {isPlay ? (
          <TouchableOpacity
            onPress={() => {
              setIsPlay(false);
            }}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Pause</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setIsPlay(true);
            }}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Resume</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "#5D69D7",
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    padding: 20,
  },
});

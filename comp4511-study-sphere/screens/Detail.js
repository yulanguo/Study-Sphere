import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";

export default function Detail({ route, navigation }) {
  const { title, formatedDate, tag } = route.params;
  useEffect(
    () => navigation.setOptions({ title, formatedDate, tag }),
    [title, formatedDate, tag]
  );
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text accessibilityHint="The title text of the todo">{title}</Text>
      <Text accessibilityHint="The due date of the todo">
        Due Date: {formatedDate}
      </Text>
      <Text accessibilityHint="The tag of the todo">Tag: {tag}</Text>
    </View>
  );
}

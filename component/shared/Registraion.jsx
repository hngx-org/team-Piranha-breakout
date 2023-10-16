import { StyleSheet, Text, TextStyle, View } from "react-native";
import React from "react";

export const RegistraionHeadersText = ({ data, textStyle }) => {
  return (
    <Text
      style={[
        textStyle,
        {
          fontWeight: "600",
          fontSize: 28,
        },
      ]}
    >
      {data}
    </Text>
  );
};

export const RegistraionParagraphText = ({ data, color, mainstyle }) => {
  return (
    <Text
      style={[
        {
          color: color || "#8E8E8F",
          fontWeight: "400",
          fontSize: 16,
        },
      ]}
    >
      {data}
    </Text>
  );
};

import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import { Card } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Card
        containerStyle={{
          width: 300,
          borderRadius: 10,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 40 }}>
          Welcome to Breakout Game
        </Text>

        <View style={{ alignItems: "center" }}>
          <View
            style={{
              flexDirection: "column",
              gap: 16,
              marginHorizontal: "auto",
              width: "100%",
              maxWidth: "70%",
            }}
          >
            <Button
              title="Start Game"
              onPress={() => navigation.navigate("Play")}
            />
            <Button
              title="Leaderboard"
              onPress={() => navigation.navigate("PlayBreakout")}
            />
            <Button
              title="Settings"
              onPress={() => console.log("Settings pressed")}
            />
          </View>
        </View>
      </Card>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});

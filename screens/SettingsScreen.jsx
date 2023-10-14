import { StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Switch } from "react-native-elements";

const SettingsScreen = () => {
  const [allowSound, setAllowSound] = useState(true);
  const [allowMusic, setAllowMusic] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="black" />
      <View style={{ flex: 1, padding: 10, backgroundColor: "black" }}>
        <Text
          style={{
            fontSize: 30,
            textAlign: "center",
            fontWeight: "700",
            marginVertical: 4,
            marginBottom: 10,
            color: "floralwhite",
          }}
        >
          Settings
        </Text>

        <View style={{ gap: 20, flex: 1 }}>
          <Card containerStyle={{ borderRadius: 10 }}>
            <View
              style={{
                flexDirection: "row",
                gap: 16,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontWeight: "700", fontSize: 18 }}>Sound</Text>

              <Switch
                trackColor={{ false: "#767577", true: "#767577" }}
                thumbColor={allowSound ? "teal" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={setAllowSound}
                value={allowSound}
              />
            </View>
          </Card>
          <Card containerStyle={{ borderRadius: 10 }}>
            <View
              style={{
                flexDirection: "row",
                gap: 16,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontWeight: "700", fontSize: 18 }}>Music</Text>

              <Switch
                trackColor={{ false: "#767577", true: "#767577" }}
                thumbColor={allowMusic ? "teal" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={setAllowMusic}
                value={allowMusic}
              />
            </View>
          </Card>
        </View>

        <Text
          style={{
            textAlign: "center",
            color: "grey",
            marginVertical: 10,
            fontSize: 12,
          }}
        >
          v 1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({});

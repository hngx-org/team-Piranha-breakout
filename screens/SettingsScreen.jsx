import { StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Switch } from "react-native-elements";
import {
  saveGameSettings,
  selectSettingsState,
} from "../redux/slices/gameSlice";
import { useDispatch, useSelector } from "react-redux";
import { TouchableOpacity } from "react-native";
import { reset_login } from "../redux/slices/authslice";
import { useNavigation } from "@react-navigation/native";

const SettingsScreen = () => {
  const settings = useSelector(selectSettingsState);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  function handleChange(field, value) {
    dispatch(saveGameSettings({ ...settings, [field]: value }));
  }

  const { logindata } = useSelector((state) => state.authslice);

  const handleReset = () => {
    dispatch(reset_login());
    navigation.navigate("Welcome");
  };

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
                thumbColor={settings.allowSound ? "teal" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => handleChange("allowSound", value)}
                value={settings.allowSound}
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
                thumbColor={settings.allowMusic ? "teal" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => handleChange("allowMusic", value)}
                value={settings.allowMusic}
              />
            </View>
          </Card>

          <Card containerStyle={{ borderRadius: 10 }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                gap: 16,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleReset}
            >
              <Text
                style={{ fontWeight: "700", fontSize: 18, textAlign: "center" }}
              >
                Logout
              </Text>
            </TouchableOpacity>
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

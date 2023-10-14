import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "../screens/WelcomeScreen";
import BreakoutScreen from "../screens/BreakoutScreen";
import GameScreen from "../screens/GameScreen";
import LeaderBoardScreen from "../screens/LeaderBoardScreen";

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Play" component={GameScreen} />
        <Stack.Screen name="LeaderBoard" component={LeaderBoardScreen} />
        <Stack.Screen name="PlayBreakout" component={BreakoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});

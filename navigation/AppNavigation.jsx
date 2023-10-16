import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "../screens/WelcomeScreen";
import BreakoutScreen from "../screens/BreakoutScreen";
import GameScreen from "../screens/GameScreen";
import LeaderBoardScreen from "../screens/LeaderBoardScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Audio } from "expo-av";
import { useSelector } from "react-redux";
import { selectSettingsState } from "../redux/slices/gameSlice";
import Registraion from "../screens/Registraion";
import Login from "../screens/Login";

const Stack = createNativeStackNavigator();

const backgroundMusic = new Audio.Sound();

const AppNavigation = () => {
  const settings = useSelector(selectSettingsState);

  useEffect(() => {
    // Load and play background music

    const loadBackgroundMusic = async () => {
      try {
        await backgroundMusic.loadAsync(require("../assets/mob.mp3"));
        await backgroundMusic.setIsLoopingAsync(true); // Set the music to loop
        await backgroundMusic.playAsync();
      } catch (error) {
        console.error("Error loading background music:", error);
      }
    };

    const stopBackgroundMusic = () => {
      backgroundMusic.stopAsync();
      backgroundMusic.unloadAsync();
    };

    if (settings.allowMusic) {
      loadBackgroundMusic();
    } else {
      backgroundMusic.pauseAsync();
      // stopBackgroundMusic();
    }

    return () => {
      // Unload the background music when the component unmounts
      stopBackgroundMusic();
    };
  }, [settings.allowMusic]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Play" component={GameScreen} />
        <Stack.Screen name="LeaderBoard" component={LeaderBoardScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="PlayBreakout" component={BreakoutScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registraion" component={Registraion} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});

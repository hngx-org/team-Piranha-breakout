import { StyleSheet, View } from "react-native";

import { Audio } from "expo-av";
import { useEffect } from "react";
import AppNavigation from "./navigation/AppNavigation";

export default function App() {
  useEffect(() => {
    // Load and play background music
    const backgroundMusic = new Audio.Sound();
    const loadBackgroundMusic = async () => {
      try {
        await backgroundMusic.loadAsync(require("./assets/mob.mp3"));
        await backgroundMusic.setIsLoopingAsync(true); // Set the music to loop
        await backgroundMusic.playAsync();
      } catch (error) {
        console.error("Error loading background music:", error);
      }
    };

    loadBackgroundMusic();

    return () => {
      // Unload the background music when the component unmounts
      backgroundMusic.stopAsync();
      backgroundMusic.unloadAsync();
    };
  }, []);

  return <AppNavigation />;

  return (
    <View style={{ flex: 1 }}>
      <AppNavigation />
      {/* <GameScreen /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

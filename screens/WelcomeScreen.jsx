import { StyleSheet, Text, View, Button } from "react-native";
import { Card } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <Card
        containerStyle={{
          width: 300,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 40,
            color: "darkslategrey",
            textAlign: "center",
          }}
        >
          Breakout Game
        </Text>

        <View style={{ alignItems: "center" }}>
          <View
            style={{
              flexDirection: "column",
              gap: 16,
              marginHorizontal: "auto",
              marginBottom: 20,
              width: "100%",
              maxWidth: "70%",
            }}
          >
            <Button
              title="Play Game"
              onPress={() => navigation.navigate("Play")}
              color="teal"
            />
            <Button
              title="Leaderboard"
              onPress={() => navigation.navigate("LeaderBoard")}
              color="teal"
            />
            <Button
              title="Settings"
              onPress={() => navigation.navigate("Settings")}
              color="teal"
            />
          </View>
        </View>
      </Card>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});

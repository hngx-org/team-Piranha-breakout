import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import UserAvatar from "react-native-user-avatar";
import { SafeAreaView } from "react-native-safe-area-context";

const LeaderBoardScreen = () => {
  const leaderboard = [
    { name: "Lerry435", points: 231 },
    { name: "Bolaji", points: 229 },
    { name: "Favour", points: 213 },
    { name: "Last_born", points: 197 },
    { name: "Berry White", points: 192 },
    { name: "Rolo12", points: 185 },
    { name: "Sheamus", points: 181 },
    { name: "Abdul", points: 181 },
    { name: "Lekki Boy", points: 178 },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="black" />
      <View style={{ flex: 1, padding: 20, backgroundColor: "black" }}>
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
          Leader Board
        </Text>

        <FlatList
          data={leaderboard}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "teal",
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
                borderRadius: 10,
                paddingVertical: 16,
                paddingHorizontal: 20,
                marginVertical: 10,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <UserAvatar size={40} name={item.name} />
              </View>

              <View style={{ gap: 2 }}>
                <Text
                  style={{
                    color: "floralwhite",
                    fontWeight: "500",
                    fontSize: 18,
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    color: "floralwhite",
                    fontWeight: "400",
                    fontSize: 14,
                  }}
                >
                  {item.points} points
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default LeaderBoardScreen;

const styles = StyleSheet.create({});

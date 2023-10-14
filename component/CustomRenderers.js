import React from "react";
import { View } from "react-native";

const RectangleRenderer = ({ body, size, color }) => {
  const x = body.position?.x;
  const y = body.position?.y;

  const [width, height] = size;

  return (
    <View
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
        backgroundColor: color,
      }}
    />
  );
};

const CircleRenderer = ({ body, size, color }) => {
  const x = body.position?.x;
  const y = body.position?.y;
  const [radius] = size;

  return (
    <View
      style={{
        position: "absolute",
        left: x - radius,
        top: y - radius,
        width: radius * 2,
        height: radius * 2,
        backgroundColor: color,
        borderRadius: radius,
      }}
    />
  );
};

export { RectangleRenderer, CircleRenderer };

// You can expand upon this example by adding collision handling,
//  user input for the paddle, game logic, and win conditions.
// Be sure to consult the documentation for react-native-game-engine
// and matter-js for more in-depth details on creating complex game scenes.

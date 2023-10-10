import React, { useState } from "react";
import { View, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { GameEngine, GameLoop } from "react-native-game-engine";
import Matter from "matter-js";

const { width, height } = Dimensions.get("window");

const engine = Matter.Engine.create({ enableSleeping: false });
const world = engine.world;

const puck = Matter.Bodies.circle(width / 2, height / 2, 15, {
  frictionAir: 0.01,
  restitution: 0.8,
  velocity: { x: 5, y: 5 }, // Initial velocity to move the puck
});

const paddle1 = Matter.Bodies.rectangle(width / 2, height - 30, 100, 10, {
  isStatic: true,
});

const paddle2 = Matter.Bodies.rectangle(width / 2, 30, 100, 10, {
  isStatic: true,
});

Matter.World.add(world, [puck, paddle1, paddle2]);

const CircleRenderer = ({ size, color, body }) => {
  const { position } = body;
  const radius = size[0] / 2;

  const circleStyle = {
    width: size[0],
    height: size[1],
    borderRadius: radius,
    backgroundColor: color,
    position: "absolute",
    left: position.x - radius,
    top: position.y - radius,
  };

  return <View style={circleStyle} />;
};

const BoxRenderer = ({ size, color, body }) => {
  const { position } = body;

  const boxStyle = {
    width: size[0],
    height: size[1],
    backgroundColor: color,
    position: "absolute",
    left: position.x - size[0] / 2,
    top: position.y - size[1] / 2,
  };

  return <View style={boxStyle} />;
};

const HockeyGame = () => {
  const [entities, setEntities] = useState({
    puck: {
      body: puck,
      size: [30, 30],
      color: "white",
      renderer: CircleRenderer,
    },
    paddle1: {
      body: paddle1,
      size: [100, 10],
      color: "blue",
      renderer: BoxRenderer,
    },
    paddle2: {
      body: paddle2,
      size: [100, 10],
      color: "red",
      renderer: BoxRenderer,
    },
  });

  const handleLeftPress = () => {
    // Move the left paddle to the left
  };

  const handleRightPress = () => {
    // Move the right paddle to the right
  };

  // Update puck position in the game loop
  const updatePuck = (entities, { time }) => {
    Matter.Engine.update(engine, time.delta);
    entities.puck.body = puck;
    return entities;
  };

  return (
    <View style={styles.container}>
      <GameEngine style={styles.gameContainer} systems={[]} entities={entities}>
        <GameLoop
          onUpdate={(time) => setEntities(updatePuck(entities, time))}
        />
      </GameEngine>

      <TouchableOpacity style={styles.leftButton} onPress={handleLeftPress} />
      <TouchableOpacity style={styles.rightButton} onPress={handleRightPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  gameContainer: {
    flex: 1,
  },
  leftButton: {
    position: "absolute",
    left: 20,
    bottom: 20,
    width: 50,
    height: 50,
    backgroundColor: "blue",
    borderRadius: 25,
  },
  rightButton: {
    position: "absolute",
    right: 20,
    top: 20,
    width: 50,
    height: 50,
    backgroundColor: "red",
    borderRadius: 25,
  },
});

export default HockeyGame;

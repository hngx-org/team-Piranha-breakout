import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, PanResponder } from "react-native";
import { Audio } from "expo-av";

const GameScreen = () => {
  const [ballPosition, setBallPosition] = useState({
    x: Dimensions.get("window").width / 2 - BALL_SIZE / 2,
    y: Dimensions.get("window").height - 100,
  });
  const [paddlePosition, setPaddlePosition] = useState(
    (Dimensions.get("window").width - PADDLE_WIDTH) / 2
  );

  // Initialize ball velocity
  let ballVelocityX = 5; // Adjust the initial velocity as needed
  let ballVelocityY = -5; // Negative value to make the ball fall down

  // Define the bricks data structure
  const [bricks, setBricks] = useState([
    { x: 10, y: 100, active: true },
    { x: 70, y: 100, active: true },
    { x: 130, y: 100, active: true },
    { x: 190, y: 100, active: true },
    { x: 250, y: 100, active: true },
    { x: 310, y: 100, active: true },
    { x: 370, y: 100, active: true },
    { x: 430, y: 100, active: true },
    { x: 490, y: 100, active: true },
    { x: 550, y: 100, active: true },
    // Add more bricks as needed
  ]);

  useEffect(() => {
    // Initialize game loop
    const gameLoop = setInterval(updateGame, 16); // 60 frames per second

    // Clean up the interval when the component unmounts
    return () => clearInterval(gameLoop);
  }, []);

  //   const updateGame = () => {
  //     // Update ball position based on its velocity
  //     setBallPosition((prevPosition) => ({
  //       x: prevPosition.x + ballVelocityX,
  //       y: prevPosition.y + ballVelocityY,
  //     }));

  //     // Check for collisions with walls, paddle, and bricks
  //     handleCollisions();

  //     // Check for game over conditions
  //     checkGameOver();
  //   };

  const updateGame = () => {
    // Update ball position based on its velocity
    setBallPosition((prevPosition) => ({
      x: prevPosition.x + ballVelocityX,
      y: prevPosition.y + ballVelocityY,
    }));

    // Check for collisions with walls, paddle, and bricks
    handleCollisions();

    // Check for game over conditions
    checkGameOver();

    // Ensure the ball stays within the screen boundaries
    if (
      ballPosition.x < 0 ||
      ballPosition.x + BALL_SIZE > Dimensions.get("window").width
    ) {
      // Reverse the horizontal velocity to keep the ball within the screen
      ballVelocityX = -ballVelocityX;
    }

    if (ballPosition.y < 0) {
      // Reverse the vertical velocity to keep the ball within the screen
      ballVelocityY = -ballVelocityY;
    }
  };

  const handleCollisions = () => {
    const ballRight = ballPosition.x + BALL_SIZE;
    const ballBottom = ballPosition.y + BALL_SIZE;

    // Check for collisions with the left wall
    if (ballPosition.x < 0) {
      ballVelocityX = Math.abs(ballVelocityX); // Reverse the horizontal velocity
    }

    // Check for collisions with the right wall
    if (ballRight > Dimensions.get("window").width) {
      ballVelocityX = -Math.abs(ballVelocityX); // Reverse the horizontal velocity
    }

    // Check for collisions with the top wall
    if (ballPosition.y < 0) {
      ballVelocityY = Math.abs(ballVelocityY); // Reverse the vertical velocity
    }

    // Check for collision with the paddle
    if (
      ballBottom >= PADDLE_Y &&
      ballRight >= paddlePosition &&
      ballPosition.x <= paddlePosition + PADDLE_WIDTH
    ) {
      ballVelocityY = -Math.abs(ballVelocityY); // Reverse the vertical velocity
    }

    // Check for collision with bricks
    bricks.forEach((brick, index) => {
      if (brick.active) {
        if (
          ballBottom >= brick.y &&
          ballPosition.y <= brick.y + BRICK_HEIGHT &&
          ballRight >= brick.x &&
          ballPosition.x <= brick.x + BRICK_WIDTH
        ) {
          // The ball has hit a brick
          brick.active = false; // Deactivate the brick
          ballVelocityY = -ballVelocityY; // Reverse the vertical velocity
        }
      }
    });
  };

  const checkGameOver = () => {
    // Check if all bricks are destroyed
    if (bricks.every((brick) => !brick.active)) {
      // Handle game over, e.g., reset the ball's position and bricks
      setBallPosition({
        x: Dimensions.get("window").width / 2 - BALL_SIZE / 2,
        y: Dimensions.get("window").height - 100,
      });
      setBricks([
        { x: 10, y: 100, active: true },
        { x: 70, y: 100, active: true },
        // Add more bricks as needed
      ]);
      // You can also increment the level or perform other actions here.
    }

    // Check if the ball has gone below the bottom of the screen
    if (ballPosition.y > Dimensions.get("window").height) {
      // Handle game over, e.g., reset the ball's position and bricks
      setBallPosition({
        x: Dimensions.get("window").width / 2 - BALL_SIZE / 2,
        y: Dimensions.get("window").height - 100,
      });
      setBricks([
        { x: 10, y: 100, active: true },
        { x: 70, y: 100, active: true },
        // Add more bricks as needed
      ]);
      // You may also decrement lives here if applicable.
    }
  };

  const handlePaddleMove = (e, gestureState) => {
    // Update the paddle position based on the user's touch or drag gesture
    let newPaddlePosition = gestureState.moveX - PADDLE_WIDTH / 2;
    if (newPaddlePosition < 0) {
      newPaddlePosition = 0;
    } else if (
      newPaddlePosition >
      Dimensions.get("window").width - PADDLE_WIDTH
    ) {
      newPaddlePosition = Dimensions.get("window").width - PADDLE_WIDTH;
    }
    setPaddlePosition(newPaddlePosition);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: handlePaddleMove,
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Render game elements: paddle, ball, and bricks */}
      <View
        style={[styles.paddle, { left: paddlePosition, bottom: PADDLE_Y }]}
      />
      <View
        style={[styles.ball, { left: ballPosition.x, top: ballPosition.y }]}
      />
      {bricks.map(
        (brick, index) =>
          brick.active && (
            <View
              key={index}
              style={[
                styles.brick,
                { left: brick.x, top: brick.y, backgroundColor: "blue" },
              ]}
            />
          )
      )}
    </View>
  );
};

const BALL_SIZE = 20;
const PADDLE_WIDTH = 100;
const PADDLE_Y = 20;
const BRICK_WIDTH = 50;
const BRICK_HEIGHT = 20;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  paddle: {
    position: "absolute",
    width: PADDLE_WIDTH,
    height: 20,
    backgroundColor: "red",
  },
  ball: {
    position: "absolute",
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    backgroundColor: "red",
  },
  brick: {
    position: "absolute",
    width: BRICK_WIDTH,
    height: BRICK_HEIGHT,
    backgroundColor: "blue",
  },
});

export default GameScreen;

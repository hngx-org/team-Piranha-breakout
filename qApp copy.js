import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
  PanResponder,
} from "react-native";
import { activateKeepAwake } from "expo-keep-awake";
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";
import Constants from "./Constants";
import Physics from "./Physics";
import Racket from "./Racket";
import Ball from "./Ball";
import Wall from "./Wall";
import heart from "./assets/heart.png";
import { Gyroscope } from "expo-sensors";

const App = () => {
  const [running, setRunning] = useState(true);
  const [start, setStart] = useState(false);
  const [lives, setLives] = useState(3);
  const [paddleX, setPaddleX] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);
  const [subscription, setSubscription] = useState(null);

  const gameEngine = useRef(null);
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: handlePaddleMove,
  });

  const handlePaddleMove = (e, gestureState) => {
    if (gameEngine.current && gameEngine.current.entities.racket) {
      let newPaddlePosition = gestureState.moveX - 100 / 2;
      if (newPaddlePosition < 0) {
        newPaddlePosition = 0;
      } else if (newPaddlePosition > Dimensions.get("window").width - 100) {
        newPaddlePosition = Dimensions.get("window").width - 100;
      }

      Matter.Body.setPosition(gameEngine.current.entities.racket.body, {
        x: newPaddlePosition + 100 / 2,
        y: gameEngine.current.entities.racket.body.position.y,
      });

      setPaddleX(newPaddlePosition);
    }
  };

  const onEvent = (e) => {
    if (e.type === "game-over") {
      resetBall();
      setRunning(false);
      setLives(0);
    } else if (e.type === "ball-lost") {
      const newLives = lives - 1;
      resetBall();
      setStart(false);
      setLives(newLives);
    }
  };

  const resetBall = () => {
    Matter.Body.setVelocity(gameEngine.current.entities.ball.body, {
      x: 0,
      y: 0,
    });

    Matter.Body.setPosition(gameEngine.current.entities.ball.body, {
      x: Constants.RACKET_START_X_POSITION,
      y: Constants.RACKET_Y_POSITION - 20,
    });
  };

  const startGame = (e) => {
    activateKeepAwake();
    setStart(true);
    const force = 10;
    const angle = Matter.Vector.angle(
      gameEngine.current.entities.ball.body.position,
      {
        x: e.nativeEvent.locationX,
        y: e.nativeEvent.locationY,
      }
    );
    Matter.Body.setVelocity(gameEngine.current.entities.ball.body, {
      x: force * Math.cos(angle),
      y: force * Math.sin(angle),
    });
  };

  const reset = () => {
    setRunning(true);
    setStart(false);
    setLives(3);
  };

  useEffect(() => {
    const subscribe = () => {
      setSubscription(
        Gyroscope.addListener((gyroscopeData) => {
          setX(gyroscopeData.x);
          setY(gyroscopeData.y);
          setZ(gyroscopeData.z);
        })
      );
    };

    const unsubscribe = () => {
      if (subscription) {
        subscription.remove();
        setSubscription(null);
      }
    };

    subscribe();

    return () => {
      unsubscribe();
    };
  }, []);

  const entities = {
    // Define your entities here...
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <GameEngine
        ref={gameEngine}
        style={styles.gameContainer}
        systems={[Physics]}
        running={running}
        onEvent={onEvent}
        entities={entities}
      >
        <StatusBar hidden={true} />
      </GameEngine>
      <Image source={heart} style={styles.heart} />
      <Text style={styles.livesText}>{lives}</Text>
      {!running && (
        <TouchableOpacity style={styles.fullScreenButton} onPress={reset}>
          <View style={styles.gameOverFullScreen}>
            <Text style={styles.gameOverText}>Game Over</Text>
          </View>
        </TouchableOpacity>
      )}
      {!start && (
        <TouchableOpacity
          style={[
            styles.fullScreenButton,
            { borderWidth: 2, borderColor: "red" },
          ]}
          onPress={startGame}
        >
          <View style={styles.startFullScreen}>
            <Text style={styles.startText}>Click to start</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  gameContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  gameOverText: {
    color: "white",
    fontSize: 48,
  },
  startText: {
    color: "#fff",
    fontSize: 30,
    textAlign: "center",
  },
  gameOverFullScreen: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  paddle: {
    position: "absolute",
    width: 100,
    height: 20,
    backgroundColor: "red",
    marginBottom: 50,
  },
  startFullScreen: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    opacity: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenButton: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
  },
  heart: {
    position: "absolute",
    bottom: 5,
    left: 20,
    flex: 1,
  },
  livesText: {
    position: "absolute",
    bottom: 4,
    left: 50,
    flex: 1,
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default App;

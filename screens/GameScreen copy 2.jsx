import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  PanResponder,
} from "react-native";
import { activateKeepAwakeAsync } from "expo-keep-awake";
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";
import Constants from "../component/Constants";
import Physics from "../component/Physics";
import Racket from "../component/Racket";
import Ball from "../component/BallBreaker";
import Wall from "../component/BallBreaker";
import heart from "../assets/heart.png";
import { Gyroscope } from "expo-sensors";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      running: true, // game on / off
      start: false, // ball thrown
      lives: 5, // nb lives
      paddleX: 0,
      bricks: [
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
      ],
      paddlePosition: (Dimensions.get("window").width - 100) / 2,
      x: 0,
      y: 0,
      z: 0,
      subscription: null,
    };
    this.gameEngine = null;
    this.entities = this.setupWorld();
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.handlePaddleMove,
    });
  }

  handlePaddleMove = (e, gestureState) => {
    if (this.entities.racket) {
      // Update the position of the racket's body
      let newPaddlePosition = gestureState.moveX - 100 / 2;
      if (newPaddlePosition < 0) {
        newPaddlePosition = 0;
      } else if (newPaddlePosition > Dimensions.get("window").width - 100) {
        newPaddlePosition = Dimensions.get("window").width - 100;
      }

      Matter.Body.setPosition(this.entities.racket.body, {
        x: newPaddlePosition + 100 / 2, // Adjusted for the width of the racket
        y: this.entities.racket.body.position.y, // Keep the same Y position
      });

      // Update the state if you need to track the position in your component's state
      this.setState({ paddlePosition: newPaddlePosition });
    }
  };

  checkGameOver = () => {
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

  setupWorld = () => {
    let engine = Matter.Engine.create({ enableSleeping: false });
    let world = engine.world;
    world.gravity.y = 0;

    let racket = Matter.Bodies.rectangle(
      Constants.RACKET_START_X_POSITION,
      Constants.RACKET_Y_POSITION,
      Constants.RACKET_WIDTH,
      Constants.RACKET_HEIGHT,
      { isStatic: true }
    );

    let ball = Matter.Bodies.circle(
      Constants.RACKET_START_X_POSITION,
      Constants.RACKET_Y_POSITION - 20,
      6,
      {
        isStatic: false,
        restitution: 1,
        inertia: Infinity, // no speed loss due to torque in a collision
        friction: 0, // perfect slide in a collision
        frictionAir: 0, // no air resistance
        frictionStatic: 0, // never stop moving
        collisionFilter: { group: -1 },
      }
    );
    ball.label = "ball";

    let wallLeft = Matter.Bodies.rectangle(
      Constants.WALL_WIDTH / 2,
      Constants.WALL_HEIGHT / 2,
      Constants.WALL_WIDTH,
      Constants.WALL_HEIGHT,
      {
        isStatic: true,
      }
    );

    let wallRight = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH - Constants.WALL_WIDTH / 2,
      Constants.MAX_HEIGHT - Constants.WALL_HEIGHT / 2,
      Constants.WALL_WIDTH,
      Constants.WALL_HEIGHT,
      {
        isStatic: true,
      }
    );

    let ceiling = Matter.Bodies.rectangle(
      Constants.RACKET_START_X_POSITION,
      Constants.WALL_WIDTH / 2,
      Constants.WALL_HEIGHT,
      Constants.WALL_WIDTH,
      {
        isStatic: true,
      }
    );

    let floor = Matter.Bodies.rectangle(
      Constants.RACKET_START_X_POSITION,
      Constants.MAX_HEIGHT,
      Constants.WALL_HEIGHT,
      Constants.WALL_WIDTH,
      {
        isStatic: true,
      }
    );
    floor.label = "floor";

    Matter.World.add(world, [
      racket,
      ball,
      wallLeft,
      wallRight,
      ceiling,
      floor,
    ]);

    Matter.Events.on(engine, "collisionStart", (event) => {
      var pairs = event.pairs;

      let labels = [pairs[0].bodyA.label, pairs[0].bodyB.label];
      if (labels.indexOf("ball") >= 0 && labels.indexOf("floor") >= 0) {
        if (this.state.lives > 1) {
          this.gameEngine.dispatch({ type: "ball-lost" });
        } else {
          this.gameEngine.dispatch({ type: "game-over" });
        }
      }
    });

    return {
      physics: { engine: engine, world: world },
      racket: {
        body: racket,
        size: [Constants.RACKET_WIDTH, Constants.RACKET_HEIGHT],
        color: "#393eca",
        paddlePosition: this.state.paddlePosition,
        renderer: Racket,
      },
      ball: {
        body: ball,
        size: [20, 20],
        color: "#ffffff",
        renderer: Ball,
      },
      wallLeft: {
        body: wallLeft,
        size: [Constants.WALL_WIDTH, Constants.WALL_HEIGHT],
        color: "#3464ff",
        renderer: Wall,
      },
      wallRight: {
        body: wallRight,
        size: [Constants.WALL_WIDTH, Constants.WALL_HEIGHT],
        color: "#3464ff",
        renderer: Wall,
      },
      ceiling: {
        body: ceiling,
        size: [Constants.WALL_HEIGHT, Constants.WALL_WIDTH],
        color: "#d6e0ff",
        renderer: Wall,
      },
      floor: {
        body: floor,
        size: [Constants.WALL_HEIGHT, Constants.WALL_WIDTH],
        color: "red",
        renderer: Wall,
      },
    };
  };

  onEvent = (e) => {
    if (e.type === "game-over") {
      this.resetBall();
      this.setState({
        running: false,
        lives: 0,
      });
    } else if (e.type === "ball-lost") {
      let newLives = this.state.lives - 1;
      this.resetBall();
      this.setState({
        start: false,
        lives: newLives,
      });
    }
  };

  resetBall = () => {
    Matter.Body.setVelocity(this.entities.ball.body, { x: 0, y: 0 });

    Matter.Body.setPosition(this.entities.ball.body, {
      x: Constants.RACKET_START_X_POSITION,
      y: Constants.RACKET_Y_POSITION - 20,
    });
  };

  thepause = (e) => {
    this.setState({
      start: false,
      // running: false,
    });
  };
  start = (e) => {
    console.log("start");
    activateKeepAwakeAsync();

    this.setState({
      start: true,
    });

    let force = 10;

    let angle = Matter.Vector.angle(this.entities.ball.body.position, {
      x: e.nativeEvent.locationX,
      y: e.nativeEvent.locationY,
    });

    Matter.Body.setVelocity(this.entities.ball.body, {
      x: force * Math.cos(angle),
      y: force * Math.sin(angle),
    });
  };

  reset = () => {
    this.setState({
      running: true,
      start: false,
      lives: 3,
    });
  };

  componentDidMount() {
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _slow = () => Gyroscope.setUpdateInterval(1000);

  _fast = () => Gyroscope.setUpdateInterval(16);

  _subscribe = () => {
    this.setState({
      subscription: Gyroscope.addListener((gyroscopeData) => {
        this.setState({
          x: gyroscopeData.x,
          y: gyroscopeData.y,
          z: gyroscopeData.z,
        });
      }),
    });
  };

  _unsubscribe = () => {
    if (this.state.subscription) {
      this.state.subscription.remove();
      this.setState({ subscription: null });
    }
  };

  render() {
    return (
      <View style={styles.container} {...this.panResponder.panHandlers}>
        <ImageBackground
          source={{
            uri: "https://opengameart.org/sites/default/files/tileable-grass_clover_tt7010116-sample_1.png",
          }}
          style={styles.backgroundImage}
        >
          <GameEngine
            ref={(ref) => {
              this.gameEngine = ref;
            }}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
            systems={[Physics]}
            running={this.state.running}
            onEvent={this.onEvent}
            entities={this.entities}
          >
            <StatusBar hidden={true} />
          </GameEngine>
          <View
            style={{
              position: "absolute",
              bottom: 5,
              flex: 1,
            }}
          >
            <Text
              style={{
                position: "absolute",
                bottom: 4,
                left: 50,
                flex: 1,
                fontSize: 20,
                color: "#ffffff",
                fontWeight: "bold",
              }}
            >
              {this.state.lives}: Life left
            </Text>
          </View>
          <TouchableOpacity
            // onPress={() => console.log("pause game")}
            style={{
              // position: "absolute",
              // bottom: 5,
              // flex: 1,

              position: "absolute",
              bottom: 5,
              right: 20,
              flex: 1,
              zIndex: 40,
            }}
            onPressIn={this.thepause}
            onPress={this.thepause}
          >
            <Text
              style={{
                // position: "absolute",
                // bottom: 4,
                // left: 250,
                // flex: 1,
                // fontSize: 20,
                // color: "#ffffff",
                // fontWeight: "bold",

                flex: 1,
                fontSize: 20,
                color: "#ffffff",
                fontWeight: "bold",
              }}
            >
              pause game
            </Text>
          </TouchableOpacity>

          {!this.state.running && (
            <TouchableOpacity
              style={{
                // position: "absolute",
                // top: 0,
                // bottom: 0,
                // left: 0,
                // right: 0,
                // flex: 1,
                position: "absolute",
                top: "40%",
                // bottom: 0,
                height: "fit-content",
                left: 0,
                right: 0,
                minHeight: 130,
                flex: 1,
                backgroundColor: "red",
                borderWidth: 2,
                borderColor: "white",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 40,
              }}
              onPress={this.reset}
              onPressIn={this.reset}
            >
              <View
                style={{
                  // borderWidth: 2,
                  // borderColor: "white",
                  // position: "absolute",
                  // top: 0,
                  // bottom: 0,
                  // left: 0,
                  // right: 0,
                  // backgroundColor: "red",
                  // opacity: 1,
                  // justifyContent: "center",
                  // alignItems: "center",
                  // height: "50%",

                  opacity: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 48 }}>Game Over</Text>
              </View>
            </TouchableOpacity>
          )}
          {!this.state.start && (
            <TouchableOpacity
              style={{
                // position: "absolute",
                // top: 0,
                // bottom: 0,
                // left: 0,
                // right: 0,
                // flex: 1,

                position: "absolute",
                top: "40%",
                // bottom: 0,
                height: "fit-content",
                left: 0,
                right: 0,
                minHeight: 130,
                flex: 1,
                backgroundColor: "red",
                borderWidth: 2,
                borderColor: "white",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 40,
              }}
              onPressIn={this.start}
              onPress={this.start}
            >
              <View
                style={{
                  // borderWidth: 2,
                  // borderColor: "white",
                  // position: "absolute",
                  // top: 0,
                  // bottom: 0,
                  // left: 0,
                  // right: 0,
                  // backgroundColor: "red",
                  // opacity: 1,
                  // justifyContent: "center",
                  // alignItems: "center",
                  // height: "20%",
                  opacity: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 30, textAlign: "center" }}
                >
                  Start Game
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
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
  startFullScreen: {},

  heart: {
    position: "absolute",
    bottom: 5,
    left: 20,
    flex: 1,
  },
});

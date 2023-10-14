import React, { useState, useEffect } from "react";
import {
  Dimensions,
  View,
  PanResponder,
  Text,
  TouchableHighlight,
} from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import {
  CircleRenderer,
  RectangleRenderer,
} from "../component/CustomRenderers";
import Physics from "../component/Physics";

export default function GameScene() {
  const { width, height } = Dimensions.get("window");

  const engine = Matter.Engine.create();
  const world = engine.world;
  world.gravity.y = 0;

  const [ballMoving, setBallMoving] = useState(false);
  const [ballSize, setBallSize] = useState(15);
  const [paddlePosition, setPaddlePosition] = useState({
    x: width / 2,
    y: height - 30,
  });
  const [score, setScore] = useState(0);

  const entities = {
    physics: { engine: engine, world: world },
    paddle: {
      body: Matter.Bodies.rectangle(
        paddlePosition.x,
        paddlePosition.y,
        120,
        15,
        { isStatic: true }
      ),
      position: paddlePosition,
      size: [120, 15],
      color: "blue",
      renderer: RectangleRenderer,
    },
    ball: {
      body: Matter.Bodies.circle(width / 2, height - 50, ballSize),
      position: { x: width / 2, y: height - 50 },
      size: [ballSize],
      color: "red",
      renderer: CircleRenderer,
    },
  };

  const updatePhysics = (entities, { time }) => {
    Matter.Engine.update(entities.physics.engine, time.delta);

    const ballPosition = entities.ball.body.position;
    if (ballPosition.y > height) {
      setBallMoving(false);
      Matter.Body.setPosition(entities.ball.body, {
        x: width / 2,
        y: height - 50,
      });
      Matter.Body.setVelocity(entities.ball.body, { x: 0, y: 0 });
      setScore(score - 1);
    }

    return entities;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      const { moveX } = gestureState;
      const newPaddleX = Math.max(60, Math.min(width - 60, moveX));
      setPaddlePosition({ x: newPaddleX, y: paddlePosition.y });
      Matter.Body.setPosition(entities.paddle.body, {
        x: newPaddleX,
        y: paddlePosition.y,
      });
    },
    onPanResponderGrant: () => {
      if (!ballMoving) {
        const initialVelocity = { x: 0, y: -10 };
        Matter.Body.setVelocity(entities.ball.body, initialVelocity);
        setBallMoving(true);
      }
    },
  });

  useEffect(() => {
    // Create a watcher interval to move the ball and paddle
    const watcherInterval = setInterval(() => {
      // Move the paddle left and right
      const newPaddleX = paddlePosition.x + 2; // Adjust the speed as needed
      if (newPaddleX > width - 60) {
        // Reset the paddle's position when it reaches the right edge
        setPaddlePosition({ x: 60, y: paddlePosition.y });
      } else {
        setPaddlePosition({ x: newPaddleX, y: paddlePosition.y });
      }

      // Move the ball up and down
      const ballY = entities.ball.body.position.y;
      const newBallY = ballY + 2; // Adjust the speed as needed
      if (newBallY > height - 50) {
        // Reset the ball's position when it reaches the bottom
        Matter.Body.setPosition(entities.ball.body, {
          x: width / 2,
          y: height - 50,
        });
      } else {
        Matter.Body.setPosition(entities.ball.body, {
          x: width / 2,
          y: newBallY,
        });
      }
    }, 30); // Adjust the interval for the desired speed

    return () => {
      clearInterval(watcherInterval); // Clean up the interval when the component unmounts
    };
  }, [paddlePosition, entities, ballMoving]);

  const startGame = () => {
    if (!ballMoving) {
      const initialVelocity = { x: 0, y: -10 };
      Matter.Body.setVelocity(entities.ball.body, initialVelocity);
      setBallMoving(true);
    }
  };

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <GameEngine
        style={{ flex: 1 }}
        systems={[Physics]}
        // systems={[updatePhysics]}
        entities={entities}
        running={true}
      />
      <Text
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          fontSize: 20,
          color: "white",
        }}
      >
        Score: {score}
      </Text>
      {!ballMoving && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TouchableHighlight
            onPress={startGame}
            style={{ backgroundColor: "green", padding: 10 }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>Start Game</Text>
          </TouchableHighlight>
        </View>
      )}
    </View>
  );
}

// import React, { useState, useEffect } from "react";
// import { Dimensions, View, PanResponder, Text } from "react-native";
// import { GameEngine } from "react-native-game-engine";
// import Matter from "matter-js";
// import {
//   CircleRenderer,
//   RectangleRenderer,
// } from "../component/CustomRenderers";

// export default function GameScene() {
//   const { width, height } = Dimensions.get("window");

//   const engine = Matter.Engine.create();
//   const world = engine.world;
//   world.gravity.y = 0;

//   const [ballMoving, setBallMoving] = useState(false);
//   const [paddlePosition, setPaddlePosition] = useState({
//     x: width / 2,
//     y: height - 30,
//   });
//   const [score, setScore] = useState(0);

//   const entities = {
//     physics: { engine: engine, world: world },
//     paddle: {
//       body: Matter.Bodies.rectangle(
//         paddlePosition.x,
//         paddlePosition.y,
//         120,
//         15,
//         { isStatic: true }
//       ),
//       position: paddlePosition,
//       size: [120, 15],
//       color: "blue",
//       renderer: RectangleRenderer,
//     },
//     ball: {
//       body: Matter.Bodies.circle(width / 2, height - 50, 20),
//       position: { x: width / 2, y: height - 50 },
//       size: [20],
//       color: "red",
//       renderer: CircleRenderer,
//     },
//   };

//   const updatePhysics = (entities, { time }) => {
//     Matter.Engine.update(entities.physics.engine, time.delta);

//     // Check if the ball is lost
//     const ballPosition = entities.ball.body.position;
//     if (ballPosition.y > height) {
//       // The ball is below the screen, mark it as lost
//       setBallMoving(false);
//       Matter.Body.setPosition(entities.ball.body, {
//         x: width / 2,
//         y: height - 50,
//       });
//       Matter.Body.setVelocity(entities.ball.body, { x: 0, y: 0 });

//       // Decrease the score (or perform other actions)
//       setScore(score - 1);
//     }

//     return entities;
//   };

//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onPanResponderMove: (e, gestureState) => {
//       // Move the paddle left and right based on screen gestures
//       const { moveX } = gestureState;
//       const newPaddleX = Math.max(60, Math.min(width - 60, moveX));
//       setPaddlePosition({ x: newPaddleX, y: paddlePosition.y });
//       Matter.Body.setPosition(entities.paddle.body, {
//         x: newPaddleX,
//         y: paddlePosition.y,
//       });
//     },
//     onPanResponderGrant: () => {
//       if (!ballMoving) {
//         // Give the ball an initial velocity to start moving
//         const initialVelocity = { x: 0, y: -10 };
//         Matter.Body.setVelocity(entities.ball.body, initialVelocity);
//         setBallMoving(true);
//       }
//     },
//   });

//   return (
//     <View style={{ flex: 1 }} {...panResponder.panHandlers}>
//       <GameEngine
//         style={{ flex: 1 }}
//         systems={[updatePhysics]}
//         entities={entities}
//         running={true}
//       />
//       <Text
//         style={{
//           position: "absolute",
//           top: 10,
//           right: 10,
//           fontSize: 20,
//           color: "white",
//         }}
//       >
//         Score: {score}
//       </Text>
//     </View>
//   );
// }

// `import React, { useState } from "react";
// import {
//   Dimensions,
//   View,
//   PanResponder,
//   StatusBar,
//   TouchableHighlight,
//   Text,
// } from "react-native";
// import { GameEngine } from "react-native-game-engine";
// import Matter from "matter-js";
// import {
//   CircleRenderer,
//   RectangleRenderer,
// } from "../component/CustomRenderers";

// export default function GameScene() {
//   const { width, height } = Dimensions.get("window");

//   const [isRunning, setIsRunning] = useState(true);
//   const [ballMoving, setBallMoving] = useState(false);

//   const [gameStarted, setGameStarted] = useState(false);

//   // Create a Matter world
//   //   const world = Matter.World.create({ gravity: { x: 0, y: 0 } });

//   // Define the game engine entities

//   const entities = setUpEntities();

//   function setUpEntities() {
//     const engine = Matter.Engine.create({ enableSleeping: false });
//     const world = engine.world;
//     world.gravity.y = 0; // Adjust gravity as needed

//     const entities = {
//       physics: { engine: engine, world: world },
//       paddle: {
//         body: Matter.Bodies.rectangle(width / 2, height - 30, 120, 15, {
//           isStatic: true,
//         }),
//         position: { x: width / 2, y: height - 30 },
//         size: [80, 15],
//         color: "blue",
//         renderer: RectangleRenderer,
//       },
//       ball: {
//         body: Matter.Bodies.circle(width / 2, height - 50, 20, {
//           isStatic: false,
//           restitution: 1,
//           inertia: Infinity, // no speed loss due to torque in a collision
//           friction: 0, // perfect slide in a collision
//           frictionAir: 0, // no air resistance
//           frictionStatic: 0, // never stop moving
//           collisionFilter: { group: -1 },
//         }),
//         position: { x: width / 2, y: height - 50 },
//         size: [10],
//         color: "red",
//         renderer: CircleRenderer,
//       },
//     };

//     console.log("Ball position 0:", entities.ball.body.position);

//     return entities;
//   }

//   const updatePhysics = (entities, { time }) => {
//     Matter.Engine.update(entities.physics.engine, time?.delta);
//     return entities;
//   };

//   const handleEvent = (event) => {
//     // Handle events based on event.type
//     if (event.type === "win") {
//       // Handle winning logic
//     } else if (event.type === "lose") {
//       // Handle losing logic
//     }
//     // Add more event handling as needed
//   };

//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onMoveShouldSetPanResponder: () => true,
//     onPanResponderGrant: (e) => {
//       //   if (!ballMoving) {
//       // Give the ball an initial velocity to start moving
//       const initialVelocity = { x: 10, y: -10 }; // Adjust as needed
//       //   Matter.Body.setVelocity(entities.ball.body, initialVelocity);
//       setBallMoving(true);

//       console.log("Ball velocity:", initialVelocity);

//       let force = 10;

//       let angle = Matter.Vector.angle(entities.ball.body.position, {
//         x: e.nativeEvent.locationX,
//         y: e.nativeEvent.locationY,
//       });

//       Matter.Body.setVelocity(entities.ball.body, {
//         x: force * Math.cos(angle),
//         y: force * Math.sin(angle),
//       });

//       console.log("Ball position:", entities.ball.body.position);
//       //   }
//     },
//   });

//   const startGame = () => {
//     setIsRunning(true); // Set the game to running
//     setGameStarted(true); // Set the game as started
//   };

//   const startButton = (
//     <TouchableHighlight
//       onPress={startGame}
//       style={{ backgroundColor: "green", padding: 10 }}
//     >
//       <Text style={{ color: "white", fontSize: 20 }}>Start Game</Text>
//     </TouchableHighlight>
//   );

//   return (
//     <View style={{ flex: 1 }} {...panResponder.panHandlers}>
//       {/* {gameStarted ? ( */}
//       <GameEngine
//         style={{ flex: 1 }}
//         systems={[updatePhysics]}
//         entities={entities}
//         running={isRunning}
//         onEvent={handleEvent}
//       />
//       {/* ) : ( */}
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         {startButton}
//       </View>
//       {/* )} */}

//       {/* <StatusBar hidden={true} /> */}
//     </View>
//   );
// }`

// import React, { Component } from "react";
// import { View, Dimensions } from "react-native";
// import { GameEngine } from "react-native-game-engine";
// import Matter from "matter-js";

// const { width, height } = Dimensions.get("window");

// // Define the physics engine
// const engine = Matter.Engine.create({ enableSleeping: false });
// const world = engine.world;

// class PlayGameScreen extends Component {
//   constructor(props) {
//     super(props);

//     // Create a ball
//     const ball = Matter.Bodies.circle(width / 2, height / 2, 30, {
//       restitution: 0.7,
//     });
//     Matter.World.add(world, [ball]);

//     this.state = {
//       entities: {
//         physics: {
//           engine: engine,
//           world: world,
//         },
//         ball: {
//           body: ball,
//           size: [60, 60],
//           color: "red",
//           renderer: {
//             sprite: {
//               texture: require("../assets/ball.png"),
//               xScale: 0.5,
//               yScale: 0.5,
//             },
//           },
//         },
//       },
//     };
//   }

//   render() {
//     return (
//       <View style={{ flex: 1 }}>
//         <GameEngine
//           style={{ flex: 1 }}
//           systems={[]}
//           entities={this.state.entities}
//         />
//       </View>
//     );
//   }
// }

// export default PlayGameScreen;

// import React, { useEffect } from "react";
// import { View, Dimensions, StyleSheet, Image } from "react-native";
// import { GameEngine } from "react-native-game-engine";
// import Matter from "matter-js";

// const { width, height } = Dimensions.get("window");

// const PlayGameScreen = ({ navigation }) => {
//   //   useEffect(() => {
//   const engine = Matter.Engine.create({ enableSleeping: false });
//   const world = engine.world;

//   // Create a ball
//   const ball = Matter.Bodies.circle(width / 2, height / 2, 30, {
//     restitution: 0.7,
//   });
//   Matter.World.add(world, [ball]);

//   const entities = {
//     physics: {
//       engine: engine,
//       world: world,
//     },
//     ball: {
//       body: ball,
//       size: [60, 60],
//       color: "red",
//       renderer: {
//         sprite: {
//           texture: require("../assets/ball.png"),
//           xScale: 0.5,
//           yScale: 0.5,
//         },
//       },
//     },
//   };

//   // const gameEngine = (
//   //   <GameEngine style={styles.container} systems={[]} entities={entities} />
//   // );

//   //     return () => {
//   //       Matter.Engine.clear(engine);
//   //     };
//   //   }, []);

//   return (
//     <View style={styles.container}>
//       <GameEngine style={styles.container} systems={[]} entities={entities} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default PlayGameScreen;

import React, { Component } from "react";
import { View, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";

const { width, height } = Dimensions.get("window");

// Define the physics engine
const engine = Matter.Engine.create({ enableSleeping: false });
const world = engine.world;

class PlayGameScreen extends Component {
  constructor(props) {
    super(props);

    // Create a ball
    const ball = Matter.Bodies.circle(width / 2, height / 2, 30, {
      restitution: 0.7,
    });
    Matter.World.add(world, [ball]);

    this.state = {
      entities: {
        physics: {
          engine: engine,
          world: world,
        },
        ball: {
          body: ball,
          size: [60, 60],
          color: "red",
          renderer: {
            sprite: {
              texture: require("../assets/ball.png"),
              xScale: 0.5,
              yScale: 0.5,
            },
          },
        },
      },
    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <GameEngine
          style={{ flex: 1 }}
          systems={[]}
          entities={this.state.entities}
        />
      </View>
    );
  }
}

export default PlayGameScreen;

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

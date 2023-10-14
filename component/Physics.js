import Matter from "matter-js";
import Constants from "./Constants";

const Physics = (entities, { touches, time }) => {
  let engine = entities.physics.engine;
  Matter.Engine.update(engine, time.delta);

  return entities;
};

export default Physics;

// const Physics = (entities, { touches, time }) => {
//   let engine = entities.physics.engine;
//   Matter.Engine.update(engine, time.delta);

//   // Handle collisions
//   Matter.Events.on(engine, "collisionStart", (event) => {
//     var pairs = event.pairs;

//     for (let i = 0; i < pairs.length; i++) {
//       const pair = pairs[i];
//       if (pair.bodyA.label === "ball" && pair.bodyB.label === "brick") {
//         // Mark the brick as inactive when hit by the ball
//         entities.bricks[pair.bodyB.brickIndex].active = false;
//       } else if (pair.bodyA.label === "brick" && pair.bodyB.label === "ball") {
//         // Mark the brick as inactive when hit by the ball
//         entities.bricks[pair.bodyA.brickIndex].active = false;
//       }
//     }
//   });

//   return entities;
// };

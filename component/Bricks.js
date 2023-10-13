import React from "react";
import { View } from "react-native";

const Bricks = (props) => {
  //   console.log({ props });
  const width = props.size[0];
  const height = props.size[1];
  //   const x = props.body.position.x - width / 2;
  //   const y = props.body.position.y - height / 2;

  return (
    <View
      style={{
        position: "absolute",
        left: 20,
        top: 20,
        width: width,
        height: height,
        backgroundColor: props.active ? "green" : "transparent",
      }}
    />
  );
};

export default Bricks;

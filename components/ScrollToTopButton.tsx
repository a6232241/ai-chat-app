import ArrowCircleDownIcon from "@/assets/icons/arrow_circle_down.svg";
import React from "react";
import { Pressable, View } from "react-native";

type Props = {
  onPress: () => void;
};

const ScrollToTopButton: React.FC<Props> = ({ onPress }) => {
  return (
    <>
      <View
        style={{
          position: "absolute",
          bottom: 80,
          right: 20,
          width: 50,
          height: 50,
          backgroundColor: "white",
          borderRadius: 25,
        }}>
        <Pressable onPress={onPress} style={{ width: "100%", height: "100%" }}>
          <ArrowCircleDownIcon width={"100%"} height={"100%"} color={"black"} />
        </Pressable>
      </View>
    </>
  );
};

export default ScrollToTopButton;

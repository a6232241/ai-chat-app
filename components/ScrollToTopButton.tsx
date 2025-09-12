import ArrowCircleDownIcon from "@/assets/icons/arrow_circle_down.svg";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";

type Props = {
  onPress: () => void;
};

const ScrollToTopButton: React.FC<Props> = ({ onPress }) => {
  const {
    colors: { text: color, background: backgroundColor },
  } = useTheme();

  return (
    <>
      <Pressable
        onPress={onPress}
        style={{
          position: "absolute",
          bottom: 80,
          right: 20,
          width: 50,
          height: 50,
          backgroundColor,
          borderRadius: 25,
          overflow: "hidden",
        }}>
        <ArrowCircleDownIcon width={"100%"} height={"100%"} color={color} />
      </Pressable>
    </>
  );
};

export default ScrollToTopButton;

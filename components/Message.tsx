import { MessageType } from "@/apis";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  data: MessageType;
};

const Message: React.FC<Props> = ({ data: { role, content } }) => {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          ...(role === "user" && { justifyContent: "flex-end" }),
        }}>
        <Text
          style={{
            padding: 10,
            borderRadius: 5,
            ...(role === "user" && { maxWidth: "80%", backgroundColor: "#ccc" }),
          }}>
          {content}
        </Text>
      </View>
    </>
  );
};

export default Message;

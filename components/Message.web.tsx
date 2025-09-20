import { MessageType } from "@/utils/Apis/Sqlite/Message/types";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  data: Pick<MessageType, "role" | "content" | "id">;
  deleteMessage: (id: string) => Promise<void>;
};

const Message: React.FC<Props> = ({ data: { role, content, id }, deleteMessage }) => {
  const {
    colors: { text: color, primary },
  } = useTheme();

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
            color,
            ...(role === "user" && { maxWidth: "80%", backgroundColor: primary }),
          }}>
          {content}
        </Text>
      </View>
    </>
  );
};

export default Message;

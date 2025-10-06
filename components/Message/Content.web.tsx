import { MessageType } from "@/utils/Apis/Sqlite/Message/types";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Text } from "react-native";

type Props = {
  data: Pick<MessageType, "role" | "content" | "id" | "status">;
};

const Content: React.FC<Props> = ({ data: { role, content, status, id } }) => {
  const {
    colors: { text: color, primary },
  } = useTheme();

  return (
    <>
      <Text
        style={{
          padding: 10,
          borderRadius: 5,
          color,
          ...((role === "user" || role === "system") && { backgroundColor: primary }),
        }}>
        {content}
      </Text>
    </>
  );
};

export default Content;

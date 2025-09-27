import Refresh from "@/assets/icons/refresh.svg";
import { MessageType } from "@/utils/Apis/Sqlite/Message/types";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  data: Pick<MessageType, "role" | "content" | "id"> & { status?: "error" };
  onResendMessage?: (id: string) => Promise<void>;
};

const Content: React.FC<Props> = ({ data: { role, content, status, id }, onResendMessage }) => {
  const {
    colors: { text: color, primary },
  } = useTheme();

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          ...((role === "user" || role === "system") && { justifyContent: "flex-end" }),
        }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            ...((role === "user" || role === "system") && { maxWidth: "80%" }),
          }}>
          {status === "error" && (
            <TouchableOpacity style={{ width: 30, height: 30 }} onPress={() => onResendMessage?.(id)}>
              <Refresh width={"100%"} height={"100%"} color={color} />
            </TouchableOpacity>
          )}
          <Text
            style={{
              padding: 10,
              borderRadius: 5,
              color,
              ...((role === "user" || role === "system") && { backgroundColor: primary }),
            }}>
            {content}
          </Text>
        </View>
      </View>
    </>
  );
};

export default Content;

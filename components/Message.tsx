import { MessageType } from "@/utils/Apis/Sqlite/Message/types";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { NativeSyntheticEvent, Platform, Text, View } from "react-native";
import ContextMenu, { ContextMenuOnPressNativeEvent } from "react-native-context-menu-view";

type Props = {
  data: Pick<MessageType, "role" | "content">;
};

const actions = [{ title: "複製" }];

const Message: React.FC<Props> = ({ data: { role, content } }) => {
  const handlePress = async (e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
    if (e.nativeEvent.index === 0) {
      await Clipboard.setStringAsync(content);
    }
  };

  return (
    <>
      {Platform.OS === "ios" && parseInt(Platform.Version, 10) <= 12 ? (
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
      ) : (
        <ContextMenu actions={actions} onPress={handlePress}>
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
        </ContextMenu>
      )}
    </>
  );
};

export default Message;

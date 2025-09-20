import { MessageType } from "@/utils/Apis/Sqlite/Message/types";
import { useTheme } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { NativeSyntheticEvent, Platform, Text, View } from "react-native";
import ContextMenu, { ContextMenuOnPressNativeEvent } from "react-native-context-menu-view";

type Props = {
  data: Pick<MessageType, "role" | "content" | "id">;
  deleteMessage: (id: string) => Promise<void>;
};

const actions = [{ title: "複製" }, { title: "刪除" }];

const Message: React.FC<Props> = ({ data: { role, content, id }, deleteMessage }) => {
  const {
    colors: { text: color, primary },
  } = useTheme();

  const handlePress = async (e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
    // 立即提取事件數據以避免合成事件被回收
    const menuIndex = e.nativeEvent.index;

    if (menuIndex === 0) {
      await Clipboard.setStringAsync(content);
    }
    if (menuIndex === 1) {
      await deleteMessage(id);
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
              color,
              ...(role === "user" && { maxWidth: "80%", backgroundColor: primary }),
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
                color,
                ...(role === "user" && { maxWidth: "80%", backgroundColor: primary }),
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

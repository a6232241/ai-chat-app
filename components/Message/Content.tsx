import { MessageType } from "@/utils/Apis/Sqlite/Message/types";
import { useTheme } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { NativeSyntheticEvent, Text } from "react-native";
import ContextMenu, { ContextMenuOnPressNativeEvent } from "react-native-context-menu-view";

type Props = {
  data: Pick<MessageType, "role" | "content" | "id" | "status">;
  onDeleteMessage: (id: string) => Promise<void>;
};

const actions = [{ title: "複製" }, { title: "刪除" }];

const Content: React.FC<Props> = ({ data: { role, content, status, id }, onDeleteMessage }) => {
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
      await onDeleteMessage(id);
    }
  };

  return (
    <>
      <ContextMenu actions={actions} onPress={handlePress}>
        <Text
          style={{
            padding: 10,
            borderRadius: 5,
            color,
            ...((role === "user" || role === "system") && { backgroundColor: primary }),
          }}>
          {content}
        </Text>
      </ContextMenu>
    </>
  );
};

export default Content;

import * as Clipboard from "expo-clipboard";
import React, { ComponentProps } from "react";
import { NativeSyntheticEvent, Platform } from "react-native";
import ContextMenu, { ContextMenuOnPressNativeEvent } from "react-native-context-menu-view";
import Content from "./Content";

type Props = ComponentProps<typeof Content> & {
  onDeleteMessage: (id: string) => Promise<void>;
};

const actions = [{ title: "複製" }, { title: "刪除" }];

const Message: React.FC<Props> = ({ onDeleteMessage, ...props }) => {
  const handlePress = async (e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
    // 立即提取事件數據以避免合成事件被回收
    const menuIndex = e.nativeEvent.index;

    if (menuIndex === 0) {
      await Clipboard.setStringAsync(props.data.content);
    }
    if (menuIndex === 1) {
      await onDeleteMessage(props.data.id);
    }
  };

  return (
    <>
      {Platform.OS === "ios" && parseInt(Platform.Version, 10) <= 12 ? (
        <Content {...props} />
      ) : (
        <ContextMenu actions={actions} onPress={handlePress}>
          <Content {...props} />
        </ContextMenu>
      )}
    </>
  );
};

export default Message;

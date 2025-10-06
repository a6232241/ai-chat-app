import Refresh from "@/assets/icons/refresh.svg";
import { useTheme } from "@react-navigation/native";
import React, { ComponentProps } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import Content from "./Content";
import ContentWeb from "./Content.web";

type Props = ComponentProps<typeof Content> & {
  onResendMessage?: (id: string) => Promise<void>;
};

const Message: React.FC<Props> = ({ onResendMessage, ...props }) => {
  const { role, status, id } = props.data;
  const {
    colors: { text: color },
  } = useTheme();

  return (
    <>
      {Platform.OS === "ios" && parseInt(Platform.Version, 10) <= 12 ? (
        <ContentWeb {...props} />
      ) : (
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
            <Content {...props} />
          </View>
        </View>
      )}
    </>
  );
};

export default Message;

import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onPress: () => void;
};

const ChatInput: React.FC<Props> = ({ value, onChangeText, onPress }) => {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingVertical: 5,
          paddingHorizontal: 10,
          maxHeight: 100,
        }}>
        <TextInput
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
          }}
          value={value}
          onChangeText={onChangeText}
          multiline
        />
        <Pressable
          onPress={onPress}
          style={{
            padding: 10,
            borderRadius: 5,
            backgroundColor: "#007AFF",
          }}>
          <Text style={{ color: "#fff" }}>Send</Text>
        </Pressable>
      </View>
    </>
  );
};

export default ChatInput;

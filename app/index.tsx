import { MessageType, postMessageToChat } from "@/apis";
import Message from "@/components/Message";
import { useRootScreenContext } from "@/hooks/useRootScreenContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHeaderHeight } from "@react-navigation/elements";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type MessageWithTimestamp = MessageType & { created: number };

const convId = `conv_${Date.now()}`;

export default function Index() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageWithTimestamp[]>([]);
  const [loading, setLoading] = useState(false);
  const headerHeight = useHeaderHeight();
  const params = useLocalSearchParams<{ id: string }>();
  const { setSelectedConversationId, setConversations } = useRootScreenContext();

  const send = async () => {
    if (!message.trim()) return;

    if (!params?.id) router.setParams({ id: convId });

    try {
      let userMessage: MessageWithTimestamp = { role: "user", content: message.trim(), created: Date.now() };
      setMessage("");
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      const response = await postMessageToChat({ role: userMessage.role, content: userMessage.content });
      setLoading(false);
      let aiMessage: MessageWithTimestamp = { ...response.choices[0].message, created: response.created };
      setMessages((prev) => [...prev, aiMessage]);

      updateStorageAndRouterPoint([...messages, userMessage, aiMessage]);
    } catch (error) {
      console.log("Error:", error);
      setLoading(false);
    }
  };

  const updateStorageAndRouterPoint = async (_message: MessageWithTimestamp[]) => {
    const id = params?.id ?? convId;
    if (!id) return;

    const hasMessages = await AsyncStorage.getItem(id);
    if (!hasMessages) {
      const conversationsStore = await AsyncStorage.getItem("conversations");
      if (conversationsStore) {
        await AsyncStorage.setItem(
          "conversations",
          JSON.stringify([...JSON.parse(conversationsStore), { id, title: message.trim() }]),
        );
      } else {
        await AsyncStorage.setItem("conversations", JSON.stringify([{ id, title: message.trim() }]));
      }
      setConversations((prev) => [...prev, { id, title: message.trim() }]);
      setSelectedConversationId(id);
    }

    await AsyncStorage.setItem(id, JSON.stringify(_message));
  };

  useEffect(() => {
    (async () => {
      if (!params?.id) setMessages([]);
      else {
        const storedMessages = await AsyncStorage.getItem(params?.id);
        if (storedMessages) setMessages(JSON.parse(storedMessages));
      }
    })();
  }, [params?.id]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
      edges={["bottom", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={headerHeight}>
        <FlatList
          data={messages}
          renderItem={({ item }) => <Message data={item} />}
          keyExtractor={(item) => item.created.toString()}
          contentContainerStyle={{ gap: 10, padding: 10 }}
          ListFooterComponent={<>{loading && <Text>AI thinking...</Text>}</>}
        />
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
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <Pressable
            onPress={send}
            style={{
              padding: 10,
              borderRadius: 5,
              backgroundColor: "#007AFF",
            }}>
            <Text style={{ color: "#fff" }}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

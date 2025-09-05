import { postMessageToChat } from "@/apis";
import ChatInput from "@/components/ChatInput";
import Message from "@/components/Message";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useRootScreenContext } from "@/hooks/useRootScreenContext";
import { MessageWithTimestampType } from "@/type/conversation";
import { apis } from "@/utils/sqlite/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHeaderHeight } from "@react-navigation/elements";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, NativeScrollEvent, NativeSyntheticEvent, Platform, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const convId = `conv_${Date.now()}`;

export default function Index() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageWithTimestampType[]>([]);
  const [loading, setLoading] = useState(false);
  const headerHeight = useHeaderHeight();
  const params = useLocalSearchParams<{ id: string }>();
  const { setSelectedConversationId, setConversations } = useRootScreenContext();
  const listRef = useRef<FlatList<MessageWithTimestampType>>(null);
  const [isShowScrollToTopButton, setIsShowScrollToTopButton] = useState(false);

  const send = async () => {
    if (!message.trim()) return;

    if (!params?.id) router.setParams({ id: convId });

    try {
      let userMessage: MessageWithTimestampType = { role: "user", content: message.trim(), created: Date.now() };
      setMessage("");
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      const response = await postMessageToChat({ role: userMessage.role, content: userMessage.content });
      setLoading(false);
      let aiMessage: MessageWithTimestampType = { ...response.choices[0].message, created: response.created };
      setMessages((prev) => [...prev, aiMessage]);

      updateStorageAndRouterPoint([...messages, userMessage, aiMessage]);
    } catch (error) {
      console.log("Error:", error);
      setLoading(false);
    }
  };

  const updateStorageAndRouterPoint = async (_message: MessageWithTimestampType[]) => {
    const id = params?.id ?? convId;
    if (!id) return;

    await apis.putConversation({ id, title: message.trim() });
    const conversations = await apis.getConversations();
    setConversations(conversations);

    setSelectedConversationId(id);
    await AsyncStorage.setItem(id, JSON.stringify(_message));
  };

  const scrollToTop = () => listRef.current?.scrollToOffset({ animated: true, offset: 0 });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (listRef.current) {
      setIsShowScrollToTopButton(event?.nativeEvent.contentOffset.y > 300);
    }
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

  useEffect(() => {
    scrollToTop();
  }, [messages]);

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
          data={[...messages].reverse()}
          renderItem={({ item }) => <Message data={item} />}
          keyExtractor={(item) => item.created.toString()}
          contentContainerStyle={{ gap: 10, padding: 10 }}
          ListHeaderComponent={<>{loading && <Text>AI thinking...</Text>}</>}
          ref={listRef}
          inverted
          onScroll={handleScroll}
        />
        <ChatInput value={message} onChangeText={setMessage} onPress={send} />

        {isShowScrollToTopButton && <ScrollToTopButton onPress={scrollToTop} />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

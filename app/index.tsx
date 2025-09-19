import ChatInput from "@/components/ChatInput";
import Message from "@/components/Message";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useRootScreenContext } from "@/hooks/useRootScreenContext";
import type { AppIndexParams } from "@/type/routeParams";
import Apis from "@/utils/Apis";
import { GetMessageResponse } from "@/utils/Apis/Sqlite/Message/types";
import { useHeaderHeight } from "@react-navigation/elements";
import { useTheme } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, NativeScrollEvent, NativeSyntheticEvent, Platform, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<GetMessageResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const headerHeight = useHeaderHeight();
  const params = useLocalSearchParams<AppIndexParams>();
  const { setSelectedConversationId, setConversations } = useRootScreenContext();
  const listRef = useRef<FlatList<GetMessageResponse>>(null);
  const [isShowScrollToTopButton, setIsShowScrollToTopButton] = useState(false);
  const {
    colors: { background: backgroundColor, text: color },
  } = useTheme();

  const send = async () => {
    if (!message.trim()) return;

    try {
      let userMessage: GetMessageResponse = {
        id: Date.now().toString(),
        role: "user",
        content: message.trim(),
        created: Date.now(),
        isDeleted: 0,
      };
      setMessage("");
      setMessages((prev) => [userMessage, ...prev]);
      setLoading(true);

      const response = await Apis.githubModel.postMessageToChat({
        role: userMessage.role,
        content: userMessage.content,
      });
      setLoading(false);
      let aiMessage: GetMessageResponse = {
        ...response.choices[0].message,
        created: Date.now(),
        id: response.id,
        isDeleted: 0,
      };
      setMessages((prev) => [aiMessage, ...prev]);

      if (params?.id) {
        const title = params?.title ?? message?.trim();
        setConversations((prev) => [{ id: params.id, title }, ...prev.filter((conv) => conv.id !== params.id)]);
        setSelectedConversationId(params.id);
        router.setParams({ id: params.id, title });

        await Apis.sqlite.conversation.putConversation({ id: params.id, title });
        await Apis.sqlite.message.postMessages([
          { ...userMessage, conversationId: params.id },
          { ...aiMessage, conversationId: params.id },
        ]);
      }
    } catch (error) {
      console.log("Error:", error);
      setLoading(false);
    }
  };

  const scrollToTop = () => listRef.current?.scrollToOffset({ animated: true, offset: 0 });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (listRef.current) {
      setIsShowScrollToTopButton(event?.nativeEvent.contentOffset.y > 300);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      await Apis.sqlite.message.deleteMessages(id);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (!params?.id) setMessages([]);
        else {
          const storedMessages = await Apis.sqlite.message.getMessages(params.id);
          if (storedMessages) setMessages(storedMessages);
        }
      } catch (error) {
        console.log("Error fetching messages:", error);
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
        backgroundColor,
      }}
      edges={["bottom", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={headerHeight}>
        <FlatList
          data={messages.filter((msg) => msg.isDeleted === 0)}
          renderItem={({ item }) => <Message data={item} deleteMessage={deleteMessage} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10, padding: 10, flexGrow: 1, justifyContent: "flex-end" }}
          ListHeaderComponent={<>{loading && <Text style={{ color }}>AI thinking...</Text>}</>}
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

import ChatInput from "@/components/ChatInput";
import Message from "@/components/Message";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useRootScreenContext } from "@/hooks/useRootScreenContext";
import type { AppIndexParams } from "@/type/routeParams";
import Apis from "@/utils/Apis";
import { PostMessageToChatBody } from "@/utils/Apis/GitHubModel/types";
import { GetMessageResponse } from "@/utils/Apis/Sqlite/Message/types";
import { useHeaderHeight } from "@react-navigation/elements";
import { useTheme } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, NativeScrollEvent, NativeSyntheticEvent, Platform, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Messages = GetMessageResponse & {
  status?: "error";
};

export default function Index() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);
  const [loading, setLoading] = useState(false);
  const headerHeight = useHeaderHeight();
  const params = useLocalSearchParams<AppIndexParams>();
  const { setSelectedConversationId, setConversations } = useRootScreenContext();
  const listRef = useRef<FlatList<Messages>>(null);
  const [isShowScrollToTopButton, setIsShowScrollToTopButton] = useState(false);
  const {
    colors: { background: backgroundColor, text: color },
  } = useTheme();

  /**
   * Sends a message to the chat.
   * @param _message The message content to send.
   * @param id The ID of the message (optional).
   * @returns A promise that resolves when the message is sent.
   */
  const send = async (_message: string, id?: string) => {
    if (!_message.trim()) return;

    let userMessage: Messages = {
      id: id ?? Date.now().toString(),
      role: messages.length <= 0 ? "system" : "user",
      content: _message.trim(),
      created: Date.now(),
      isDeleted: 0,
    };

    try {
      setMessage("");
      setMessages((prev) => [userMessage, ...prev.filter((msg) => msg.id !== userMessage.id)]);
      setLoading(true);

      let sendMessages: PostMessageToChatBody[] = messages
        .filter((msg) => msg.isDeleted === 0)
        .map((value) => ({
          role: value.role,
          content: value.content,
        }));
      sendMessages.unshift({ role: userMessage.role, content: userMessage.content });
      const response = await Apis.githubModel.postMessageToChat(sendMessages.reverse());

      setLoading(false);
      let aiMessage: GetMessageResponse = {
        ...response.choices[0].message,
        created: Date.now(),
        id: response.id,
        isDeleted: 0,
      };
      setMessages((prev) => [aiMessage, ...prev]);

      if (!params?.id) return;

      const title = params?.title ?? _message?.trim();
      setConversations((prev) => [{ id: params.id, title }, ...prev.filter((conv) => conv.id !== params.id)]);
      setSelectedConversationId(params.id);
      router.setParams({ id: params.id, title });

      await Apis?.sqlite?.conversation.putConversation({ id: params.id, title });
      await Apis?.sqlite?.message.postMessages([
        { ...userMessage, conversationId: params.id },
        { ...aiMessage, conversationId: params.id },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      setMessages((prev) => [{ ...userMessage, status: "error" }, ...prev.filter((msg) => msg.id !== userMessage.id)]);
    }
  };

  const handleScrollToTop = () => listRef.current?.scrollToOffset({ animated: true, offset: 0 });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // 立即提取事件數據以避免合成事件被回收
    const offsetY = event.nativeEvent.contentOffset.y;

    if (listRef.current) {
      setIsShowScrollToTopButton(offsetY > 300);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      await Apis?.sqlite?.message.deleteMessages(id);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleResendMessage = async (id: string) => {
    try {
      const message = messages.find((msg) => msg.id === id);
      if (message) {
        await send(message.content, id);
      }
    } catch (error) {
      console.error("Error resending message:", error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (!params?.id) setMessages([]);
        else {
          const storedMessages = await Apis?.sqlite?.message.getMessages(params.id);
          if (storedMessages) setMessages(storedMessages);
        }
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    })();
  }, [params?.id]);

  useEffect(() => {
    handleScrollToTop();
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
          renderItem={({ item }) => (
            <Message data={item} onDeleteMessage={handleDeleteMessage} onResendMessage={handleResendMessage} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10, padding: 10, flexGrow: 1, justifyContent: "flex-end" }}
          ListHeaderComponent={<>{loading && <Text style={{ color }}>AI thinking...</Text>}</>}
          ref={listRef}
          inverted
          onScroll={handleScroll}
        />
        <ChatInput value={message} onChangeText={setMessage} onSend={() => send(message)} />

        {isShowScrollToTopButton && <ScrollToTopButton onPress={handleScrollToTop} />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

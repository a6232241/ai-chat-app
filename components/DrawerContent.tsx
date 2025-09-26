import Apis from "@/utils/Apis";
import { ConversationType } from "@/utils/Apis/Sqlite/Conversation/types";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useTheme } from "@react-navigation/native";
import { useRef, useState } from "react";
import { TextInput } from "react-native-gesture-handler";

type Props = {
  conversations: ConversationType[];
  setConversations: (conversations: ConversationType[]) => void;
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
} & DrawerContentComponentProps;

const DrawerContent = ({
  conversations,
  setConversations,
  selectedConversationId,
  setSelectedConversationId,
  ...props
}: Props) => {
  const [searchText, setSearchText] = useState("");
  const delaySearch = useRef<number | null>(null);
  const {
    colors: { text: color },
  } = useTheme();

  const handleChangeText = async (text: string) => {
    setSearchText(text);
    delaySearch.current && clearTimeout(delaySearch.current);
    delaySearch.current = setTimeout(async () => {
      const _conversations = (await Apis?.sqlite?.conversation.getConversations(text)) ?? [];
      setConversations(_conversations);
    }, 300);
  };

  const handleRedirectToNewConversation = () => {
    props.navigation.navigate("index", { id: `conv_${Date.now()}` });
    setSelectedConversationId(null);
  };

  const handleRedirectToExistingConversation = (conversation: ConversationType) => {
    props.navigation.navigate("index", { ...conversation });
    setSelectedConversationId(conversation.id);
  };

  return (
    <DrawerContentScrollView {...props}>
      <TextInput
        style={{
          flex: 1,
          marginBottom: 20,
          padding: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          color,
          fontSize: 16,
          lineHeight: 24,
          height: 24 + 20,
        }}
        placeholder="Search"
        onChangeText={handleChangeText}
        value={searchText}
      />
      <DrawerItem
        key={"index"}
        label={"New"}
        onPress={handleRedirectToNewConversation}
        focused={selectedConversationId === null}
      />
      {conversations.map((conversation) => (
        <DrawerItem
          key={conversation.id}
          label={conversation.title}
          onPress={() => handleRedirectToExistingConversation(conversation)}
          focused={selectedConversationId === conversation.id}
        />
      ))}
    </DrawerContentScrollView>
  );
};

export default DrawerContent;

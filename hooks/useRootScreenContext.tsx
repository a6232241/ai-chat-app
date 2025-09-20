import Apis from "@/utils/Apis";
import { ConversationType } from "@/utils/Apis/Sqlite/Conversation/types";
import { createContext, useContext, useEffect, useState } from "react";

type DefaultValue = {
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>;
  setSelectedConversationId: React.Dispatch<React.SetStateAction<string | null>>;
};

const defaultValue: DefaultValue = {
  setConversations: () => {},
  setSelectedConversationId: () => {},
};

const RootScreenContext = createContext<DefaultValue>(defaultValue);

const useRootScreenContext = () => useContext(RootScreenContext);

export { RootScreenContext, useRootScreenContext };

type Props = {
  children: ({
    conversations,
    setConversations,
    selectedConversationId,
    setSelectedConversationId,
  }: {
    conversations: ConversationType[];
    setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>;
    selectedConversationId: string | null;
    setSelectedConversationId: React.Dispatch<React.SetStateAction<string | null>>;
  }) => React.ReactNode;
};

const RootScreenProvider = ({ children }: Props) => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const conversations = (await Apis?.sqlite?.conversation.getConversations()) ?? [];
      setConversations(conversations);
    })();
  }, []);

  return (
    <RootScreenContext.Provider
      value={{
        setConversations,
        setSelectedConversationId,
      }}>
      {children({
        conversations,
        setConversations,
        selectedConversationId,
        setSelectedConversationId,
      })}
    </RootScreenContext.Provider>
  );
};

export default RootScreenProvider;

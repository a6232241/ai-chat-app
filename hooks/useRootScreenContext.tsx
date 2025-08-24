import { createContext, useContext } from "react";

type DefaultValue = {
  setConversations: React.Dispatch<React.SetStateAction<{ id: string; title: string }[]>>;
  setSelectedConversationId: React.Dispatch<React.SetStateAction<string | null>>;
};

const defaultValue: DefaultValue = {
  setConversations: () => {},
  setSelectedConversationId: () => {},
};

const RootScreenContext = createContext<DefaultValue>(defaultValue);

const useRootScreenContext = () => useContext(RootScreenContext);

export { RootScreenContext, useRootScreenContext };

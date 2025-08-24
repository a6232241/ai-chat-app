import { RootScreenContext } from "@/hooks/useRootScreenContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const [conversations, setConversations] = useState<{ id: string; title: string }[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const conversationsStore = await AsyncStorage.getItem("conversations");
      if (conversationsStore) setConversations(JSON.parse(conversationsStore));
    })();
  }, []);

  return (
    <RootScreenContext.Provider
      value={{
        setConversations,
        setSelectedConversationId,
      }}>
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <Drawer
            drawerContent={(props) => (
              <DrawerContentScrollView {...props}>
                <DrawerItem
                  key={"index"}
                  label={"New"}
                  onPress={() => {
                    props.navigation.navigate("index");
                    setSelectedConversationId(null);
                  }}
                  focused={selectedConversationId === null}
                />
                {conversations.map((conversation) => (
                  <DrawerItem
                    key={conversation.id}
                    label={conversation.title}
                    onPress={() => {
                      props.navigation.navigate("index", { id: conversation.id });
                      setSelectedConversationId(conversation.id);
                    }}
                    focused={selectedConversationId === conversation.id}
                  />
                ))}
              </DrawerContentScrollView>
            )}>
            <Drawer.Screen
              name="index"
              options={{
                title: "Chat",
              }}
            />
          </Drawer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </RootScreenContext.Provider>
  );
}

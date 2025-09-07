import RootScreenProvider from "@/hooks/useRootScreenContext";
import Apis from "@/utils/Apis";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Drawer } from "expo-router/drawer";
import * as SQLite from "expo-sqlite";
import { useRef, useState } from "react";
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const db = SQLite.openDatabaseSync("ai-chat-app.db");

export default function RootLayout() {
  useDrizzleStudio(db);

  const [searchText, setSearchText] = useState("");
  const delaySearch = useRef<number | null>(null);

  return (
    <SafeAreaProvider>
      <RootScreenProvider>
        {({ conversations, setConversations, selectedConversationId, setSelectedConversationId }) => (
          <>
            <GestureHandlerRootView>
              <Drawer
                drawerContent={(props) => (
                  <DrawerContentScrollView {...props}>
                    <TextInput
                      style={{
                        flex: 1,
                        marginBottom: 20,
                        padding: 10,
                        borderWidth: 1,
                        borderColor: "#ccc",
                        borderRadius: 5,
                      }}
                      placeholder="Search"
                      onChangeText={async (text: string) => {
                        setSearchText(text);
                        delaySearch.current && clearTimeout(delaySearch.current);
                        delaySearch.current = setTimeout(async () => {
                          const _conversations = await Apis.sqlite.conversation.getConversations(text);
                          setConversations(_conversations);
                        }, 300);
                      }}
                      value={searchText}
                    />
                    <DrawerItem
                      key={"index"}
                      label={"New"}
                      onPress={() => {
                        props.navigation.navigate("index", { id: `conv_${Date.now()}` });
                        setSelectedConversationId(null);
                      }}
                      focused={selectedConversationId === null}
                    />
                    {conversations.map((conversation) => (
                      <DrawerItem
                        key={conversation.id}
                        label={conversation.title}
                        onPress={() => {
                          props.navigation.navigate("index", { ...conversation });
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
                  initialParams={{ id: `conv_${Date.now()}` }}
                />
              </Drawer>
            </GestureHandlerRootView>
          </>
        )}
      </RootScreenProvider>
    </SafeAreaProvider>
  );
}

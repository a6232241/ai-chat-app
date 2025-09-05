import RootScreenProvider from "@/hooks/useRootScreenContext";
import { migrateDbIfNeeded } from "@/utils/sqlite/init";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Drawer } from "expo-router/drawer";
import * as SQLite from "expo-sqlite";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const db = SQLite.openDatabaseSync("ai-chat-app.db");

export default function RootLayout() {
  useDrizzleStudio(db);

  return (
    <SafeAreaProvider>
      <Suspense fallback={<Text>Loading...</Text>}>
        <SQLiteProvider databaseName="ai-chat-app.db" onInit={migrateDbIfNeeded} useSuspense>
          <RootScreenProvider>
            {({ conversations, selectedConversationId, setSelectedConversationId }) => (
              <>
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
                        {[...conversations].reverse().map((conversation) => (
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
              </>
            )}
          </RootScreenProvider>
        </SQLiteProvider>
      </Suspense>
    </SafeAreaProvider>
  );
}

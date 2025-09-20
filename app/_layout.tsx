import DrawerContent from "@/components/DrawerContent";
import RootScreenProvider from "@/hooks/useRootScreenContext";
import Apis from "@/utils/Apis";
import { theme } from "@/utils/theme";
import { ThemeProvider } from "@react-navigation/native";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Drawer } from "expo-router/drawer";
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { Text, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const { light, dark } = theme;
  const [isDbLoading, setIsDbLoading] = useState(true);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    (async () => {
      const dbInitResult = await Apis.init();
      if (!dbInitResult.success) {
        console.error("Failed to initialize the database.");
        return;
      }
      setIsDbLoading(false);

      const db = await SQLite.openDatabaseAsync("ai-chat-app.db");
      setDb(db);
    })();
  }, []);

  useDrizzleStudio(db);

  return (
    <ThemeProvider value={colorScheme === "dark" ? dark : light}>
      <SafeAreaProvider>
        {isDbLoading && (
          <SafeAreaView>
            <Text>Loading...</Text>
          </SafeAreaView>
        )}
        {!isDbLoading && (
          <RootScreenProvider>
            {({ conversations, setConversations, selectedConversationId, setSelectedConversationId }) => (
              <>
                <GestureHandlerRootView>
                  <Drawer
                    drawerContent={(props) => (
                      <DrawerContent
                        {...props}
                        conversations={conversations}
                        setConversations={setConversations}
                        selectedConversationId={selectedConversationId}
                        setSelectedConversationId={setSelectedConversationId}
                      />
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
        )}
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

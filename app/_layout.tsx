import DrawerContent from "@/components/DrawerContent";
import RootScreenProvider from "@/hooks/useRootScreenContext";
import { theme } from "@/utils/theme";
import { ThemeProvider } from "@react-navigation/native";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Drawer } from "expo-router/drawer";
import * as SQLite from "expo-sqlite";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const db = SQLite.openDatabaseSync("ai-chat-app.db");

export default function RootLayout() {
  useDrizzleStudio(db);

  const colorScheme = useColorScheme() ?? "light";
  const { light, dark } = theme;

  return (
    <ThemeProvider value={colorScheme === "dark" ? dark : light}>
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

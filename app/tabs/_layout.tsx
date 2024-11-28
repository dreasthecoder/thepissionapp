import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, View } from "react-native";
import theme from "@/assets/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.lightColors.primary,
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          backgroundColor: theme.lightColors.background,
          borderTopWidth: 1,
          borderColor: '#e0e0e0',
          height: 40 + insets.bottom,
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome size={size} color={color} name="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome size={size} color={color} name="plus" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome size={size} color={color} name="user" />
          ),
        }}
      />
    </Tabs>
  );
}

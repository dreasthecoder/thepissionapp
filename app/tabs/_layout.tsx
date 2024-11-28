import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, View } from "react-native";
import theme from "@/assets/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.pissionYellow,
        tabBarInactiveTintColor: "#ccc",
        tabBarStyle: {
          backgroundColor: theme.colors.black,
          borderTopWidth: 1,
          borderColor: theme.colors.pissionYellow,
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

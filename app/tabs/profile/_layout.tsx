import { Stack } from "expo-router";
import { View, Text } from "react-native";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="city" />
      <Stack.Screen name="review" />
    </Stack>
  );
}

import { Stack } from 'expo-router';

export default function AddLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          headerShown: true,
          title: 'Restroom Details',
          headerBackTitle: 'Back',
          headerTitleStyle: {
            fontSize: 20,
          },
        }}
      />
    </Stack>
  );
}

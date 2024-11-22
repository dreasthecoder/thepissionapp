import { Redirect } from "expo-router";

export default function Index() {
  // Redirect the user to the default tab or screen (e.g., Home tab)
  return <Redirect href="/tabs/home" />;
}

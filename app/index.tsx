import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { isOnboardingComplete } from "../app/utils/device";
import theme from "@/assets/theme";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    checkOnboarding();
  }, []);

  async function checkOnboarding() {
    try {
      const completed = await isOnboardingComplete();
      setHasOnboarded(completed);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.lightColors.primary} />
      </View>
    );
  }

  // Redirect to onboarding if not completed, otherwise go to home
  return <Redirect href={hasOnboarded ? "/tabs/home" : "/onboarding"} />;
}

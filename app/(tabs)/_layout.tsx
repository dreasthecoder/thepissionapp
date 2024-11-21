import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "./index"; // Use Profile Page for all tabs
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const Layout = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Add") {
            iconName = "add-circle-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF", // Active icon color
        tabBarInactiveTintColor: "gray", // Inactive icon color
        tabBarStyle: {
          backgroundColor: "#f8f8f8", // Background color of the tab bar
          borderTopWidth: 1,
          borderTopColor: "#ddd", // Border color on top of the tab bar
        },
        headerShown: false, // Hides the header for all tabs
      })}
    >
      {/* Home Tab redirects to Profile */}
      <Tab.Screen name="Home" component={ProfileScreen} />
      {/* Add Tab redirects to Profile */}
      <Tab.Screen name="Add" component={ProfileScreen} />
      {/* Profile Tab */}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default Layout;






import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";

export default function Add() {
  const [activeTab, setActiveTab] = useState("saved");

  const savedRestrooms = ["In San Francisco", "In Palo Alto", "At Stanford"];
  const addedRestrooms = [
    "Restroom 1 Added",
    "Restroom 2 Added",
    "Restroom 3 Added",
  ];
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ textAlign: "center", fontSize: 24 }}>
        Under Construction!
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  backButton: {
    fontSize: 18,
    color: "black",
  },
  logoutButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 12,
    color: "#333",
  },
  profileSection: {
    alignItems: "center",
    marginTop: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  location: {
    fontSize: 14,
    color: "gray",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 5,
    marginTop: 20,
  },
  toggleButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 15,
  },
  activeToggle: {
    backgroundColor: "#007AFF",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  activeToggleText: {
    color: "#FFF",
  },
  listItem: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#f8f8f8",
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  listItemText: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 18,
    color: "gray",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "gray",
  },
});

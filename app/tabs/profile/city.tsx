import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";

export default function City() {
  const router = useRouter();
  const restrooms = [
    { id: "1", name: "Salesforce Floor 1", rating: 4 },
    { id: "2", name: "Castro Theatre Entrance", rating: 3 },
    { id: "3", name: "H&M Floor 2", rating: 5 },
  ];

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(null)
      .map((_, i) => (
        <Text key={i} style={styles.star}>
          {i < rating ? "⭐" : "☆"}
        </Text>
      ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={require("../../../assets/images/james.jpg")}
          style={styles.profileImage}
        />
        <Text style={styles.name}>James Landay</Text>
        <Text style={styles.location}>Stanford, CA</Text>
      </View>

      {/* Toggle Section */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity style={[styles.toggleButton, styles.activeToggle]}>
          <Text style={[styles.toggleText, styles.activeToggleText]}>
            Restrooms Saved
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toggleButton}>
          <Text style={styles.toggleText}>Restrooms Added</Text>
        </TouchableOpacity>
      </View>

      {/* San Francisco Title */}
      <Text style={styles.cityTitle}>
        San Francisco <Text style={styles.cityIcon}>📍</Text>
      </Text>

      {/* Restroom List */}
      <FlatList
        data={restrooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              if (item.name === "Salesforce Floor 1") {
                router.push("/tabs/profile/restroom");
              }
            }}
          >
            <View style={styles.listItemContent}>
              <Text style={styles.listItemText}>{item.name}</Text>
              <View style={styles.rating}>{renderStars(item.rating)}</View>
            </View>
            <Text style={styles.arrow}>{">"}</Text>
          </TouchableOpacity>
        )}
      />
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
  cityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#007AFF",
  },
  cityIcon: {
    fontSize: 16,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  listItemContent: {
    flexDirection: "column",
  },
  listItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  rating: {
    flexDirection: "row",
    marginTop: 5,
  },
  star: {
    fontSize: 16,
    color: "gold",
  },
  arrow: {
    fontSize: 18,
    color: "gray",
  },
  bottomTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f2f2f2",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  icon: {
    fontSize: 20,
    color: "gray",
  },
  activeIcon: {
    color: "#007AFF",
  },
});

import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";

const ProfileScreen = () => {
  // State for toggle buttons
  const [activeTab, setActiveTab] = useState("saved");

  // Sample data for locations
  const savedRestrooms = ["In San Francisco", "In Palo Alto", "At Stanford"];
  const addedRestrooms = ["Restroom 1 Added", "Restroom 2 Added", "Restroom 3 Added"];

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
<View style={styles.profileSection}>
  <Image
    source={require("../../assets/images/james.jpg")} // Updated to load the local image
    style={styles.profileImage}
  />
  <Text style={styles.name}>James Landay</Text>
  <Text style={styles.location}>Stanford, CA</Text>
</View>


      {/* Toggle Section */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === "saved" && styles.activeToggle,
          ]}
          onPress={() => setActiveTab("saved")}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === "saved" && styles.activeToggleText,
            ]}
          >
            Restrooms Saved
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === "added" && styles.activeToggle,
          ]}
          onPress={() => setActiveTab("added")}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === "added" && styles.activeToggleText,
            ]}
          >
            Restrooms Added
          </Text>
        </TouchableOpacity>
      </View>

      {/* List Section */}
      <FlatList
        data={activeTab === "saved" ? savedRestrooms : addedRestrooms}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listItemText}>{item}</Text>
            <Text style={styles.arrow}>{">"}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Bottom Tab */}
      <View style={styles.bottomTab}>
        <TouchableOpacity>
          <Text style={[styles.icon, styles.activeIcon]}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.icon}>➕</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.icon}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    backgroundColor: "#F5F5F5", // Light gray background for the toggle container
    borderRadius: 20, // Rounded container
    marginHorizontal: 20, // Add horizontal margin to fit the screen better
    padding: 5, // Padding to separate the buttons
    marginTop: 20,
  },
  toggleButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 15, // Rounded buttons
  },
  activeToggle: {
    backgroundColor: "#007AFF", // Blue background for active toggle
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000", // Black text for inactive toggle
  },
  activeToggleText: {
    color: "#FFF", // White text for active toggle
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
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // Shadow for Android
    elevation: 3,
  },  
  listItemText: {
    fontSize: 16,
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

export default ProfileScreen;


        
        


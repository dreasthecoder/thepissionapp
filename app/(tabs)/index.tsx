import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const ProfileScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>James Landay</Text>
        <Text style={styles.location}>Stanford, CA</Text>
      </View>

      <View style={styles.restroomList}>
        <TouchableOpacity onPress={() => navigation.navigate("RestroomList")}>
          <Text style={styles.restroomButton}>In San Francisco</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("RestroomList")}>
          <Text style={styles.restroomButton}>In Palo Alto</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("RestroomList")}>
          <Text style={styles.restroomButton}>At Stanford</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Background color
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  location: {
    fontSize: 16,
    color: "#666",
  },
  restroomList: {
    marginTop: 10,
  },
  restroomButton: {
    fontSize: 18,
    color: "#007BFF",
    paddingVertical: 10,
  },
});

export default ProfileScreen;

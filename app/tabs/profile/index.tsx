import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

import { supabase } from "@/db";
import theme from "@/assets/theme";

interface Restroom {
  id: string;
  name: string;
  created_at: string;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState("saved");
  const [restrooms, setRestrooms] = useState<Restroom[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchRestrooms();
  }, []);

  const fetchRestrooms = async () => {
    try {
      const { data, error } = await supabase
        .from('restrooms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRestrooms(data || []);
    } catch (error) {
      console.error('Error fetching restrooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRestroom = ({ item }: { item: Restroom }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => router.push(`/tabs/profile/restroom?id=${item.id}`)}
    >
      <Text style={styles.listItemText}>{item.name}</Text>
      <Text style={styles.arrow}>{">"}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
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
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.lightColors.primary} />
        </View>
      ) : (
        <FlatList
          data={restrooms}
          keyExtractor={(item) => item.id}
          renderItem={renderRestroom}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No restrooms found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 8,
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: theme.lightColors.primary,
    fontSize: 16,
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: "gray",
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  toggleText: {
    fontSize: 16,
    color: "gray",
  },
  activeToggle: {
    borderBottomWidth: 2,
    borderBottomColor: theme.lightColors.primary,
  },
  activeToggleText: {
    color: theme.lightColors.primary,
    fontWeight: "bold",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  listItemText: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 16,
    color: "gray",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
});

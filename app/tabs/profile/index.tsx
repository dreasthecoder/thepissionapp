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
import * as Location from 'expo-location';
import { supabase } from "@/db";
import theme from "@/assets/theme";
import { getDeviceId, type DeviceProfile } from "@/app/utils/device";

interface Restroom {
  id: string;
  name: string;
  created_at: string;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState("saved");
  const [restrooms, setRestrooms] = useState<Restroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<DeviceProfile | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
    fetchLocation();
  }, []);

  useEffect(() => {
    fetchRestrooms();
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      const deviceId = await getDeviceId();
      const { data, error } = await supabase
        .from('device_profiles')
        .select('*')
        .eq('id', deviceId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const getFormattedLocation = (city: string | null, state: string | null) => {
    if (city && state) {
      return `${city}, ${state}`;
    }
    return 'Location not available';
  };

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address) {
        setLocation(getFormattedLocation(address.city, address.region));
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const fetchRestrooms = async () => {
    try {
      setLoading(true);
      const deviceId = await getDeviceId();
      
      let query;
      if (activeTab === "added") {
        query = supabase
          .from('restrooms')
          .select('*')
          .eq('creator_device_id', deviceId)
          .order('created_at', { ascending: false });
      } else if (activeTab === "saved") {
        query = supabase
          .from('saved_restrooms')
          .select(`
            restroom:restroom_id (*)
          `)
          .eq('device_id', deviceId)
          .order('created_at', { ascending: false });
      }

      const { data, error } = await query as { data: any, error: any };
      if (error) throw error;
      
      // Transform the data if it's from saved restrooms query
      const transformedData = activeTab === "saved" 
        ? data.map((item: any) => item.restroom)
        : data;
      
      setRestrooms(transformedData || []);
    } catch (error) {
      console.error('Error fetching restrooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRestroom = ({ item }: { item: Restroom }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => router.push(`/${item.id}?source=profile`)}
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
        {profile?.profile_image ? (
          <Image
            source={{ uri: profile.profile_image }}
            style={styles.profileImage}
          />
        ) : (
          <View style={[styles.profileImage, styles.profileImagePlaceholder]} />
        )}
        <Text style={styles.name}>{profile?.name || 'Loading...'}</Text>
        <Text style={styles.location}>{location || 'Location not available'}</Text>
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
        <ActivityIndicator style={styles.loader} color={theme.lightColors.primary} />
      ) : (
        <FlatList
          data={restrooms}
          renderItem={renderRestroom}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.lightColors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
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
    paddingVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  profileImagePlaceholder: {
    backgroundColor: theme.lightColors.accent,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
    color: theme.lightColors.text,
  },
  location: {
    fontSize: 16,
    color: theme.lightColors.text,
    opacity: 0.6,
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  toggleText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  activeToggle: {
    borderBottomWidth: 2,
    borderBottomColor: theme.lightColors.primary,
  },
  activeToggleText: {
    color: theme.lightColors.primary,
    fontWeight: "600",
  },
  list: {
    flex: 1,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: `${theme.lightColors.accent}20`,
  },
  listItemText: {
    fontSize: 16,
    color: theme.lightColors.text,
  },
  arrow: {
    fontSize: 16,
    color: theme.lightColors.text,
    opacity: 0.6,
  },
  loader: {
    flex: 1,
  },
});

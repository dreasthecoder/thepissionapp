import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Platform,
  Linking
} from "react-native";
import { supabase } from "@/db";
import theme from "@/assets/theme";
import timeAgo from "@/utils/timeAgo";
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome } from "@expo/vector-icons";
import { getDeviceId } from "@/app/utils/device";

interface Review {
  id: string;
  user_id: string;
  restroom_id: string;
  rating: number;
  text: string;
  created_at: string;
  device_name: string;
}

interface Restroom {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  is_gendered: boolean; // not in supabase
  is_accessible: boolean;
  is_public: boolean;
  bathroom_code?: string;
  created_at: string;
}

interface SavedStatus {
  isSaved: boolean;
  id?: string;
}

export default function RestroomPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [restroom, setRestroom] = useState<Restroom | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState<string>('');
  const [averageRating, setAverageRating] = useState(0);
  const [savedStatus, setSavedStatus] = useState<SavedStatus>({ isSaved: false });

  useEffect(() => {
    fetchRestroomDetails();
    fetchReviews();
    checkIfSaved();
  }, [id]);

  useEffect(() => {
    if (restroom) {
      calculateDistance();
    }
  }, [restroom]);

  const fetchRestroomDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("restrooms")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setRestroom(data);
    } catch (error) {
      console.error("Error fetching restroom:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("restroom_id", id);

      if (error) throw error;
      setReviews(data || []);
      
      // Calculate average rating
      if (data && data.length > 0) {
        const avg = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  const calculateDistance = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setDistance('Location access denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      if (restroom && restroom.latitude && restroom.longitude) {
        const dist = getDistanceFromLatLonInMiles(
          location.coords.latitude,
          location.coords.longitude,
          restroom.latitude,
          restroom.longitude
        );
        setDistance(`${dist.toFixed(1)} miles away`);
      } else {
        setDistance('Distance unavailable');
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setDistance('Unable to calculate distance');
    }
  };

  const getDistanceFromLatLonInMiles = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 0.621371; // Convert to miles
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const formatTimeAgo = (time: string) => {
    return timeAgo(time);
  };

  const openDirections = async () => {
    if (!restroom?.latitude || !restroom?.longitude) return;

    const label = encodeURIComponent(restroom.name);
    const latLng = `${restroom.latitude},${restroom.longitude}`;

    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL(`maps://maps.apple.com/?q=${label}&ll=${latLng}`);
      } else {
        await Linking.openURL(`geo:0,0?q=${latLng}(${label})`);
      }
    } catch (error) {
      // Silently try fallback to Google Maps
      try {
        await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latLng}`);
      } catch (fallbackError) {
        // Maps might still be opening despite the error
        console.log('Maps navigation attempted');
      }
    }
  };

  const checkIfSaved = async () => {
    try {
      if (!id) return;
      const deviceId = await getDeviceId();
      const { data, error } = await supabase
        .from('saved_restrooms')
        .select('id')
        .eq('device_id', deviceId)
        .eq('restroom_id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setSavedStatus({ isSaved: !!data, id: data?.id });
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const toggleSave = async () => {
    try {
      if (!id) return;
      const deviceId = await getDeviceId();
      
      if (savedStatus.isSaved) {
        // Unsave
        const { error } = await supabase
          .from('saved_restrooms')
          .delete()
          .eq('id', savedStatus.id);
        
        if (error) throw error;
        setSavedStatus({ isSaved: false });
      } else {
        // Save
        const { error } = await supabase
          .from('saved_restrooms')
          .insert([
            {
              device_id: deviceId,
              restroom_id: id,
            },
          ]);
        
        if (error) throw error;
        checkIfSaved();
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  if (loading || !restroom) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#666" />
          </Pressable>
          <Text style={styles.title}>{restroom?.name}</Text>
          <Pressable 
            style={styles.saveButton}
            onPress={toggleSave}
          >
            <FontAwesome 
              name={savedStatus.isSaved ? "bookmark" : "bookmark-o"} 
              size={25} 
              color={savedStatus.isSaved ? "#007BFF" : "#666"}
            />
          </Pressable>
        </View>
        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={20} color="#FFD700" />
          <Text style={styles.rating}>{averageRating ? averageRating.toFixed(1) : 'No ratings'}</Text>
          <Text style={styles.reviewCount}>({reviews.length} reviews)</Text>
        </View>
      </View>

      {restroom?.latitude && restroom?.longitude && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: restroom.latitude,
              longitude: restroom.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            toolbarEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: restroom.latitude,
                longitude: restroom.longitude,
              }}
              title={restroom.name}
            />
          </MapView>
          <Pressable 
            style={styles.directionsButton}
            onPress={openDirections}
          >
            <FontAwesome name="location-arrow" size={20} color="#fff" />
          </Pressable>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoText} numberOfLines={1}>
          {distance?.replace('miles away', 'mi')} • {' '}
          {restroom?.is_gendered ? 'Gendered' : 'Gender Neutral'} • {' '}
          {restroom?.is_accessible ? 'Accessible' : 'Not Accessible'} • {' '}
          {restroom?.is_public ? 'Public' : 'Private'}
          {restroom?.bathroom_code ? ` • Code: ${restroom.bathroom_code}` : ''}
        </Text>
      </View>

      <View style={styles.reviewsContainer}>
        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <Pressable 
            style={styles.addReviewButton} 
            onPress={() => router.push(`/tabs/profile/review?id=${id}`)}
          >
            <Text style={styles.addReviewButtonText}>Leave a Review</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.reviewsList}>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.starsAndName}>
                  <View style={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesome
                        key={i}
                        name="star"
                        size={16}
                        color={i < review.rating ? "#FFD700" : "#DDD"}
                      />
                    ))}
                  </View>
                  <Text style={styles.reviewerName}>{review.device_name}</Text>
                </View>
                <Text style={styles.reviewDate}>{formatTimeAgo(review.created_at)}</Text>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: '#fff',
    marginBottom: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    padding: 4,
    width: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 8,
  },
  saveButton: {
    padding: 4,
    width: 28,
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  mapContainer: {
    height: 180,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  directionsButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.lightColors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  reviewsContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reviewsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addReviewButton: {
    backgroundColor: theme.lightColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addReviewButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  starsAndName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    width: 80, 
    flexDirection: 'row',
  },
  reviewDate: {
    color: '#666',
    fontSize: 14,
  },
  reviewText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

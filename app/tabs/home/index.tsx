import 'react-native-get-random-values';
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { supabase } from '@/db';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Type definition for restroom data from Supabase
 * Matches the database schema exactly
 */
type Restroom = {
  id: string;           // uuid primary key
  name: string;         // restroom name/location
  latitude: number;     // geographical coordinates
  longitude: number;    // geographical coordinates
  rating: number;       // average rating (0-5)
  review_count: number; // number of reviews
  is_accessible: boolean; // handicap accessible
  is_public: boolean;    // public vs private
  created_at: string;    // timestamp of creation
  bathroom_code?: string; // optional access code
};

/**
 * Home Screen Component
 * Displays a map centered on user's location with nearby restroom markers
 * Uses default map provider for Expo Go compatibility
 */
export default function Home() {
  // State Management
  const [restrooms, setRestrooms] = useState<Restroom[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const searchBarRef = useRef<any>(null);
  const insets = useSafeAreaInsets();

  // Default map region (Stanford - fallback if location permission denied)
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.4275,
    longitude: -122.1697,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  /**
   * Centers the map on user's current location
   */
  const centerOnLocation = async () => {
    if (location?.coords) {
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
      searchBarRef.current?.clear();
      searchBarRef.current?.blur();
    }
  };

  /**
   * Get user's current location and update map center
   * Requests permission if not already granted
   */
  useEffect(() => {
    (async () => {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Permission Denied', 'Please enable location services to find restrooms near you.');
        return;
      }

      try {
        // Get current location
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        
        // Update map center to current location
        setInitialRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Could not get your current location.');
      }
    })();
  }, []);

  /**
   * Fetch restroom data from Supabase
   * Called once when component mounts
   */
  useEffect(() => {
    async function fetchRestrooms() {
      try {
        const { data, error } = await supabase
          .from('restrooms')
          .select('*');
        
        if (error) {
          console.error('Error fetching restrooms:', error);
          return;
        }

        if (data) {
          setRestrooms(data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchRestrooms();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <GooglePlacesAutocomplete
            ref={searchBarRef}
            placeholder='Search location...'
            onPress={(data, details = null) => {
              if (details?.geometry?.location) {
                mapRef.current?.animateToRegion({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }, 1000);
              }
            }}
            textInputProps={{
              leftIcon: { type: 'ionicon', name: 'search-outline' }
            }}
            styles={{
              container: [
                styles.searchBarContainer,
                {
                  top: insets.top + 10,
                  position: 'relative',
                  maxHeight: '80%',
                },
              ],
              textInput: [
                styles.searchBarInput,
                {
                  opacity: 1,
                  fontWeight: '500',
                  paddingLeft: 35,
                  color: '#000000',
                }
              ],
              listView: [
                styles.searchResults,
                {
                  maxHeight: 200,
                  position: 'relative',
                }
              ],
              row: [
                styles.searchRow,
                {
                  minHeight: 50,
                }
              ],
              description: { fontWeight: 'bold' },
            }}
            query={{
              key: 'AIzaSyAjXqODrQRYw-6zr-7AfS48n8EtJEzzIJI',
              language: 'en',
            }}
            fetchDetails={true}
            enablePoweredByContainer={false}
            renderLeftButton={() => (
              <View style={{
                position: 'absolute',
                left: 10,
                top: 12,
                zIndex: 1,
              }}>
                <Ionicons name="search-outline" size={20} color="#333333" />
              </View>
            )}
          />
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={true}
          >
            {restrooms.map((restroom) => (
              <Marker
                key={restroom.id}
                coordinate={{
                  latitude: restroom.latitude,
                  longitude: restroom.longitude,
                }}
                title={restroom.name}
                description={`Rating: ${restroom.rating}/5 • ${restroom.is_public ? 'Public' : 'Private'}`}
              />
            ))}
          </MapView>
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={centerOnLocation}
          >
            <Ionicons name="locate" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

/**
 * Component Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locationButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchBarContainer: {
    position: 'absolute',
    width: '90%',
    alignSelf: 'center',
    zIndex: 1,
  },
  searchBarInput: {
    height: 48,
    color: '#000000',
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchResults: {
    backgroundColor: '#fff',
    marginTop: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchRow: {
    padding: 13,
    height: 44,
    flexDirection: 'row',
  },
});

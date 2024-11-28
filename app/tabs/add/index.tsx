import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text
} from "react-native";
import MapView, { Marker, MapPressEvent, Region } from 'react-native-maps';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LocationCoordinate {
  latitude: number;
  longitude: number;
}

export default function Add() {
  const mapRef = useRef<MapView | null>(null);
  const searchBarRef = useRef<GooglePlacesAutocompleteRef | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinate | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Region | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to add a restroom.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handleMapPress = (e: MapPressEvent) => {
    setSelectedLocation(e.nativeEvent.coordinate);
  };

  const handleDone = () => {
    if (!selectedLocation) {
      Alert.alert('No Location Selected', 'Please select a location on the map first.');
      return;
    }
    router.push({
      pathname: '/tabs/add/details',
      params: {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      }
    });
  };

  const centerOnLocation = async () => {
    if (currentLocation) {
      mapRef.current?.animateToRegion(currentLocation, 1000);
    }
  };

  if (!currentLocation) return null;

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <GooglePlacesAutocomplete
          ref={searchBarRef}
          placeholder='Search location...'
          onPress={(data, details = null) => {
            if (details?.geometry?.location) {
              const region = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              };
              mapRef.current?.animateToRegion(region, 1000);
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
          initialRegion={currentLocation}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              pinColor="#007AFF"
            />
          )}
        </MapView>
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={centerOnLocation}
        >
          <Ionicons name="locate" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.doneButton,
            !selectedLocation && styles.doneButtonDisabled
          ]}
          onPress={handleDone}
        >
          <View style={styles.buttonContent}>
            {selectedLocation ? (
              <>
                <Text style={styles.buttonText}>Add Restroom Details</Text>
                <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonArrow} />
              </>
            ) : (
              <Text style={[styles.buttonText, styles.buttonTextDisabled]}>
                Add Restroom Location
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
    minHeight: 50,
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
  doneButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '75%',
    maxWidth: 350,
    right: 90,
  },
  doneButtonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
  buttonTextDisabled: {
    color: '#ccc'
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonArrow: {
    marginLeft: 10,
  },
});

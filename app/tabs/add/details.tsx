import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/db';
import { Ionicons } from '@expo/vector-icons';
import { getDeviceId } from '@/app/utils/device';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRatingChange(star)}
          style={styles.starButton}
        >
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={32}
            color={star <= rating ? "#007AFF" : "#999"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function AddDetails() {
  const { latitude, longitude } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [bathroomCode, setBathroomCode] = useState('');
  const [isGendered, setIsGendered] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [isAccessible, setIsAccessible] = useState(false);
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for the restroom');
      return;
    }

    if (rating === 0) {
      Alert.alert('Error', 'Please rate the restroom');
      return;
    }

    setIsLoading(true);
    try {
      const deviceId = await getDeviceId();
      
      // First, create the restroom
      const { data: restroomData, error: restroomError } = await supabase
        .from('restrooms')
        .insert([
          {
            name: name.trim(),
            latitude: Number(latitude),
            longitude: Number(longitude),
            bathroom_code: bathroomCode.trim() || null,
            is_gendered: isGendered,
            is_public: isPublic,
            is_accessible: isAccessible,
            rating: rating,
            review_count: 1,
            creator_device_id: deviceId,
          },
        ])
        .select();

      if (restroomError) throw restroomError;

      // Then, add the initial review
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert([
          {
            restroom_id: restroomData[0].id,
            rating: rating,
            text: '',
            name: 'Anonymous'
          },
        ]);

      if (reviewError) {
        console.error('Review Error:', reviewError);
        throw reviewError;
      }

      Alert.alert(
        'Success',
        'Restroom has been added successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.push('/tabs/home'),
          },
        ]
      );
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to add restroom');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter restroom name or location"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Rating *</Text>
        <StarRating rating={rating} onRatingChange={setRating} />

        <Text style={styles.label}>Gendered</Text>
        <Switch
          value={isGendered}
          onValueChange={setIsGendered}
          trackColor={{ false: "#767577", true: "#007AFF" }}
        />

        <Text style={styles.label}>Wheelchair Accessible</Text>
        <Switch
          value={isAccessible}
          onValueChange={setIsAccessible}
          trackColor={{ false: "#767577", true: "#007AFF" }}
        />

        <Text style={styles.label}>Public Restroom</Text>
        <Switch
          value={isPublic}
          onValueChange={setIsPublic}
          trackColor={{ false: "#767577", true: "#007AFF" }}
        />

        <Text style={styles.label}>Bathroom Code</Text>
        <TextInput
          style={styles.input}
          value={bathroomCode}
          onChangeText={setBathroomCode}
          placeholder="Enter bathroom code (optional)"
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!name.trim() || rating === 0 || isLoading) && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!name.trim() || rating === 0 || isLoading}
      >
        <Text style={styles.submitButtonText}>
          {isLoading ? 'Adding...' : 'Add Restroom'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  starButton: {
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { supabase } from '@/db';
import theme from '@/assets/theme';
import { getDeviceId } from '@/app/utils/device';

export default function ReviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [restroomName, setRestroomName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRestroomName();
  }, []);

  const fetchRestroomName = async () => {
    try {
      const { data, error } = await supabase
        .from('restrooms')
        .select('name')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) setRestroomName(data.name);
    } catch (error) {
      console.error('Error fetching restroom name:', error);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!review.trim()) {
      Alert.alert('Error', 'Please enter a review');
      return;
    }

    setSubmitting(true);

    try {
      const deviceID = await getDeviceId();
      const { data: deviceProfile, error: profileError } = await supabase
        .from('device_profiles')
        .select('name')
        .eq('id', deviceID)
        .single();

      if (profileError) throw profileError;

      const deviceName = deviceProfile?.name || 'Unknown';

      const { error } = await supabase.from('reviews').insert([
        {
          restroom_id: id,
          rating,
          text: review.trim(),
          device_id: deviceID,
          device_name: deviceName,
        },
      ]);

      if (error) throw error;

      Alert.alert('Success', 'Your review has been submitted!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array(5)
      .fill(null)
      .map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => setRating(index + 1)}
          style={styles.starButton}
        >
          <Text style={[styles.star, index < rating && styles.filledStar]}>★</Text>
        </TouchableOpacity>
      ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Review {restroomName}</Text>

        <View style={styles.ratingContainer}>
          <Text style={styles.label}>Rating</Text>
          <View style={styles.starsContainer}>{renderStars()}</View>
        </View>

        <View style={styles.reviewContainer}>
          <Text style={styles.label}>Review</Text>
          <TextInput
            style={styles.reviewInput}
            multiline
            numberOfLines={4}
            placeholder="Write your review here..."
            value={review}
            onChangeText={setReview}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 24,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 32,
    color: '#ccc',
  },
  filledStar: {
    color: '#FFD700',
  },
  reviewContainer: {
    marginBottom: 24,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: theme.lightColors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

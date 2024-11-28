import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getDeviceId } from '../app/utils/device';
import { supabase } from '@/db';
import theme from '@/assets/theme';
import { Buffer } from 'buffer';

export default function Onboarding() {
  const [name, setName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Error selecting image. Please try again.');
    }
  };

  const completeOnboarding = async () => {
    if (!name.trim() || !image) {
      alert('Please provide both a name and profile picture');
      return;
    }

    setLoading(true);
    try {
      // Get device ID
      const deviceId = await getDeviceId();

      // Upload image to Supabase Storage
      const response = await fetch(image);
      const imageData = await response.arrayBuffer();
      const base64String = Buffer.from(imageData).toString('base64');
      const fileName = `profile_${Date.now()}.jpg`;
      
      console.log('Image data length:', base64String.length);
      
      // Get the mime type from the response
      const mimeType = response.headers.get('content-type') || 'image/jpeg';
      console.log('Upload mime type:', mimeType);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, Buffer.from(base64String, 'base64'), {
          contentType: mimeType,
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload image');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);

      // Create new profile
      const { error: profileError } = await supabase
        .from('device_profiles')
        .insert({
          id: deviceId,
          name: name.trim(),
          profile_image: publicUrl,
          created_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw new Error('Failed to create profile');
      }

      // Navigate to main app
      router.replace('/tabs/home');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Error setting up profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Pission!</Text>
        <Text style={styles.subtitle}>Let's set up your profile</Text>

        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Your name"
          value={name}
          onChangeText={setName}
          maxLength={50}
        />

        <TouchableOpacity 
          style={[
            styles.button,
            (!name.trim() || !image) && styles.buttonDisabled
          ]}
          onPress={completeOnboarding}
          disabled={!name.trim() || !image || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Complete Setup</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.lightColors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  imageContainer: {
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    color: '#666',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: theme.lightColors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

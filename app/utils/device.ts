import * as SecureStore from 'expo-secure-store';
import { supabase } from '@/db';

const DEVICE_ID_KEY = 'device_id';

export interface DeviceProfile {
  id: string;
  name: string | null;
  location: string | null;
  profile_image: string | null;
  created_at: string;
}

export async function getDeviceId(): Promise<string> {
  try {
    // Try to get existing device ID
    let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    
    if (!deviceId) {
      // If no device ID exists, create a new one
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substring(7);
      
      // Save it for future use
      await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
      
      // Create profile in Supabase
      await createDeviceProfile(deviceId);
    }
    
    return deviceId;
  } catch (error) {
    console.error('Error managing device ID:', error);
    // Fallback ID in case of storage error
    return 'device_' + Date.now();
  }
}

export async function createDeviceProfile(deviceId: string) {
  const { error } = await supabase
    .from('device_profiles')
    .insert({
      id: deviceId,
      created_at: new Date().toISOString(),
    });

  if (error && error.code !== '23505') { // Ignore unique violation errors
    console.error('Error creating device profile:', error);
  }
}

export async function getDeviceProfile(): Promise<DeviceProfile | null> {
  const deviceId = await getDeviceId();
  
  const { data, error } = await supabase
    .from('device_profiles')
    .select('*')
    .eq('id', deviceId)
    .single();

  if (error) {
    console.error('Error fetching device profile:', error);
    return null;
  }

  return data;
}

export async function updateDeviceProfile(updates: Partial<DeviceProfile>): Promise<DeviceProfile | null> {
  const deviceId = await getDeviceId();
  
  const { data, error } = await supabase
    .from('device_profiles')
    .update(updates)
    .eq('id', deviceId)
    .select()
    .single();

  if (error) {
    console.error('Error updating device profile:', error);
    return null;
  }

  return data;
}

export async function isOnboardingComplete(): Promise<boolean> {
  const profile = await getDeviceProfile();
  return !!(profile?.name && profile?.profile_image); // Returns true if both name and profile_image exist
}

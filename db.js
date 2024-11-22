import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://ojswcmswpmbpmreppjaj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qc3djbXN3cG1icG1yZXBwamFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyNDA3ODksImV4cCI6MjA0NzgxNjc4OX0.QDNrK8U3bc7tKHQDEZdZj55GjLcxBcS8LjFvbYLKk8U";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    localStorage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

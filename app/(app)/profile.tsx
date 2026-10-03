import { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { API_BASE_URL } from '@/constants/api';

type Profile = {
  id?: string | number;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  website?: string;
};

export default function ProfileScreen() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('AuthContext must be used inside AuthProvider');
  }

  const { user, token, logout } = auth;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/users/1`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      if (response.status === 401) {
        await logout();
        router.replace('/sign-in');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load profile.');
      }

      const data: Profile = await response.json();

      setProfile(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load profile.'
      );
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleLogout = async () => {
    await logout();
    router.replace('/sign-in');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>MY PROFILE</Text>

      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator color="#245bb2" />
          <Text style={styles.text}>Loading profile…</Text>
        </View>
      ) : error ? (
        <View style={styles.state}>
          <Text style={styles.error} accessibilityLiveRegion="polite">
            {error}
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={loadProfile}
          >
            <Text style={styles.link}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.text}>
            Name: {profile?.name || user?.name || '—'}
          </Text>

          <Text style={styles.text}>
            Email: {profile?.email || user?.email || '—'}
          </Text>

          <Text style={styles.text}>
            Username: {profile?.username || '—'}
          </Text>

          <Text style={styles.text}>
            Phone: {profile?.phone || '—'}
          </Text>

          <Text style={styles.text}>
            Website: {profile?.website || '—'}
          </Text>

          <Text style={styles.text}>
            Role: {user?.role || 'Student'}
          </Text>
        </View>
      )}

      <Text style={styles.text}>
        Session Status: {token ? 'Authenticated' : 'Not Available'}
      </Text>

      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>LOGOUT</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 20,
    backgroundColor: '#f2f5fa',
  },
  title: {
    color: '#17324d',
    fontSize: 24,
    fontWeight: '700',
  },
  state: {
    padding: 24,
    gap: 12,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 16,
    borderRadius: 12,
  },
  text: {
    color: '#536579',
    fontSize: 16,
  },
  error: {
    color: '#b42318',
    textAlign: 'center',
  },
  link: {
    color: '#245bb2',
    fontWeight: '600',
    padding: 10,
  },
  button: {
    backgroundColor: '#245bb2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

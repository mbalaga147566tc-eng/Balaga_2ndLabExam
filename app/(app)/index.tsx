import { useContext } from 'react';
import { Link } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AuthContext } from '@/context/AuthContext';

export default function DashboardScreen() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('AuthContext must be used inside AuthProvider');
  }

  const { user, token } = auth;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>STUDENT SERVICE PORTAL</Text>

      <Text style={styles.title}>
        Welcome, {user?.name || 'Student'}
      </Text>

      <Text style={styles.subtitle}>
        Your student services in one place.
      </Text>

      <View style={styles.card}>
        <Text style={styles.heading}>Student Information</Text>

        <Text style={styles.text}>
          Name: {user?.name || 'Not available'}
        </Text>

        <Text style={styles.text}>
          Email: {user?.email || 'Not available'}
        </Text>

        <Text style={styles.text}>
          Role: {user?.role || 'Student'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Quick Actions</Text>

        <Link href="/(app)/students" asChild>
          <Pressable
            accessibilityRole="button"
            style={styles.button}
          >
            <Text style={styles.buttonText}>View Students</Text>
          </Pressable>
        </Link>

        <Link href="/(app)/profile" asChild>
          <Pressable
            accessibilityRole="button"
            style={styles.button}
          >
            <Text style={styles.buttonText}>My Profile</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Session Status</Text>

        <Text style={styles.subtitle}>
          {token ? 'Authenticated' : 'Not Available'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 16,
    backgroundColor: '#f2f5fa',
  },
  eyebrow: {
    color: '#245bb2',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    color: '#17324d',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#536579',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    gap: 14,
  },
  heading: {
    color: '#17324d',
    fontSize: 18,
    fontWeight: '600',
  },
  text: {
    color: '#536579',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#245bb2',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

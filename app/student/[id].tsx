import { useCallback, useContext, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { type Student } from '@/components/StudentCard';
import { AuthContext } from '@/context/AuthContext';
import { API_BASE_URL } from '@/constants/api';

type ApiStudent = {
  id?: string | number;
  name?: string | null;
  email?: string | null;
  company?: {
    name?: string | null;
  };
};

export default function StudentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('AuthContext must be used inside AuthProvider');
  }

  const { token } = auth;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStudent = useCallback(async () => {
    if (!id) {
      setError('Student ID is missing.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      if (response.status === 401) {
        throw new Error('Your session has expired. Please sign in again.');
      }

      if (response.status === 404) {
        throw new Error('Student record not found.');
      }

      if (!response.ok) {
        throw new Error('Failed to load student details.');
      }

      const data: ApiStudent = await response.json();

      const studentData: Student = {
        id: data.id,
        name: data.name,
        email: data.email,
        course: data.company?.name ?? null,
      };

      setStudent(studentData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load student details.'
      );
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    loadStudent();
  }, [loadStudent]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Student Details</Text>

      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator color="#245bb2" />
          <Text style={styles.text}>Loading student…</Text>
        </View>
      ) : error ? (
        <View style={styles.state}>
          <Text style={styles.error} accessibilityLiveRegion="polite">
            {error}
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={loadStudent}
          >
            <Text style={styles.link}>Try Again</Text>
          </Pressable>
        </View>
      ) : !student ? (
        <View style={styles.state}>
          <Text style={styles.text}>
            No student record available.
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.name}>
            {student.name || 'Name not available'}
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Student ID</Text>
            <Text style={styles.text}>
              {student.id ?? 'Not available'}
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.text}>
              {student.email || 'Not available'}
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Course / Company</Text>
            <Text style={styles.text}>
              {student.course || 'Not available'}
            </Text>
          </View>
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Back</Text>
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
    fontSize: 28,
    fontWeight: '700',
  },
  state: {
    gap: 12,
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 18,
    borderRadius: 12,
  },
  name: {
    color: '#17324d',
    fontSize: 22,
    fontWeight: '700',
  },
  field: {
    gap: 4,
  },
  label: {
    color: '#536579',
    fontSize: 13,
    fontWeight: '600',
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

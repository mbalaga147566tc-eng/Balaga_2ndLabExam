import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import StudentCard, { type Student } from '@/components/StudentCard';
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

export default function StudentsScreen() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('AuthContext must be used inside AuthProvider');
  }

  const { token } = auth;

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      if (response.status === 401) {
        throw new Error(
          'Your session has expired. Please sign in again.'
        );
      }

      if (!response.ok) {
        throw new Error('Failed to load students.');
      }

      const data: ApiStudent[] = await response.json();

      const studentData: Student[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        course: item.company?.name ?? null,
      }));

      setStudents(studentData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load students.'
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const filteredStudents = students.filter((student) =>
    (student.name || '')
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>

      <TextInput
        style={styles.input}
        accessibilityLabel="Search students"
        placeholder="Search by name"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator color="#245bb2" />
          <Text style={styles.text}>Loading students…</Text>
        </View>
      ) : error ? (
        <View style={styles.state}>
          <Text
            style={styles.error}
            accessibilityLiveRegion="polite"
          >
            {error}
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={loadStudents}
          >
            <Text style={styles.link}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item, index) =>
            String(item.id ?? index)
          }
          renderItem={({ item }) => (
            <StudentCard student={item} />
          )}
          ListEmptyComponent={
            <View style={styles.state}>
              <Text style={styles.text}>
                {search.trim()
                  ? 'No students match your search.'
                  : 'No students found.'}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f2f5fa',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#17324d',
    marginBottom: 20,
  },
  input: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#c6d2e1',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    color: '#17324d',
    marginBottom: 20,
  },
  state: {
    padding: 24,
    gap: 12,
    alignItems: 'center',
  },
  text: {
    color: '#536579',
  },
  error: {
    color: '#b42318',
    textAlign: 'center',
  },
  link: {
    color: '#245bb2',
    padding: 12,
    fontWeight: '600',
  },
});

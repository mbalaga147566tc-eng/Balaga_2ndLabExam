import { useContext, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Stack, router, useSegments } from 'expo-router';
import { AuthContext, AuthProvider } from '@/context/AuthContext';

function RootNavigator() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('AuthContext must be used inside AuthProvider');
  }

  const { token, authLoading } = auth;
  const segments = useSegments();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const firstSegment = segments[0];
    const isSignIn = firstSegment === 'sign-in';
    const isProtectedRoute =
      firstSegment === '(app)' || firstSegment === 'student';

    if (!token && isProtectedRoute) {
      router.replace('/sign-in');
    }

    if (token && isSignIn) {
      router.replace('/(app)');
    }
  }, [authLoading, token, segments]);

  if (authLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#245bb2" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerTintColor: '#17324d' }}>
      <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
      <Stack.Screen name="register" options={{ title: 'Create Account' }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen
        name="student/[id]"
        options={{ title: 'Student Details' }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f5fa',
  },
});

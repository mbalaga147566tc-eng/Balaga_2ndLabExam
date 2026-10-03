import { useContext, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Tabs, router } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';

export default function AppLayout() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('AuthContext must be used inside AuthProvider');
  }

  const { token, authLoading } = auth;

  useEffect(() => {
    if (!authLoading && !token) {
      router.replace('/sign-in');
    }
  }, [authLoading, token]);

  if (authLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#245bb2" />
      </View>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#245bb2',
        headerTintColor: '#17324d',
        tabBarIconStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home' }}
      />

      <Tabs.Screen
        name="students"
        options={{ title: 'Students' }}
      />

      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile' }}
      />
    </Tabs>
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

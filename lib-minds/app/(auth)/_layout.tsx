import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

export default function AuthLayout() {
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace(role === 'admin' ? ROUTES.ADMIN_HOME : ROUTES.USER_HOME);
    }
  }, [user, role, loading]);
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="reset-password" options={{ headerShown: false }} />
    </Stack>
  );
}
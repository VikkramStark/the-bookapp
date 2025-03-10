import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

export default function AuthLayout() {
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (role === 'admin') {
        router.replace(ROUTES.ADMIN_HOME); 
      } else {
        router.replace(ROUTES.USER_BOOKS); 
      }
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
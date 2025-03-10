import { Tabs, router } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { View, Text } from 'react-native';

export default function AdminLayout() {
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && role !== 'admin') {
      router.replace(ROUTES.USER_HOME);
    } else if (!loading && !user) {
      router.replace(ROUTES.LOGIN);
    }
  }, [user, role, loading]);

  if (loading) {
    return null; 
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'library',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="library" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-books"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'inbox',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome6 name="inbox" size={24} color={color} />,
        }}
      />
            <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <View className='h-6 w-6 rounded-full bg-gray-700 relative items-center justify-center'><Text className='absolute font-bold text-white'>A</Text></View>,
        }}
      />
    </Tabs>
  );
}
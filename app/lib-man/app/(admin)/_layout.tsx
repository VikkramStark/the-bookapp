import { Tabs } from 'expo-router';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image, StyleSheet } from 'react-native';

export default function TabLayout() {
  const [isUser, setIsUser] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'black',
        }}>
        <Tabs.Screen
          name="admin-index"
          options={{
            title: 'profile',
            headerShown: false,
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="AdminLibrary"
          options={{
            title: 'library',
            headerShown: false,
            tabBarIcon: ({ color }) => <Ionicons name="library" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="AddBooks"
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="AdminInbox"
          options={{
            title: 'inbox',
            headerShown: false,
            tabBarIcon: ({ color }) => <FontAwesome6 name="inbox" size={24} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    height: 24,
    width: 24,
    borderRadius: 12,
  },
});

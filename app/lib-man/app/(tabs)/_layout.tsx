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
          name="index"
          options={{
            title: 'home',
            headerShown: false,
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="books"
          options={{
            title: 'books',
            headerShown: false,
            tabBarIcon: ({ color }) => <Ionicons name="library" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'explore',
            headerShown: false,
            tabBarIcon: ({ color }) => <Ionicons name="compass" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="wishlist"
          options={{
            title: 'wishlist',
            headerShown: false,
            tabBarIcon: ({ color }) => <Ionicons name="bookmark" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'profile',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Image
                style={styles.profileImage}
                source={{
                  uri: 'https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=',
                }}
              />
            ),
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

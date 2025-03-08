import { Link, Tabs } from 'expo-router';

import { HeaderButton } from '../../components/HeaderButton';
import { TabBarIcon } from '../../components/TabBarIcon';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image } from 'react-native';
export default function TabLayout() {
  const test=false;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
      }}>
      <Tabs.Screen
        name="index"

        options={{
          title: 'home',
          headerShown:false,
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
        
      />
      <Tabs.Screen
        name="books"
        options={{
          title: 'books',
          headerShown:false,
          tabBarIcon: ({ color }) => <Ionicons name="library" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'explore',
          headerShown:false,
          tabBarIcon: ({ color }) => <Ionicons name="compass" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'wishlist',
          headerShown:false,
          tabBarIcon: ({ color }) => <Ionicons name="bookmark" size={24} color={color} />,
        }}
      />
            <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          headerShown:false,
          tabBarIcon: ({ color }) => <Image
                      className="h-8 w-8 rounded-full"
                      source={{
                        uri: 'https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=',
                      }}
                    />,
        }}
      />
          <Tabs.Screen
        name="admin-index"
        options={{
          title: 'profile',
          headerShown:false,
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
            <Tabs.Screen
        name="AdminLibrary"
        options={{
          title: 'library',
          headerShown:false,
          tabBarIcon: ({ color }) => <Ionicons name="library" size={24} color={color} />,
        }}
      />
          <Tabs.Screen
        name="AddBooks"
        options={{
          title: '',
          headerShown:false,
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} />,
        }}
      />
        <Tabs.Screen
        name="AdminInbox"
        options={{
          title: 'inbox',
          headerShown:false,
          tabBarIcon: ({ color }) => <FontAwesome6 name="inbox" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

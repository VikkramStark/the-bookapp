import { Tabs, router } from 'expo-router';
import { useEffect,useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { auth, db } from '../../utils/firebase';
import { View, Text } from 'react-native';
import { doc, getDoc, collection, getDocs, updateDoc, setDoc } from 'firebase/firestore';
export default function AdminLayout() {
  const { user, role, loading } = useAuth();
  const [username, setUsername] = useState<string>('');
  useEffect(() => {
    const fetchUsername = async () => {
      if (!auth.currentUser) return;

      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().username) {
        setUsername(userDoc.data().name);
      } else {
        const emailPrefix = auth.currentUser.email?.split('@')[0] || 'Admin';
        setUsername(emailPrefix);
        await setDoc(userDocRef, { name: emailPrefix }, { merge: true });
      }
    };

    fetchUsername();
  }, []);

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
      }}>
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
          tabBarStyle: { display: 'none' },
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
          tabBarIcon: ({ color }) => (
            <View className="relative h-6 w-6 items-center justify-center rounded-full bg-gray-700">
              <Text className="absolute font-bold text-white">{username[0]?.toUpperCase() || 'A'}</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

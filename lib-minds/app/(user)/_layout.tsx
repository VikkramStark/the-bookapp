import { Tabs, router } from 'expo-router';
import { useEffect , useState} from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import Ionicons from '@expo/vector-icons/Ionicons';
import { auth, db } from '../../utils/firebase';
import { View, Text } from 'react-native';
import { doc, getDoc, collection, getDocs, updateDoc, setDoc } from 'firebase/firestore';
export default function UserLayout() {
  const { user, loading } = useAuth();
  const [username, setUsername] = useState<string>('');
  useEffect(() => {
    const fetchUsername = async () => {
      if (!auth.currentUser) return;

      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().name) {
        setUsername(userDoc.data().username);
      } else {
        const emailPrefix = auth.currentUser.email?.split('@')[0] || 'Admin';
        setUsername(emailPrefix);
        await setDoc(userDocRef, { name: emailPrefix }, { merge: true });
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(ROUTES.LOGIN);
    }
  }, [user, loading]);

  if (loading) {
    return null; 
  }

  return (
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
          title: 'favourites',
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
            <View className="relative h-6 w-6 items-center justify-center rounded-full bg-gray-700">
              <Text className="absolute font-bold text-white">
                {username[0]?.toUpperCase() || 'A'}
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

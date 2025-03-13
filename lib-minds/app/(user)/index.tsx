import { ScrollView, ActivityIndicator, RefreshControl, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import HomeScroll from '../../components/layout/HomeScroll';
import HomeInfoCard from '../../components/layout/HomeInfoCard';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useTheme } from '../../ThemeContext';
import { StatusBar } from 'expo-status-bar';

const Home = () => {
  const { theme } = useTheme();
  const statusbarColor = theme === 'light' ? 'dark' : 'light';
  const headingColor = theme === 'light' ? 'black' : 'white';
  const { user } = useAuth();
  const [borrowedCount, setBorrowedCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = async (isRefreshing = false) => {
    if (!user) return;

    if (!isRefreshing) setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      setBorrowedCount(userData?.borrowedBooks?.length || 0);
      setWishlistCount(userData?.wishlist?.length || 0);
      setUsername(userData?.username || user?.email?.split('@')[0] || 'User');
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      if (!isRefreshing) setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUserData(true);
      // HomeScroll components will also refetch their data via their own fetchBooks calls
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={headingColor}
            />
          }
        >
          <View className="flex h-16 w-full items-center justify-center py-2">
            {theme === 'dark' ? (
              <Image
                source={require('../../assets/logo-white-side.png')}
                className="h-full w-auto"
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require('../../assets/logo-black-side.png')}
                className="h-full w-auto"
                resizeMode="contain"
              />
            )}
          </View>
          <ActivityIndicator size="large" className="mt-4" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <View className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={headingColor}
            />
          }
        >
          <View className="flex h-16 w-full items-center justify-center py-2">
            {theme === 'dark' ? (
              <Image
                source={require('../../assets/logo-white-side.png')}
                className="h-full w-auto"
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require('../../assets/logo-black-side.png')}
                className="h-full w-auto"
                resizeMode="contain"
              />
            )}
          </View>

          <HomeInfoCard
            name={username}
            card1text={`Books\nborrowed`}
            card1no={borrowedCount.toString()}
            card2no={wishlistCount.toString()}
            card2text={`Favourite\nBooks`}
            isAdmin={false}
          />
          <HomeScroll
            title="Owned books"
            goto="/(user)/books"
            isBorrowed={true}
            isAdmin={false}
            userId={user?.uid || null}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
          <HomeScroll
            title="Wishlist"
            goto="/(user)/wishlist"
            isBorrowed={false}
            isAdmin={false}
            userId={user?.uid || null}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        </ScrollView>
        <StatusBar style={statusbarColor} />
      </View>
    </SafeAreaView>
  );
};

export default Home;
import { ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import HomeScroll from '../../components/layout/HomeScroll';
import HomeInfoCard from '../../components/layout/HomeInfoCard';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useTheme } from '../../ThemeContext';
import { View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const Home = () => {
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';
  const statusbarColor = theme === 'light' ? 'dark' : 'light';
  const { user } = useAuth();
  const [borrowedCount, setBorrowedCount] = useState(0);
  const [penaltyFee, setPenaltyFee] = useState(0);
  const [username, setUsername] = useState<string>(''); // Add username state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        setBorrowedCount(userData?.borrowedBooks?.length || 0);
        setPenaltyFee(userData?.penaltyFee || 0);
        // Set username from Firestore, fallback to email prefix if not set
        setUsername(userData?.username || user?.email?.split('@')[0] || 'User');
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" className="mt-4" />;
  }

  return (
    <SafeAreaView className="flex-1">
      <View className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex h-16 w-full items-center justify-center py-2 mt-4">
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
            name={username} // Use fetched username
            card1text={`Books\nborrowed`}
            card1no={borrowedCount.toString()}
            card2no={penaltyFee.toString()}
            card2text={`Penalty\nfee`}
            isAdmin={false}
          />
          <HomeScroll title="Owned books" goto="/(user)/books" isBorrowed={true} isAdmin={false} />
          <HomeScroll title="Wishlist" goto="/(user)/wishlist" isBorrowed={false} isAdmin={false} />
        </ScrollView>
      </View>
      <StatusBar style={statusbarColor} />
    </SafeAreaView>
  );
};

export default Home;
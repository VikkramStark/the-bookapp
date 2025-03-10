import { ScrollView, ActivityIndicator, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import HomeScroll from '../../components/layout/HomeScroll';
import HomeInfoCard from '../../components/layout/HomeInfoCard';
import { db } from '../../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useTheme } from '../../ThemeContext';
import { Skeleton } from 'moti/skeleton';
const Home = () => {
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';
  const [availableCount, setAvailableCount] = useState(0);
  const [borrowedCount, setBorrowedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const skeletonColor=theme=== 'dark'?'light':'dark';
  useEffect(() => {
    const fetchBookStats = async () => {
      setLoading(true);
      try {
        const availableQuery = query(collection(db, 'books'), where('status', '==', 'available'));
        const borrowedQuery = query(collection(db, 'books'), where('status', '==', 'borrowed'));

        const availableSnapshot = await getDocs(availableQuery);
        const borrowedSnapshot = await getDocs(borrowedQuery);

        setAvailableCount(availableSnapshot.size);
        setBorrowedCount(borrowedSnapshot.size);
      } catch (error) {
        console.error('Error fetching book stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookStats();
  }, []);

  if (loading) {
    // return <ActivityIndicator size="large" className="mt-4" />;
    return (
      <ScrollView
        className={`${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
        showsVerticalScrollIndicator={false}>
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
        <View className="mt-4 flex  flex-1">
          <View className="px-6">
            <Skeleton width={100} height={20} radius={4} colorMode={skeletonColor} />
          </View>

          <View className="my-4 flex flex-row items-center justify-center gap-2 px-4">
            <Skeleton width={160} height={176} colorMode={skeletonColor} />
            <Skeleton width={176} height={176} colorMode={skeletonColor} />
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className={`${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
      showsVerticalScrollIndicator={false}>
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
        name="Admin"
        card1text={`Books\navailable`}
        card1no={availableCount.toString()}
        card2no={borrowedCount.toString()}
        card2text={`Books\nborrowed`}
        isAdmin={true}
      />
      {/* Uncomment if needed */}
      <HomeScroll title="Available books" goto="/(admin)/library" isBorrowed={false} isAdmin={true} />
      <HomeScroll title="Borrowed books" goto="/(admin)/library" isBorrowed={true} isAdmin={true} />
      
    </ScrollView>
  );
};

export default Home;

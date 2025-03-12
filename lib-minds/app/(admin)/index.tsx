import { ScrollView, ActivityIndicator, View, Image,Platform} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScroll from '../../components/layout/HomeScroll';
import HomeInfoCard from '../../components/layout/HomeInfoCard';
import { db } from '../../utils/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useTheme } from '../../ThemeContext';
import { Skeleton } from 'moti/skeleton';
import { useAuth } from '../../hooks/useAuth'; 
import { StatusBar } from 'expo-status-bar';

const Home = () => {
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';
  const statusbarColor = theme === 'light' ? 'dark' : 'light';
  const { user } = useAuth(); 
  const [availableCount, setAvailableCount] = useState(0);
  const [borrowedCount, setBorrowedCount] = useState(0);
  const [username, setUsername] = useState<string>(''); 
  const [loading, setLoading] = useState(true);
  const skeletonColor = theme === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const availableQuery = query(collection(db, 'books'), where('status', '==', 'available'));
        const borrowedQuery = query(collection(db, 'books'), where('status', '==', 'borrowed'));
        const availableSnapshot = await getDocs(availableQuery);
        const borrowedSnapshot = await getDocs(borrowedQuery);
        setAvailableCount(availableSnapshot.size);
        setBorrowedCount(borrowedSnapshot.size);
        
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        setUsername(userData?.name || user?.email?.split('@')[0] || 'Admin');
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      
      <SafeAreaView className="flex-1">
        <ScrollView
          className={`${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
          showsVerticalScrollIndicator={false}
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
          <View className="mt-4 flex flex-1">
            <View className="px-6">
              <Skeleton width={100} height={20} radius={4} colorMode={skeletonColor} />
            </View>
            <View className="my-4 flex flex-row items-center justify-center gap-2 px-4">
              <Skeleton width={160} height={176} colorMode={skeletonColor} />
              <Skeleton width={176} height={176} colorMode={skeletonColor} />
            </View>
          </View>
        <StatusBar style={statusbarColor} />
        </ScrollView>
      </SafeAreaView>
    );
  }

return(    <SafeAreaView className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
  <ScrollView
    className={`${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
    showsVerticalScrollIndicator={false}
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
      card1text={`Books\navailable`}
      card1no={availableCount.toString()}
      card2no={borrowedCount.toString()}
      card2text={`Books\nborrowed`}
      isAdmin={true}
    />
    <HomeScroll title="Available books" goto="/(admin)/library" isBorrowed={false} isAdmin={true} />
    <HomeScroll title="Borrowed books" goto="/(admin)/library" isBorrowed={true} isAdmin={true} />
  </ScrollView>
    <StatusBar style={statusbarColor} />
</SafeAreaView> )

} 

    


export default Home;
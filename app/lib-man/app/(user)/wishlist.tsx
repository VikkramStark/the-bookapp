import { View, Text, ActivityIndicator, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import BookCard from '../../components/ui/BookCard';
import { FlashList } from '@shopify/flash-list';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useTheme } from '../../ThemeContext';
import { useRouter } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
type Book = {
  id: string;
  imgUrl: string;
  returnDays: number;
};

const Wishlist = () => {
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const wishlistBookIds = userDoc.data()?.wishlist || [];

        if (wishlistBookIds.length === 0) {
          setBooks([]);
          setLoading(false);
          return;
        }

        const booksQuery = query(collection(db, 'books'), where('__name__', 'in', wishlistBookIds));
        const booksSnapshot = await getDocs(booksQuery);
        const booksData = booksSnapshot.docs.map((doc) => ({
          id: doc.id,
          imgUrl: doc.data().imgUrl,
          returnDays: doc.data().returnDays || 0,
        }));

        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const handleAvailablePress = (bookId: string) => {
    router.push(`/explore/${bookId}`); // Navigate to book's detail in explore
  };

  if (loading) {
    // return <ActivityIndicator size="large" className="mt-4" />;
    return (
      <View className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'} `}>
        <View className="flex h-16 w-full items-center justify-center py-2 mx-2">
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
        <Text className="px-2 text-2xl font-bold " style={{ color: headingColor }}>
        Wishlist
        </Text>
        {theme === 'dark'?(<View className="flex-1 flex-row justify-center gap-2">
          <Skeleton show={loading} colorMode="light" height={256} width={176} />
          <Skeleton show={loading} colorMode="light" height={256} width={176} />
        </View>):(<View className=" flex-1 flex-row justify-center gap-2">
          <Skeleton show={loading} colorMode="dark" height={256} width={176} />
          <Skeleton show={loading} colorMode="dark" height={256} width={176} />
        </View>)}
        
      </View>
    );
  }

  return (
    <View className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
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
      
      <View className="mt-4 flex flex-1 px-2">
        <Text className="px-2 text-2xl font-bold" style={{ color: headingColor }}>Wishlist</Text>
        {books.length === 0 ? (
          <Text className="mt-4 text-center text-lg" style={{ color: headingColor }}>Your wishlist is empty.</Text>
        ) : (
          <FlashList
            showsVerticalScrollIndicator={false}
            data={books}
            numColumns={2}
            estimatedItemSize={6}
            renderItem={({ item }) => (
              <BookCard
                days={item.returnDays.toString()}
                isReturn={false}
                imgUrl={item.imgUrl}
                height="64"
                width="48"
                isadmin={false}
                onAvailablePress={
                  item.returnDays === 0 ? () => handleAvailablePress(item.id) : undefined
                }
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default Wishlist;
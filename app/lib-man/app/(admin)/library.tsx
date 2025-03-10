import { View, Text, ActivityIndicator, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import BookCard from '../../components/ui/BookCard';
import { FlashList } from '@shopify/flash-list';
import { db } from '../../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useTheme } from '../../ThemeContext';
import { Skeleton } from 'moti/skeleton';
type Book = {
  id: string;
  imgUrl: string;
  bookStatus: 'available' | 'borrowed' | 'penalty';
};

const Library = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const booksSnapshot = await getDocs(collection(db, 'books'));
        const booksData = booksSnapshot.docs.map((doc) => {
          const status = doc.data().status;
          // Validate status
          const validStatuses = ['available', 'borrowed', 'penalty'] as const;
          if (!validStatuses.includes(status)) {
            console.warn(`Invalid status for book ${doc.id}: ${status}`);
          }
          return {
            id: doc.id,
            imgUrl: doc.data().imgUrl || '', // Fallback for missing imgUrl
            bookStatus: validStatuses.includes(status)
              ? (status as 'available' | 'borrowed' | 'penalty')
              : 'available', // Fallback to 'available'
          };
        });

        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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
        <Text className="px-2 text-2xl font-bold mx-2 " style={{ color: headingColor }}>
          All books
        </Text>
        {theme === 'dark'?(
          <View className=" flex-1 flex-row gap-4 mx-2 justify-center mt-2">
          <Skeleton show={loading} colorMode="light" height={224} width={176} />
          <Skeleton show={loading} colorMode="light" height={224} width={176} />
        </View>):(<View className=" flex-1 flex-row gap-4 mx-2 justify-center mt-2">
          <Skeleton show={loading} colorMode="dark" height={224} width={176} />
          <Skeleton show={loading} colorMode="dark" height={224} width={176} />
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

      <View className="mt-4 flex flex-1 px-2 ">
        <Text className="px-2 text-2xl font-bold " style={{ color: headingColor }}>
          All books
        </Text>
        {books.length === 0 ? (
          <Text className="mt-4 text-center text-lg">No books in the library.</Text>
        ) : (
          <FlashList
            estimatedItemSize={6}
            data={books}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            renderItem={({ item }) => (
              <BookCard
                days="4"
                height="64"
                width="48"
                imgUrl={item.imgUrl}
                isReturn={true}
                isadmin={true}
                isAdminLibrary={true}
                bookStatusId={item.bookStatus}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default Library;

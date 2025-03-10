import { View, Text, ActivityIndicator } from 'react-native';
import { Link, Href } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import BookCard from '../ui/BookCard';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../ThemeContext';
type HomeScrollProps = {
  title: string;
  goto: Href;
  isBorrowed: boolean;
  isAdmin: boolean;
};

type Book = {
  id: string;
  imgUrl: string;
  returnDays: number;
};

export default function HomeScroll({ goto, title, isBorrowed, isAdmin }: HomeScrollProps) {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        if (isAdmin) {
          const booksQuery = query(
            collection(db, 'books'),
            where('status', '==', isBorrowed ? 'borrowed' : 'available')
          );
          const booksSnapshot = await getDocs(booksQuery);
          const booksData = booksSnapshot.docs.map((doc) => ({
            id: doc.id,
            imgUrl: doc.data().imgUrl,
            returnDays: doc.data().returnDays || 0,
          }));
          setBooks(booksData);
        } else {
          if (!user) return;

          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const bookIds = isBorrowed
            ? userDoc.data()?.borrowedBooks || []
            : userDoc.data()?.wishlist || [];

          if (bookIds.length === 0) {
            setBooks([]);
            setLoading(false);
            return;
          }

          const booksQuery = query(collection(db, 'books'), where('__name__', 'in', bookIds));
          const booksSnapshot = await getDocs(booksQuery);
          const booksData = booksSnapshot.docs.map((doc) => ({
            id: doc.id,
            imgUrl: doc.data().imgUrl,
            returnDays: doc.data().returnDays || 0,
          }));

          setBooks(booksData);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [user, isBorrowed, isAdmin]);

  if (loading) {
    return <ActivityIndicator size="large" className="mt-4" />;
  }

  return (
    <View className={`flex flex-1`}><View className="mb-4">
    <View className="flex flex-row flex-1 justify-between px-2">
      <Text className="text-xl font-semibold" style={{ color: headingColor }}>{title}</Text>
      <Link href={goto} className="pl-4 text-neutral-600">
        view all
      </Link>
    </View>
    {books.length === 0 ? (
      <Text className="mt-4 text-center text-lg">No books to display.</Text>
    ) : (
      <FlashList
        data={books}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={5}
        renderItem={({ item }) => (
          <BookCard
            days={item.returnDays.toString()}
            isReturn={isBorrowed}
            imgUrl={item.imgUrl}
            height="56"
            width="40"
            isadmin={isAdmin}
          />
        )}
      />
    )}
  </View></View>
    
  );
}
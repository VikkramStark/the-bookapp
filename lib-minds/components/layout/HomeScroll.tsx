import { View, Text, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { Link, Href } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import BookCard from '../ui/BookCard';
import { db } from '../../utils/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState, useCallback } from 'react';
import { useTheme } from '../../ThemeContext';

type HomeScrollProps = {
  title: string;
  goto: Href;
  isBorrowed: boolean;
  isAdmin: boolean;
  userId: string | null;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
};

type Book = {
  id: string;
  imgUrl: string;
  returnDays: number;
};

export default function HomeScroll({ goto, title, isBorrowed, isAdmin, userId, refreshing, onRefresh }: HomeScrollProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';

  const fetchBooks = useCallback(async (forceRefresh = false) => {
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
          imgUrl: doc.data().imgUrl || '',
          returnDays: doc.data().returnDays || 0,
        }));
        setBooks(booksData);
      } else {
        if (!userId) {
          setBooks([]);
          setLoading(false);
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', userId));
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
          imgUrl: doc.data().imgUrl || '',
          returnDays: doc.data().returnDays || 0,
        }));
        setBooks(booksData);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, isBorrowed, isAdmin, title]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleRefresh = useCallback(async () => {
    
    try {
      await onRefresh();
      await fetchBooks(true); 
    } catch (error) {
      console.error('Refresh error:', error);
    }
  }, [onRefresh, fetchBooks, title]);

  useEffect(() => {
    if (refreshing) {
      fetchBooks(true);
    }
  }, [refreshing, fetchBooks, title]);

  if (loading) {
    return <ActivityIndicator size="large" className="mt-4" color={headingColor} />;
  }

  return (
    <View className="flex flex-1">
      <View className="mb-4">
        <View className="flex flex-row flex-1 justify-between px-2">
          <Text className="text-xl font-semibold" style={{ color: headingColor }}>
            {title}
          </Text>
          <Link href={goto} className="pl-4 text-neutral-600">
            view all
          </Link>
        </View>
        {books.length === 0 ? (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 16,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={headingColor}
              />
            }
          >
            <Text className="mt-4 text-center text-lg" style={{ color: headingColor }}>
              No books to display.
            </Text>
          </ScrollView>
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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={headingColor}
              />
            }
          />
        )}
      </View>
    </View>
  );
}
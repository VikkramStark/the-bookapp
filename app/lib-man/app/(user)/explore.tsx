import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../utils/firebase';
import { useTheme } from '../../ThemeContext';

import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, setDoc,getDoc, Timestamp,arrayRemove } from 'firebase/firestore';

type Book = {
  id: string;
  imgUrl: string;
  title: string;
  author: string;
  isbn: string;
  status: 'available' | 'borrowed' | 'holding' | 'penalty';
  isInWishlist: boolean;
};

const Explore = () => {
    const { theme } = useTheme();
    const headingColor = theme === 'light' ? 'black' : 'white';
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableBooks = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Fetch available books
        const booksQuery = query(
          collection(db, 'books'),
          where('status', '==', 'available')
        );
        const booksSnapshot = await getDocs(booksQuery);

        // Fetch user's wishlist to determine if each book is in the wishlist
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const wishlist = userDoc.data()?.wishlist || [];

        const booksData = booksSnapshot.docs.map((doc) => ({
          id: doc.id,
          imgUrl: doc.data().imgUrl,
          title: doc.data().title,
          author: doc.data().author,
          isbn: doc.data().isbn,
          status: doc.data().status,
          isInWishlist: wishlist.includes(doc.id),
        }));

        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching available books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableBooks();
  }, [user]);

  const handleBorrow = async (book: Book) => {
    if (!user) return;

    try {
      // Create a borrow request
      await setDoc(doc(collection(db, 'requests')), {
        bookId: book.id,
        userId: user.uid,
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        borrowDays: 14, // Default borrow period
        status: 'pending',
        createdAt: Timestamp.now(),
      });

      alert('Borrow request submitted! An admin will review it.');
    } catch (error) {
      console.error('Error submitting borrow request:', error);
      alert('Failed to submit borrow request.');
    }
  };

  const toggleWishlist = async (book: Book) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      if (book.isInWishlist) {
        await updateDoc(userRef, {
          wishlist: arrayRemove(book.id),
        });
      } else {
        await updateDoc(userRef, {
          wishlist: arrayUnion(book.id),
        });
      }

      setBooks((prevBooks) =>
        prevBooks.map((b) =>
          b.id === book.id ? { ...b, isInWishlist: !b.isInWishlist } : b
        )
      );
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Failed to update wishlist.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" className="mt-4" />;
  }

  return (
            <View className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
    <View className="flex flex-1 px-2 mt-4">
      <Text className="text-2xl font-bold px-2" style={{ color: headingColor }}>Available books</Text>
      {books.length === 0 ? (
        <Text className="mt-4 text-center text-lg" style={{ color: headingColor }}>No available books.</Text>
      ) : (
        <FlashList
          estimatedItemSize={6}
          data={books}
          numColumns={2}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="m-2 overflow-hidden">
              <View className="relative h-64 w-48">
                <Image
                  source={{ uri: item.imgUrl }}
                  className="h-full w-full rounded-lg"
                  resizeMode="cover"
                />
                <View className="absolute end-0 flex h-full justify-between">
                  <Pressable
                    onPress={() => toggleWishlist(item)}
                    className="m-2 self-end rounded-full bg-white p-2"
                  >
                    <Ionicons
                      name={item.isInWishlist ? 'heart' : 'heart-outline'}
                      size={24}
                      color={item.isInWishlist ? 'red' : 'black'}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => handleBorrow(item)}
                    className="m-2 rounded-lg border-2 border-black bg-white p-3"
                  >
                    <Text>Borrow</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View></View>
  );
};

export default Explore;
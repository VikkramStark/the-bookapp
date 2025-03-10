import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import BookCard from '../../components/ui/BookCard';
import { FlashList } from '@shopify/flash-list';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';

type Book = {
  id: string;
  imgUrl: string;
  returnDays: number;
};

const Wishlist = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Get the user's wishlist
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const wishlistBookIds = userDoc.data()?.wishlist || [];

        if (wishlistBookIds.length === 0) {
          setBooks([]);
          setLoading(false);
          return;
        }

        // Fetch the books
        const booksQuery = query(
          collection(db, 'books'),
          where('__name__', 'in', wishlistBookIds)
        );
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

  if (loading) {
    return <ActivityIndicator size="large" className="mt-4" />;
  }

  return (
    <View className="flex flex-1 px-2 mt-4">
      <Text className="text-2xl font-bold px-2">Wishlist</Text>
      {books.length === 0 ? (
        <Text className="mt-4 text-center text-lg">Your wishlist is empty.</Text>
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
            />
          )}
        />
      )}
    </View>
  );
};

export default Wishlist;
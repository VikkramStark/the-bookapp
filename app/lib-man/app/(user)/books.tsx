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

const Books = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Get the user's borrowed book IDs
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const borrowedBookIds = userDoc.data()?.borrowedBooks || [];

        if (borrowedBookIds.length === 0) {
          setBooks([]);
          setLoading(false);
          return;
        }

        // Fetch the books
        const booksQuery = query(
          collection(db, 'books'),
          where('__name__', 'in', borrowedBookIds)
        );
        const booksSnapshot = await getDocs(booksQuery);
        const booksData = booksSnapshot.docs.map((doc) => ({
          id: doc.id,
          imgUrl: doc.data().imgUrl,
          returnDays: doc.data().returnDays,
        }));

        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" className="mt-4" />;
  }

  return (
    <View className="flex flex-1 px-2 mt-4">
      <Text className="text-2xl font-bold px-2">Borrowed books</Text>
      {books.length === 0 ? (
        <Text className="mt-4 text-center text-lg">No borrowed books.</Text>
      ) : (
        <FlashList
          numColumns={2}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={5}
          data={books}
          renderItem={({ item }) => (
            <BookCard
              days={item.returnDays.toString()}
              isReturn={true}
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

export default Books;
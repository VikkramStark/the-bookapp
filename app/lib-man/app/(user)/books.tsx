import { View, Text, ActivityIndicator, Image, ScrollView, Pressable } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { FlashList } from '@shopify/flash-list';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../utils/firebase';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useTheme } from '../../ThemeContext';
import { Skeleton } from 'moti/skeleton';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BookCard from '../../components/ui/BookCard';
import GradientButton from '../../components/ui/GradientButtons';

type Book = {
  id: string;
  imgUrl: string;
  returnDays: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  edition: string;
  description: string;
  publisher: string;
  language: string;
  quantity: number;
  maxBorrowDays: number;
};

const Books = () => {
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const borrowedBookIds = userDoc.data()?.borrowedBooks || [];

        if (borrowedBookIds.length === 0) {
          setBooks([]);
          setLoading(false);
          return;
        }

        const booksQuery = query(collection(db, 'books'), where('__name__', 'in', borrowedBookIds));
        const booksSnapshot = await getDocs(booksQuery);
        const booksData = booksSnapshot.docs.map((doc) => ({
          id: doc.id,
          imgUrl: doc.data().imgUrl || '',
          returnDays: doc.data().returnDays || 0,
          title: doc.data().title || 'Unknown Title',
          author: doc.data().author || 'Unknown Author',
          isbn: doc.data().isbn || 'N/A',
          category: doc.data().category || 'N/A',
          edition: doc.data().edition || 'N/A',
          description: doc.data().description || 'No description available',
          publisher: doc.data().publisher || 'N/A',
          language: doc.data().language || 'N/A',
          quantity: doc.data().quantity || 1,
          maxBorrowDays: doc.data().maxBorrowDays || 14,
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

  const handleBookPress = (book: Book) => {
    setSelectedBook(book);
    bottomSheetRef.current?.expand();
  };

  const handleReturn = async () => {
    if (!selectedBook || !user) return;

    try {
      await updateDoc(doc(db, 'books', selectedBook.id), {
        status: 'available',
        borrowedBy: null,
        borrowedAt: null,
        returnDays: 0,
        returnDate: null,
      });
      await updateDoc(doc(db, 'users', user.uid), {
        borrowedBooks: arrayRemove(selectedBook.id),
      });
      console.log('inside this block');
      
      setBooks((prev) => prev.filter((book) => book.id !== selectedBook.id));
      bottomSheetRef.current?.close();
      setSelectedBook(null);
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Failed to return book.');
    }
  };

  if (loading) {
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
        <Text className="px-2 text-2xl font-bold mx-2" style={{ color: headingColor }}>
          Borrowed books
        </Text>
        {theme === 'dark' ? (
          <View className="flex-1 flex-row gap-4 mx-2 justify-center mt-2">
            <Skeleton show={loading} colorMode="light" height={224} width={176} />
            <Skeleton show={loading} colorMode="light" height={224} width={176} />
          </View>
        ) : (
          <View className="flex-1 flex-row gap-4 mx-2 justify-center mt-2">
            <Skeleton show={loading} colorMode="dark" height={224} width={176} />
            <Skeleton show={loading} colorMode="dark" height={224} width={176} />
          </View>
        )}
      </View>
    );
  }

  return (
    <GestureHandlerRootView className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
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

      <View className="flex flex-1 px-2 mt-4">
        <Text className="text-2xl font-bold px-2" style={{ color: headingColor }}>
          Borrowed books
        </Text>
        {books.length === 0 ? (
          <Text className="mt-4 text-center text-lg" style={{ color: headingColor }}>
            No borrowed books.
          </Text>
        ) : (
          <FlashList
            numColumns={2}
            showsVerticalScrollIndicator={false}
            estimatedItemSize={5}
            data={books}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleBookPress(item)}>
                <BookCard
                  days={item.returnDays.toString()}
                  isReturn={true}
                  imgUrl={item.imgUrl}
                  height="64"
                  width="48"
                  isadmin={false}
                />
              </Pressable>
            )}
          />
        )}
      </View>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // Closed by default
        snapPoints={['50%', '90%']}
        enablePanDownToClose={true}
        backgroundStyle={{
          backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
        }}
      >
        <BottomSheetView style={{ flex: 1, padding: 16 }}>
          {selectedBook ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Image
                source={{ uri: selectedBook.imgUrl }}
                className="h-48 w-32 self-center rounded-lg"
                resizeMode="cover"
              />
              <Text
                className="text-2xl font-bold mt-4 text-center"
                style={{ color: headingColor }}
              >
                {selectedBook.title}
              </Text>
              <Text
                className="text-lg mt-2 text-center"
                style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}
              >
                by {selectedBook.author}
              </Text>
              <View className="mt-4">
                <Text className="text-md" style={{ color: headingColor }}>
                  ISBN: <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>{selectedBook.isbn}</Text>
                </Text>
                <Text className="text-md mt-2" style={{ color: headingColor }}>
                  Category: <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>{selectedBook.category}</Text>
                </Text>
                <Text className="text-md mt-2" style={{ color: headingColor }}>
                  Edition: <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>{selectedBook.edition}</Text>
                </Text>
                <Text className="text-md mt-2" style={{ color: headingColor }}>
                  Description: <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>{selectedBook.description}</Text>
                </Text>
                <Text className="text-md mt-2" style={{ color: headingColor }}>
                  Publisher: <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>{selectedBook.publisher}</Text>
                </Text>
                <Text className="text-md mt-2" style={{ color: headingColor }}>
                  Language: <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>{selectedBook.language}</Text>
                </Text>
                <Text className="text-md mt-2" style={{ color: headingColor }}>
                  Quantity: <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>{selectedBook.quantity}</Text>
                </Text>
                <Text className="text-md mt-2" style={{ color: headingColor }}>
                  Max Borrow Days: <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>{selectedBook.maxBorrowDays}</Text>
                </Text>
                <Text className="text-md mt-2" style={{ color: headingColor }}>
                  Return in: <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>{selectedBook.returnDays} days</Text>
                </Text>
              </View>

              {/* Return Button */}
              <View className="my-6 flex items-center">
                <GradientButton id="Return" onPress={handleReturn} />
              </View>
            </ScrollView>
          ) : (
            <Text>No book selected</Text>
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default Books;
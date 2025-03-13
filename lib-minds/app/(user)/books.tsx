import { View, Text, ActivityIndicator, Image, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useRef } from 'react';
import { FlashList } from '@shopify/flash-list';
import BottomSheet, {  BottomSheetScrollView} from '@gorhom/bottom-sheet';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../utils/firebase';
import { doc, getDoc, setDoc, Timestamp, query, where, collection, getDocs } from 'firebase/firestore';
import { useTheme } from '../../ThemeContext';
import { Skeleton } from 'moti/skeleton';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BookCard from '../../components/ui/BookCard';
import GradientButton from '../../components/ui/GradientButtons';
import { RefreshControl } from 'react-native';
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
  const [isReturning, setIsReturning] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [isDamaged, setIsDamaged] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [refreshing, setRefreshing] = useState(false);
  const fetchBorrowedBooks = async (isRefreshing = false) => {
    if (!user) return;
    if (!isRefreshing) setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const borrowedBookIds = userDoc.data()?.borrowedBooks || [];
      if (borrowedBookIds.length === 0) {
        setBooks([]);
        if (!isRefreshing) setLoading(false);
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
      if (!isRefreshing) setLoading(false);
    }
  };
  useEffect(() => {
   
    fetchBorrowedBooks();
  }, [user]);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchBorrowedBooks(true);
    } catch (error) {
      console.error('Error refreshing borrowed books:', error);
    } finally {
      setRefreshing(false);
    }
  };
  const handleBookPress = async (book: Book) => {
    setSelectedBook(book);
    setIsReturning(false);
    setRequestSent(false);
    setIsDamaged(false);

    const requestsQuery = query(
      collection(db, 'requests'),
      where('bookId', '==', book.id),
      where('userId', '==', user?.uid),
      where('status', '==', 'pending'),
      where('requestType', '==', 'return')
    );
    const requestsSnapshot = await getDocs(requestsQuery);
    if (!requestsSnapshot.empty) {
      setRequestSent(true);
      const existingRequest = requestsSnapshot.docs[0].data();
      setIsDamaged(existingRequest.isDamaged || false);
    }

    bottomSheetRef.current?.expand();
  };

  const handleReturn = async () => {
    if (!selectedBook || !user || requestSent) return;

    setIsReturning(true);
    try {
      await setDoc(doc(collection(db, 'requests')), {
        bookId: selectedBook.id,
        userId: user.uid,
        isbn: selectedBook.isbn,
        title: selectedBook.title,
        author: selectedBook.author,
        borrowDays: selectedBook.returnDays,
        status: 'pending',
        requestType: 'return',
        isDamaged,
        createdAt: Timestamp.now(),
      });

      setRequestSent(true);
      alert('Return request submitted! Waiting for admin approval.');
    } catch (error) {
      console.error('Error submitting return request:', error);
      alert('Failed to submit return request.');
    } finally {
      setIsReturning(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <View className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
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
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={headingColor}
    />
  }
/>
          )}
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={['50%', '90%']}
          enablePanDownToClose={true}
          backgroundStyle={{
            backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
          }}
          onClose={() => setRequestSent(false)} 
        >
          <BottomSheetScrollView  className='flex-1 p-4'>
            {selectedBook ? (
              <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
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
                    ISBN:
                    <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                      {selectedBook.isbn}
                    </Text>
                  </Text>
                  <Text className="text-md mt-2" style={{ color: headingColor }}>
                    Category:
                    <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                      {selectedBook.category}
                    </Text>
                  </Text>
                  <Text className="text-md mt-2" style={{ color: headingColor }}>
                    Edition:
                    <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                      {selectedBook.edition}
                    </Text>
                  </Text>
                  <Text className="text-md mt-2" style={{ color: headingColor }} numberOfLines={3}
    ellipsizeMode="tail">
                    Description:
                    <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                      {selectedBook.description}
                    </Text>
                  </Text>
                  <Text className="text-md mt-2" style={{ color: headingColor }}>
                    Publisher:
                    <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                      {selectedBook.publisher}
                    </Text>
                  </Text>
                  <Text className="text-md mt-2" style={{ color: headingColor }}>
                    Language:
                    <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                      {selectedBook.language}
                    </Text>
                  </Text>
                  <Text className="text-md mt-2" style={{ color: headingColor }}>
                    Quantity:
                    <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                      {selectedBook.quantity}
                    </Text>
                  </Text>
                  <Text className="text-md mt-2" style={{ color: headingColor }}>
                    Max Borrow Days:
                    <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                      {selectedBook.maxBorrowDays}
                    </Text>
                  </Text>
                  <Text className="text-md mt-2" style={{ color: headingColor }}>
                    Return in:
                    <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                      {selectedBook.returnDays} days
                    </Text>
                  </Text>
                </View>

                <View className="mt-6">
                  <Text className="text-md font-semibold" style={{ color: headingColor }}>
                    Is the book damaged?
                  </Text>
                  <Pressable
                    onPress={() => !requestSent && setIsDamaged(!isDamaged)}
                    className={`mt-2 p-2 rounded-lg ${isDamaged ? 'bg-red-500' : 'bg-gray-300'}`}
                  >
                    <Text className="text-white text-center">
                      {isDamaged ? 'Yes' : 'No'}
                    </Text>
                  </Pressable>
                </View>

                <View className="my-6 flex-1 items-center">
                  {requestSent ? (
                    <Pressable disabled={true} className="p-2 rounded-lg bg-gray-400">
                      <Text className="text-white text-center">Return Request Sent</Text>
                    </Pressable>
                  ) : isReturning ? (
                    <ActivityIndicator size="large" color={theme === 'dark' ? '#4ade80' : '#22c55e'} />
                  ) : (
                    <GradientButton id="Return" onPress={handleReturn} />
                  )}
                </View>
              </ScrollView>
            ) : (
              <Text>No book selected</Text>
            )}
          </BottomSheetScrollView>
        </BottomSheet>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Books;
import { View, Text, ActivityIndicator, Image, ScrollView, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useRef } from 'react';
import BookCard from '../../components/ui/BookCard';
import { FlashList } from '@shopify/flash-list';
import { db } from '../../utils/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useTheme } from '../../ThemeContext';
import { Skeleton } from 'moti/skeleton';
import BottomSheet, { BottomSheetView, BottomSheetScrollView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GradientButton from '~/components/ui/GradientButtons';
import { StatusBar } from 'expo-status-bar';
import BottomSheetModal from '@gorhom/bottom-sheet';

type Book = {
  id: string;
  imgUrl: string;
  bookStatus: 'available' | 'borrowed' | 'penalty';
  title: string;
  author: string;
  isbn: string;
  category: string;
  edition: string;
  description: string;
  publisher: string;
  language: string;
  maxBorrowDays: number;
  borrowedBy?: string | null;
  borrowedAt?: any | null;
  returnDays?: number;
  returnDate?: any | null;
};

const Library = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';
  const statusbarColor = theme === 'light' ? 'dark' : 'light';
  const bottomSheetRef = useRef<BottomSheet>(null);

  const fetchBooks = async (isRefreshing = false) => {
    if (!isRefreshing) setLoading(true);
    try {
      const booksSnapshot = await getDocs(collection(db, 'books'));
      const booksData = booksSnapshot.docs.map((doc) => {
        const status = doc.data().status;
        const validStatuses = ['available', 'borrowed', 'penalty'] as const;
        if (!validStatuses.includes(status)) {
          console.warn(`Invalid status for book ${doc.id}: ${status}`);
        }
        return {
          id: doc.id,
          imgUrl: doc.data().imgUrl || '',
          bookStatus: validStatuses.includes(status)
            ? (status as 'available' | 'borrowed' | 'penalty')
            : 'available',
          title: doc.data().title || 'Unknown Title',
          author: doc.data().author || 'Unknown Author',
          isbn: doc.data().isbn || 'N/A',
          category: doc.data().category || 'N/A',
          edition: doc.data().edition || 'N/A',
          description: doc.data().description || 'No description available',
          publisher: doc.data().publisher || 'N/A',
          language: doc.data().language || 'N/A',
          maxBorrowDays: doc.data().maxBorrowDays || 14,
          borrowedBy: doc.data().borrowedBy || null,
          borrowedAt: doc.data().borrowedAt || null,
          returnDays: doc.data().returnDays || 0,
          returnDate: doc.data().returnDate || null,
        };
      });

      setBooks(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      if (!isRefreshing) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchBooks(true);
    } catch (error) {
      console.error('Error refreshing books:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleBookPress = async (book: Book) => {
    setSelectedBook(book);
    bottomSheetRef.current?.expand();
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1">
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
            All books
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
    <SafeAreaView className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <GestureHandlerRootView className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
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
            <Text className="px-2 text-2xl font-bold" style={{ color: headingColor }}>
              All books
            </Text>
            {books.length === 0 ? (
              <ScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={headingColor}
                  />
                }
              >
                <Text className="mt-4 text-center text-lg" style={{ color: headingColor }}>
                  No books in the library.
                </Text>
              </ScrollView>
            ) : (
              <FlashList
                estimatedItemSize={6}
                data={books}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                renderItem={({ item }) => (
                  <Pressable onPress={() => handleBookPress(item)}>
                    <BookCard
                      days={item.returnDays?.toString() || '0'}
                      height="64"
                      width="48"
                      imgUrl={item.imgUrl}
                      isReturn={true}
                      isadmin={true}
                      isAdminLibrary={true}
                      bookStatusId={item.bookStatus}
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
        </View>
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetRef}
            index={-1}
            snapPoints={['50%', '90%']}
            enablePanDownToClose={true}
            backgroundStyle={{
              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
            }}
            enableContentPanningGesture={false}
          >
            <BottomSheetView style={{ flex: 1, padding: 16 }} className="flex-1">
              {selectedBook ? (
                <BottomSheetScrollView showsVerticalScrollIndicator={false} className="flex-1">
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
                  <View className="mt-4 flex-1">
                    <Text className="text-md items-center" style={{ color: headingColor }}>
                      <GradientButton id={selectedBook.bookStatus} />
                    </Text>
                    <Text className="text-md mt-2" style={{ color: headingColor }}>
                      ISBN:{' '}
                      <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                        {selectedBook.isbn}
                      </Text>
                    </Text>
                    <Text className="text-md mt-2" style={{ color: headingColor }}>
                      Category:{' '}
                      <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                        {selectedBook.category}
                      </Text>
                    </Text>
                    <Text className="text-md mt-2" style={{ color: headingColor }}>
                      Edition:{' '}
                      <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                        {selectedBook.edition}
                      </Text>
                    </Text>
                    <Text
                      className="text-md mt-2"
                      style={{ color: headingColor }}
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      Description:{' '}
                      <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                        {selectedBook.description}
                      </Text>
                    </Text>
                    <Text className="text-md mt-2" style={{ color: headingColor }}>
                      Publisher:{' '}
                      <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                        {selectedBook.publisher}
                      </Text>
                    </Text>
                    <Text className="text-md mt-2" style={{ color: headingColor }}>
                      Language:{' '}
                      <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                        {selectedBook.language}
                      </Text>
                    </Text>
                    <Text className="text-md mt-2" style={{ color: headingColor }}>
                      Max Borrow Days:{' '}
                      <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                        {selectedBook.maxBorrowDays}
                      </Text>
                    </Text>
                    {selectedBook.bookStatus === 'borrowed' && (
                      <>
                        <Text className="text-md mt-2" style={{ color: headingColor }}>
                          Borrowed By:{' '}
                          <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                            {selectedBook.borrowedBy || 'Unknown'}
                          </Text>
                        </Text>
                        <Text className="text-md mt-2" style={{ color: headingColor }}>
                          Borrowed On:{' '}
                          <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                            {formatTimestamp(selectedBook.borrowedAt)}
                          </Text>
                        </Text>
                        <Text className="text-md mt-2" style={{ color: headingColor }}>
                          Return Days:{' '}
                          <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                            {selectedBook.returnDays ?? 'N/A'}
                          </Text>
                        </Text>
                        <Text className="text-md mt-2" style={{ color: headingColor }}>
                          Return Date:{' '}
                          <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                            {formatTimestamp(selectedBook.returnDate)}
                          </Text>
                        </Text>
                      </>
                    )}
                  </View>
                </BottomSheetScrollView>
              ) : (
                <Text>No book selected</Text>
              )}
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
      <StatusBar style={statusbarColor} />
    </SafeAreaView>
  );
};

export default Library;
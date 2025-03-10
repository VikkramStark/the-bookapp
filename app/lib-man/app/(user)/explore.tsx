import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native'; // Removed ScrollView
import React, { useEffect, useState, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../utils/firebase';
import { useTheme } from '../../ThemeContext';
import { Skeleton } from 'moti/skeleton';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  setDoc,
  getDoc,
  Timestamp,
  arrayRemove,
} from 'firebase/firestore';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GradientButton from '../../components/ui/GradientButtons';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';

type Book = {
  id: string;
  imgUrl: string;
  title: string;
  author: string;
  isbn: string;
  status: 'available' | 'borrowed' | 'holding' | 'penalty';
  isInWishlist: boolean;
  category: string;
  edition: string;
  description: string;
  publisher: string;
  language: string;
  maxBorrowDays: number;
  returnDays?: number;
};

const Explore = () => {
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Slider values
  const progress = useSharedValue(1);
  const min = useSharedValue(1);
  const max = useSharedValue(14);

  useEffect(() => {
    const fetchAvailableBooks = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const booksQuery = query(collection(db, 'books'), where('status', '==', 'available'));
        const booksSnapshot = await getDocs(booksQuery);

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const wishlist = userDoc.data()?.wishlist || [];

        const booksData = booksSnapshot.docs.map((doc) => ({
          id: doc.id,
          imgUrl: doc.data().imgUrl || '',
          title: doc.data().title || 'Unknown Title',
          author: doc.data().author || 'Unknown Author',
          isbn: doc.data().isbn || 'N/A',
          status: doc.data().status,
          isInWishlist: wishlist.includes(doc.id),
          category: doc.data().category || 'N/A',
          edition: doc.data().edition || 'N/A',
          description: doc.data().description || 'No description available',
          publisher: doc.data().publisher || 'N/A',
          language: doc.data().language || 'N/A',
          maxBorrowDays: doc.data().maxBorrowDays || 0,
          returnDays: doc.data().returnDays || 0,
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

  const handleBorrowPress = (book: Book) => {
    setSelectedBook({ ...book, returnDays: book.maxBorrowDays });
    max.value = book.maxBorrowDays;
    progress.value = book.maxBorrowDays;
    bottomSheetRef.current?.expand();
  };

  const handleBorrowConfirm = async () => {
    if (!selectedBook || !user) return;

    try {
      await setDoc(doc(collection(db, 'requests')), {
        bookId: selectedBook.id,
        userId: user.uid,
        isbn: selectedBook.isbn,
        title: selectedBook.title,
        author: selectedBook.author,
        borrowDays: selectedBook.returnDays,
        status: 'pending',
        createdAt: Timestamp.now(),
      });

      alert('Borrow request submitted! An admin will review it.');
      bottomSheetRef.current?.close();
      setSelectedBook(null);
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
        prevBooks.map((b) => (b.id === book.id ? { ...b, isInWishlist: !b.isInWishlist } : b))
      );
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Failed to update wishlist.');
    }
  };

  const handleBorrowDaysChange = (value: number) => {
    if (selectedBook) {
      setSelectedBook((prev) => (prev ? { ...prev, returnDays: Math.round(value) } : null));
    }
  };

  if (loading) {
    return (
      <View className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'} `}>
        <View className="mx-2 flex h-16 w-full items-center justify-center py-2">
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
        <Text className="mx-2 px-2 text-2xl font-bold" style={{ color: headingColor }}>
          Available books
        </Text>
        {theme === 'dark' ? (
          <View className="mx-2 mt-2 flex-1 flex-row justify-center gap-4">
            <Skeleton show={loading} colorMode="light" height={224} width={176} />
            <Skeleton show={loading} colorMode="light" height={224} width={176} />
          </View>
        ) : (
          <View className="mx-2 mt-2 flex-1 flex-row justify-center gap-4">
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

      <View className="mt-4 flex flex-1 px-2">
        <Text className="px-2 text-2xl font-bold" style={{ color: headingColor }}>
          Available books
        </Text>
        {books.length === 0 ? (
          <Text className="mt-4 text-center text-lg" style={{ color: headingColor }}>
            No available books.
          </Text>
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
                      className="m-2 self-end rounded-full bg-white p-2">
                      <Ionicons
                        name={item.isInWishlist ? 'heart' : 'heart-outline'}
                        size={24}
                        color={item.isInWishlist ? 'red' : 'black'}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => handleBorrowPress(item)}
                      className="m-2 rounded-lg border-2 border-black bg-white p-3">
                      <Text>Borrow</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['50%', '90%']}
        enablePanDownToClose={true}
        backgroundStyle={{
          backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
        }}>
        <BottomSheetView style={{ flex: 1 }}>
          {selectedBook ? (
            <View className="p-4" style={{ flexGrow: 1 }}>
              <Image
                source={{ uri: selectedBook.imgUrl }}
                className="h-48 w-32 self-center rounded-lg"
                resizeMode="cover"
              />
              <Text className="mt-4 text-center text-2xl font-bold" style={{ color: headingColor }}>
                {selectedBook.title}
              </Text>
              <Text
                className="mt-2 text-center text-lg"
                style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
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
                  <Text

                    style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
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
                  Max Borrow Days:
                  <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                    {selectedBook.maxBorrowDays}
                  </Text>
                </Text>
              </View>

              {/* Slider for Borrow Days */}
              <View className="mt-6">
                <Text className="text-md font-semibold" style={{ color: headingColor }}>
                  Borrow for: {selectedBook.returnDays ?? 'N/A'} days
                </Text>
                <Slider
                  style={{ height: 50, marginTop: 10 }}
                  progress={progress}
                  minimumValue={min}
                  maximumValue={max}
                  onValueChange={handleBorrowDaysChange}
                  theme={{
                    minimumTrackTintColor: theme === 'dark' ? '#4ade80' : '#22c55e',
                    maximumTrackTintColor: theme === 'dark' ? '#6B7280' : '#D1D5DB',
                  }}
                />
              </View>

              {/* Confirm Borrow Button */}
              <View className="mt-6 flex items-center pb-4">
                <GradientButton id="Borrow" onPress={handleBorrowConfirm} />
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: headingColor }}>No book selected</Text>
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default Explore;

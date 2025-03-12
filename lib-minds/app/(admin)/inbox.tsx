import { View, Text, Image, Pressable, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import GradientButton from '../../components/ui/GradientButtons';
import { db } from '../../utils/firebase';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc, Timestamp } from 'firebase/firestore';
import { useTheme } from '../../ThemeContext';
import { StatusBar } from 'expo-status-bar';

type Request = {
  id: string;
  bookId: string;
  userId: string;
  isbn: string;
  title: string;
  author: string;
  borrowDays: number;
  status: 'pending' | 'accepted' | 'declined';
  requestType: 'borrow' | 'return';
  imgUrl: string;
  isDamaged: boolean; 
};

const DetailsRow = ({ label, value }: { label: string; value: string }) => {
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';
  return (
    <View>
      <Text className="text-xs text-neutral-500">{label}</Text>
      <Text className="text-xl font-semibold" style={{ color: headingColor }}>{value}</Text>
    </View>
  );
};

const Inbox = () => {
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';
  const statusbarColor = theme === 'light' ? 'dark' : 'light';
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const requestsQuery = query(collection(db, 'requests'), where('status', '==', 'pending'));
        const requestsSnapshot = await getDocs(requestsQuery);

        const requestsData = await Promise.all(
          requestsSnapshot.docs.map(async (requestDoc) => {
            const requestData = requestDoc.data();
            const bookDoc = await getDoc(doc(db, 'books', requestData.bookId));
            return {
              id: requestDoc.id,
              bookId: requestData.bookId,
              userId: requestData.userId,
              isbn: requestData.isbn,
              title: requestData.title,
              author: requestData.author,
              borrowDays: requestData.borrowDays,
              status: requestData.status,
              requestType: requestData.requestType || 'borrow',
              imgUrl: bookDoc.exists() ? bookDoc.data().imgUrl : '',
              isDamaged: requestData.isDamaged || false, 
            };
          })
        );

        setRequests(requestsData);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (request: Request) => {
    try {
      if (request.requestType === 'borrow') {
        await updateDoc(doc(db, 'requests', request.id), { status: 'accepted' });
        await updateDoc(doc(db, 'books', request.bookId), {
          status: 'borrowed',
          borrowedBy: request.userId,
          borrowedAt: Timestamp.now(),
          returnDays: request.borrowDays,
        });
        await updateDoc(doc(db, 'users', request.userId), {
          borrowedBooks: arrayUnion(request.bookId),
        });
      } else if (request.requestType === 'return') {
        await updateDoc(doc(db, 'requests', request.id), { status: 'accepted' });
        await updateDoc(doc(db, 'books', request.bookId), {
          status: 'available',
          borrowedBy: null,
          borrowedAt: null,
          returnDays: 0,
          returnDate: null,
          ...(request.isDamaged && { condition: 'damaged' }), 
        });
        await updateDoc(doc(db, 'users', request.userId), {
          borrowedBooks: arrayRemove(request.bookId),
        });
      }

      setRequests((prev) => prev.filter((req) => req.id !== request.id));
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request.');
    }
  };

  const handleDecline = async (request: Request) => {
    try {
      await updateDoc(doc(db, 'requests', request.id), { status: 'declined' });
      setRequests((prev) => prev.filter((req) => req.id !== request.id));
    } catch (error) {
      console.error('Error declining request:', error);
      alert('Failed to decline request.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1">
        <ActivityIndicator size="large" className="mt-4" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
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
            Inbox
          </Text>
          {requests.length === 0 ? (
            <View className="flex h-80 justify-center items-center w-full">
              <Image
                source={require('../../assets/request.png')}
                className="h-full w-auto"
                resizeMode="contain"
              />
              <Text className="mt-4 text-center text-lg" style={{ color: headingColor }}>
                No pending requests.
              </Text>
            </View>
          ) : (
            <FlashList
              estimatedItemSize={4}
              showsVerticalScrollIndicator={false}
              data={requests}
              renderItem={({ item }) => (
                <View className="flex h-max flex-row gap-4 mt-4">
                  <Image
                    source={{ uri: item.imgUrl }}
                    className="h-full w-48 rounded-lg"
                    resizeMode="cover"
                  />
                  <View className="flex">
                    <DetailsRow label="Type" value={item.requestType === 'borrow' ? 'Borrow' : 'Return'} />
                    <DetailsRow label="ISBN" value={item.isbn} />
                    <DetailsRow label="Title" value={item.title} />
                    <DetailsRow label="Author" value={item.author} />
                    <DetailsRow label="Borrow days" value={item.borrowDays.toString()} />
                    {item.requestType === 'return' && (
                      <DetailsRow label="Damaged" value={item.isDamaged ? 'Yes' : 'No'} />
                    )}
                    <View className="flex flex-row gap-2 mt-2">
                      <GradientButton id="Accept" onPress={() => handleAccept(item)} />
                      <GradientButton id="Decline" onPress={() => handleDecline(item)} />
                    </View>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </View>
          <StatusBar style={statusbarColor} />
    </SafeAreaView>
  );
};

export default Inbox;
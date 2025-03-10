import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import GradientButton from '../../components/ui/GradientButtons';
import { db } from '../../utils/firebase';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion ,getDoc,Timestamp} from 'firebase/firestore';
import { useTheme } from '../../ThemeContext';

type Request = {
  id: string;
  bookId: string;
  userId: string;
  isbn: string;
  title: string;
  author: string;
  borrowDays: number;
  status: 'pending' | 'accepted' | 'declined';
  imgUrl: string;
};

const DetailsRow = ({ label, value }: { label: string; value: string }) => {
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';
  return (
    <View>
      <Text className="text-xs text-neutral-500">{label}</Text>
      <Text className="text-xl font-semibold"style={{ color: headingColor }}>{value}</Text>
    </View>
  );
};

const Inbox = () => {
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const requestsQuery = query(
          collection(db, 'requests'),
          where('status', '==', 'pending')
        );
        const requestsSnapshot = await getDocs(requestsQuery);

        // Fetch book images for each request
        const requestsData = await Promise.all(
          requestsSnapshot.docs.map(async (requestDoc) => {
            const bookDoc = await getDoc(doc(db, 'books', requestDoc.data().bookId));
            return {
              id: requestDoc.id,
              bookId: requestDoc.data().bookId,
              userId: requestDoc.data().userId,
              isbn: requestDoc.data().isbn,
              title: requestDoc.data().title,
              author: requestDoc.data().author,
              borrowDays: requestDoc.data().borrowDays,
              status: requestDoc.data().status,
              imgUrl: bookDoc.exists() ? bookDoc.data().imgUrl : '',
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
      // Update the request status
      await updateDoc(doc(db, 'requests', request.id), {
        status: 'accepted',
      });

      // Update the book status and borrower
      await updateDoc(doc(db, 'books', request.bookId), {
        status: 'borrowed',
        borrowedBy: request.userId,
        borrowedAt: Timestamp.now(),
        returnDays: request.borrowDays,
      });

      // Add the book to the user's borrowedBooks
      await updateDoc(doc(db, 'users', request.userId), {
        borrowedBooks: arrayUnion(request.bookId),
      });

      // Remove the request from the list
      setRequests((prev) => prev.filter((req) => req.id !== request.id));
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request.');
    }
  };

  const handleDecline = async (request: Request) => {
    try {
      await updateDoc(doc(db, 'requests', request.id), {
        status: 'declined',
      });

      setRequests((prev) => prev.filter((req) => req.id !== request.id));
    } catch (error) {
      console.error('Error declining request:', error);
      alert('Failed to decline request.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" className="mt-4" />;
  }

  return (
    <View className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
    <View className="mt-4 flex flex-1 px-2">
      <Text className="px-2 text-2xl font-bold" style={{ color: headingColor }}>Inbox</Text>
      {requests.length === 0 ? (
        <Text className="mt-4 text-center text-lg" style={{ color: headingColor }}>No pending requests.</Text>
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
                <DetailsRow label="ISBN" value={item.isbn} />
                <DetailsRow label="Title" value={item.title} />
                <DetailsRow label="Author" value={item.author} />
                <DetailsRow label="Borrow days" value={item.borrowDays.toString()} />
                <View className="flex flex-row gap-2">
                  <Pressable onPress={() => handleAccept(item)}>
                    <GradientButton id="Accept" />
                  </Pressable>
                  <Pressable onPress={() => handleDecline(item)}>
                    <GradientButton id="Decline" />
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
    </View>
  );
};

export default Inbox;
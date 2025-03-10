import { ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import HomeScroll from '../../components/layout/HomeScroll';
import HomeInfoCard from '../../components/layout/HomeInfoCard';
import { db } from '../../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Home = () => {
  const [availableCount, setAvailableCount] = useState(0);
  const [borrowedCount, setBorrowedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookStats = async () => {
      setLoading(true);
      try {
        const availableQuery = query(collection(db, 'books'), where('status', '==', 'available'));
        const borrowedQuery = query(collection(db, 'books'), where('status', '==', 'borrowed'));

        const availableSnapshot = await getDocs(availableQuery);
        const borrowedSnapshot = await getDocs(borrowedQuery);

        setAvailableCount(availableSnapshot.size);
        setBorrowedCount(borrowedSnapshot.size);
      } catch (error) {
        console.error('Error fetching book stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookStats();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" className="mt-4" />;
  }

  return (
    <ScrollView className="">
      <HomeInfoCard
        name="Admin"
        card1text={`Books\navailable`}
        card1no={availableCount.toString()}
        card2no={borrowedCount.toString()}
        card2text={`Books\nborrowed`}
      />
      {/* Uncomment if needed */}
      {/* <HomeScroll title="Owned books" goto="/(admin)/add-books" isBorrowed={true} isAdmin={true} />
      <HomeScroll title="Wishlist" goto="/(admin)/library" isBorrowed={false} isAdmin={true} /> */}
    </ScrollView>
  );
};

export default Home;
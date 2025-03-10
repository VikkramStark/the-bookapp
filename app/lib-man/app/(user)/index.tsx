import { ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import HomeScroll from '../../components/layout/HomeScroll';
import HomeInfoCard from '../../components/layout/HomeInfoCard';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Home = () => {
  const { user } = useAuth();
  const [borrowedCount, setBorrowedCount] = useState(0);
  const [penaltyFee, setPenaltyFee] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        setBorrowedCount(userData?.borrowedBooks?.length || 0);
        setPenaltyFee(userData?.penaltyFee || 0);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" className="mt-4" />;
  }

  return (
    <ScrollView className="" showsVerticalScrollIndicator={false}>
      <HomeInfoCard
        name="Vaishnavi" // Replace with user.displayName if available
        card1text={`Books\nborrowed`}
        card1no={borrowedCount.toString()}
        card2no={penaltyFee.toString()}
        card2text={`Penalty\nfee`}
      />
      <HomeScroll title="Owned books" goto="/(user)/books" isBorrowed={true} isAdmin={false} />
      <HomeScroll title="Wishlist" goto="/(user)/wishlist" isBorrowed={false} isAdmin={false} />
    </ScrollView>
  );
};

export default Home;
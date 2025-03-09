import { ScrollView } from 'react-native';
import HomeScroll from '../../components/layout/HomeScroll';
import HomeInfoCard from '../../components/layout/HomeInfoCard';

export default function Home() {
  return (
    <ScrollView className="" showsVerticalScrollIndicator={false}>
      <HomeInfoCard
        name="Vaishnavi"
        card1text={`Books\nborrowed`}
        card1no="5"
        card2no="1"
        card2text={`Penalty\nfee`}
      />
      <HomeScroll title="Owned books" goto="/(user)/books" isBorrowed={true} isAdmin={false} />
      <HomeScroll title="Wishlist" goto="/(user)/wishlist" isBorrowed={false} isAdmin={false} />
    </ScrollView>
  );
}
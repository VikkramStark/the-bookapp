import { ScrollView } from 'react-native';
import HomeScroll from '../../components/layout/HomeScroll';
import HomeInfoCard from '../../components/layout/HomeInfoCard';

export default function Home() {
  return (
    <ScrollView className="">
      <HomeInfoCard
        name="Admin"
        card1text={`Books\navailable`}
        card1no="1287"
        card2no="91"
        card2text={`Books\nborrowed`}
      />
      {/* <HomeScroll title="Owned books" goto="/(admin)/add-books" isBorrowed={true} isAdmin={true} />
      <HomeScroll title="Wishlist" goto="/(admin)/library" isBorrowed={false} isAdmin={true} /> */}
    </ScrollView>
  );
}
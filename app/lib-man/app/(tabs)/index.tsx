import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native';
import HomeScroll from '~/components/homeScroll';
import HomeInfoCard from '~/components/homeInfoCard';
export default function Home() {
  return (
    <ScrollView className=''>
     <HomeInfoCard name='Vaishnavi' card1text={`Books\nborrowed`} card1no='5' card2no='1' card2text={`Penalty\nfee`} />
      <HomeScroll title="Owned books" goto="/(tabs)/books/" isBorrowed={true} isAdmin={false}/>
      <HomeScroll title="Wishlist" goto="/(tabs)/wishlist "  isBorrowed={false} isAdmin={false}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});

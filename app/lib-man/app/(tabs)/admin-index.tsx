import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native';
import HomeScroll from '~/components/homeScroll';
import HomeInfoCard from '~/components/homeInfoCard';
export default function Home() {
  return (
    <ScrollView className=''>
     <HomeInfoCard name='Admin' card1text={`Books\navailable`} card1no='1287' card2no='91' card2text={`Books\nborrowed`} />
      <HomeScroll title="Owned books" goto="/(tabs)/books/" isBorrowed={true}/>
      <HomeScroll title="Wishlist" goto="/(tabs)/wishlist "  isBorrowed={false}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});

import { Stack } from 'expo-router';

import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native';
import HomeScroll from '~/components/homeScroll';
import { ScreenContent } from '~/components/ScreenContent';
import { Pressable } from 'react-native';
import HomeInfoCard from '~/components/homeInfoCard';
export default function Home() {
  return (
    <ScrollView>

     <HomeInfoCard/>
      <HomeScroll title="Owned books" goto="/(tabs)/books/"/>
      <HomeScroll title="Wishlist" goto="/(tabs)/wishlist " />
    </ScrollView>
  );
}

const styles = StyleSheet.create({});

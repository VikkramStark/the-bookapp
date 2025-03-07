import { Stack } from 'expo-router';

import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native';
import HomeScroll from '~/components/homeScroll';
import { ScreenContent } from '~/components/ScreenContent';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{}} />
      <View className="m-6 flex flex-row items-center justify-between ">
        <View className=" h-44 w-48 rounded-lg bg-blue-400 p-4  ">
          <Text className="text-2xl font-semibold text-white">3</Text>
          <Text className="text-xl font-medium text-white">Books {'\n'}available</Text>
        </View>
        <View className="m-4 h-44 w-48 rounded-lg bg-yellow-400 p-4">
          <Text className="text-2xl font-semibold text-white">0</Text>
          <Text className="text-xl font-medium text-white">Penalty {'\n'}fee</Text>
        </View>
      </View>
      <HomeScroll title="Owned books" />
      <HomeScroll title="Borrowed books" />
    </>
  );
}

const styles = StyleSheet.create({});

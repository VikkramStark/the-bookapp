import { View, Text, Pressable } from "react-native";
import React from "react";
import { Link } from "expo-router";
const HomeInfoCard = () => {
  return (
    <View className="m-6 flex flex-row items-center justify-between ">
    <View className=" h-48 w-48 rounded-lg bg-blue-400 p-4  ">
      <Text className="text-2xl font-semibold text-white">3</Text>
      <Text className="text-xl font-medium text-white">Books {'\n'}borrowed</Text>
      <Pressable className="mt-2 flex items-center justify-center rounded-md bg-white p-4">
        <Link href="/(tabs)/books" className="font-semibold">View all books</Link>
      </Pressable>
    </View>
    <View className="m-4 h-48 w-48 rounded-lg bg-yellow-400 p-4">
      <Text className="text-2xl font-semibold text-white">0</Text>
      <Text className="text-xl font-medium text-white">Penalty {'\n'}fee</Text>
      <Pressable className="mt-2 flex items-center justify-center rounded-md bg-white p-4">
        <Text className="font-semibold">View history</Text>
      </Pressable>
    </View>
  </View>
  );
};

export default HomeInfoCard;

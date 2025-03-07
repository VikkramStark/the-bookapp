import { View, Text } from "react-native";
import React from "react";

const books = () => {
  return (
    <View  className="flex flex-row flex-1 p-4" style={{gap:10}} >
      <View className=" bg-pink-400 rounded-lg w-56 h-56"/>
      {/* <View className=" bg-pink-400 rounded-lg w-56 h-56"/> */}
    </View>
  );
};

export default books;

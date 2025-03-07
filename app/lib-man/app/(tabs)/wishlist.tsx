import { View, Text } from "react-native";
import React from "react";
import BookCard from '~/components/bookCard';
const wishlist = () => {
  return (
    <View className="flex flex-1 flex-row flex-wrap p-4" style={{ gap: 10 }}>
      <BookCard days='17 days' isReturn={false}/>
      
    
    </View>
  );
};

export default wishlist;

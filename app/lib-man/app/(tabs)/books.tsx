import { View, Text, Image } from 'react-native';
import React from 'react';
import BookCard from '~/components/bookCard';
const books = () => {
  return (
    <View className="flex flex-1 flex-row flex-wrap p-4 gap-4">
      <BookCard days='17 days' isReturn={true}/>
      <BookCard days='17 days' isReturn={true}/>
      
    
    </View>
  );
};

export default books;

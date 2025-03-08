import { View, Text, Image, Pressable } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList } from 'react-native';
import {FlashList} from  '@shopify/flash-list'
type bookData = {
  id: string;
  imgUrl: any;
};
const books: bookData[] = [
  {
    id: '1',
    imgUrl:
      'https://www.vandegriftvoice.com/wp-content/uploads/2023/02/35959740-300x463.jpg',
  },
  {
    id: '2',
    imgUrl:
      'https://static01.nyt.com/images/2022/04/28/books/oakImage-1651156428240/oakImage-1651156428240-jumbo.jpg?quality=75&auto=webp',
  },
  {
    id: '3',
    imgUrl:
      'https://static01.nyt.com/images/2022/04/28/books/oakImage-1651156546137/oakImage-1651156546137-jumbo.jpg?quality=75&auto=webp',
  },
  {
    id: '4',
    imgUrl:
      'https://static01.nyt.com/images/2022/04/28/books/oakImage-1651156637409/oakImage-1651156637409-jumbo.jpg?quality=75&auto=webp',
  },
  {
    id: '5',
    imgUrl:
      'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1569423917l/51588815._SX318_SY475_.jpg',
  },
];
const explore = () => {
  return (
    <View className="flex flex-1 px-2 mt-4">
      <Text className='text-2xl font-bold px-2'>Available books</Text>
      <FlashList
      estimatedItemSize={6}
        data={books}
        numColumns={2}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="m-2 overflow-hidden">
            <View className="relative h-64 w-48 ">
              <Image
                source={{ uri: item.imgUrl }}
                className="h-full w-full rounded-lg"
                resizeMode="cover"
              />
              <View className="absolute end-0  flex  h-full justify-between">
                <Ionicons
                  name="heart-sharp"
                  size={24}
                  color="black"
                  className="m-2 self-end rounded-full bg-white p-2"
                />
                <Pressable className="m-2 rounded-lg border-2 border-black bg-white p-3">
                  <Text>Borrow</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default explore;

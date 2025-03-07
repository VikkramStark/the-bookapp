import { View, Text, Image, Pressable } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList } from 'react-native';
type bookData = {
  id: string;
  imgUrl: any;
};
const books: bookData[] = [
  {
    id: '1',
    imgUrl:
      'https://i.huffpost.com/gen/1039678/original.jpg',
  },
  {
    id: '2',
    imgUrl:
      'https://blog-cdn.reedsy.com/directories/gallery/237/large_99efb4a0449f950cda20ec5bddc93267.jpg',
  },
  {
    id: '3',
    imgUrl:
      'https://bukovero.com/wp-content/uploads/2016/07/Harry_Potter_and_the_Cursed_Child_Special_Rehearsal_Edition_Book_Cover.jpg',
  },
  {
    id: '4',
    imgUrl:
      'https://bookdesigners.com/img/paths/img/containers/assets/blog/Screen-Shot-2021-07-27-at-12.54.01-PM.png/bf638307fb959aeed561fba39126b5ef.png/0301c24109115a432480cddf67d840ea.png',
  },
  {
    id: '5',
    imgUrl:
      'https://www.writersdigest.com/.image/t_share/MTcxMDY0NzcxMzIzNTY5NDEz/image-placeholder-title.jpg',
  },
];
const explore = () => {
  return (
    <View className="flex flex-1 px-4">
      <FlatList
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
                <Pressable className="m-2 rounded-lg border-2 border-black bg-white p-4">
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

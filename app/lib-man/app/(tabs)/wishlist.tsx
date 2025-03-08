import { View, Text } from 'react-native';
import React from 'react';
import BookCard from '~/components/bookCard';
import { FlashList } from '@shopify/flash-list';
type bookData = {
  id: string;
  imgUrl: any;
  returnDays: string;
};
const books: bookData[] = [
  {
    id: '1',
    imgUrl: 'https://i.huffpost.com/gen/1039678/original.jpg',
    returnDays: '1 days',
  },
  {
    id: '2',
    imgUrl:
      'https://blog-cdn.reedsy.com/directories/gallery/237/large_99efb4a0449f950cda20ec5bddc93267.jpg',
    returnDays: '11 days',
  },
  {
    id: '3',
    imgUrl:
      'https://bukovero.com/wp-content/uploads/2016/07/Harry_Potter_and_the_Cursed_Child_Special_Rehearsal_Edition_Book_Cover.jpg',
    returnDays: '15 days',
  },
  {
    id: '4',
    imgUrl:
      'https://bookdesigners.com/img/paths/img/containers/assets/blog/Screen-Shot-2021-07-27-at-12.54.01-PM.png/bf638307fb959aeed561fba39126b5ef.png/0301c24109115a432480cddf67d840ea.png',
    returnDays: '32 days',
  },
  {
    id: '5',
    imgUrl:
      'https://www.writersdigest.com/.image/t_share/MTcxMDY0NzcxMzIzNTY5NDEz/image-placeholder-title.jpg',
    returnDays: '55 days',
  },
];
const wishlist = () => {
  return (
    <View className="flex flex-1 px-4 mt-4">
      <Text className='text-2xl font-bold px-2'>Wishlist</Text>
      <FlashList
        showsVerticalScrollIndicator={false}
        data={books}
        numColumns={2}
        estimatedItemSize={6}
        renderItem={({ item }) => (
            <BookCard days={item.returnDays} isReturn={false} imgUrl={item.imgUrl}  height='64' width='48'/>
        )}
      />
    </View>
  );
};

export default wishlist;

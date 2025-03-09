import { View, Text } from 'react-native';
import React from 'react';
import BookCard from '../../components/ui/BookCard';
import { FlashList } from '@shopify/flash-list';

type bookData = {
  id: string;
  imgUrl: any;
  returnDays: string;
};

const BorrowedBooks: bookData[] = [
  {
    id: '1',
    imgUrl: 'https://www.vandegriftvoice.com/wp-content/uploads/2023/02/24044596-300x450.jpg',
    returnDays: '1 days',
  },
  {
    id: '2',
    imgUrl: 'https://www.vandegriftvoice.com/wp-content/uploads/2023/02/10210-300x472.jpg',
    returnDays: '11 days',
  },
  {
    id: '3',
    imgUrl: 'https://www.vandegriftvoice.com/wp-content/uploads/2023/02/35224992-300x455.jpg',
    returnDays: '15 days',
  },
  {
    id: '4',
    imgUrl: 'https://www.vandegriftvoice.com/wp-content/uploads/2023/02/41057294-300x453.jpg',
    returnDays: '32 days',
  },
  {
    id: '5',
    imgUrl: 'https://www.vandegriftvoice.com/wp-content/uploads/2023/02/56732449-300x450.jpg',
    returnDays: '55 days',
  },
];

const Books = () => {
  return (
    <View className="flex flex-1 px-2 mt-4">
      <Text className="text-2xl font-bold px-2">Borrowed books</Text>
      <FlashList
        numColumns={2}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={5}
        data={BorrowedBooks}
        renderItem={({ item }) => (
          <BookCard
            days={item.returnDays}
            isReturn={true}
            imgUrl={item.imgUrl}
            height="64"
            width="48"
            isadmin={false}
          />
        )}
      />
    </View>
  );
};

export default Books;
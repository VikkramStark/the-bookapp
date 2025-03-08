import { View, Text } from 'react-native';
import React from 'react';
import BookCard from '~/components/bookCard';
import { FlashList } from '@shopify/flash-list';
type bookStatusType = 'available' | 'penalty' | 'holding';
type librarydataType = {
  id: string;
  imgUrl: string;
  bookStatus: bookStatusType;
};
const LibraryData: librarydataType[] = [
  {
    id: '1',
    imgUrl: 'https://m.media-amazon.com/images/I/81tzVx79VBL._AC_UF1000,1000_QL80_.jpg',
    bookStatus: 'available',
  },
  {
    id: '2',
    imgUrl: 'https://m.media-amazon.com/images/I/61F-bq53kOL.jpg',
    bookStatus: 'available',
  },
  {
    id: '3',
    imgUrl:
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/561b1483830519.5d48f1ff93014.jpg',
    bookStatus: 'penalty',
  },
  {
    id: '4',
    imgUrl: 'https://m.media-amazon.com/images/I/91oKPlFZVlL._UF1000,1000_QL80_.jpg',
    bookStatus: 'holding',
  },
  {
    id: '5',
    imgUrl:
      'https://images.squarespace-cdn.com/content/v1/573bf9761bbee0b32db4e9ff/1606730424152-JWX44X26UAB841Q3CVXE/Copy+of+Mermaid+Story+book+Childrens+Book+Cover.jpgg',
    bookStatus: 'available',
  },
  {
    id: '6',
    imgUrl: 'https://blog-cdn.reedsy.com/uploads/2019/12/stargazing-705x1024.jpg',
    bookStatus: 'penalty',
  },
];

const AdminLibrary = () => {
  return (
    <View className="mt-4 px-2 flex flex-1">
      <Text className="px-2 text-2xl font-bold">All books</Text>
      <FlashList
        estimatedItemSize={6}
        data={LibraryData}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        renderItem={({ item }) => (
          <BookCard
            days="4"
            height="64"
            width="48"
            imgUrl={item.imgUrl}
            isReturn={true}
            isadmin={true}
            isAdminLibrary={true}
            bookStatusId={item.bookStatus}
          />
        )}
      />
    </View>
  );
};

export default AdminLibrary;

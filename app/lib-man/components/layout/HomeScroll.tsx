import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native';
import { Link, Href } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import BookCard from '../ui/BookCard';
type homeScrollProps = {
  title: string;
  goto: Href;
  isBorrowed: boolean;
  isAdmin: boolean;
};
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
const books: bookData[] = [
  {
    id: '1',
    imgUrl: 'https://i.huffpost.com/gen/1039678/original.jpg',
    returnDays: '5 days',
  },
  {
    id: '2',
    imgUrl:
      'https://blog-cdn.reedsy.com/directories/gallery/237/large_99efb4a0449f950cda20ec5bddc93267.jpg',
    returnDays: '9 days',
  },
  {
    id: '3',
    imgUrl:
      'https://bukovero.com/wp-content/uploads/2016/07/Harry_Potter_and_the_Cursed_Child_Special_Rehearsal_Edition_Book_Cover.jpg',
    returnDays: '17 days',
  },
  {
    id: '4',
    imgUrl:
      'https://bookdesigners.com/img/paths/img/containers/assets/blog/Screen-Shot-2021-07-27-at-12.54.01-PM.png/bf638307fb959aeed561fba39126b5ef.png/0301c24109115a432480cddf67d840ea.png',
    returnDays: '21 days',
  },
  {
    id: '5',
    imgUrl:
      'https://www.writersdigest.com/.image/t_share/MTcxMDY0NzcxMzIzNTY5NDEz/image-placeholder-title.jpg',
    returnDays: '42 days',
  },
];
export default function HomeScroll({ goto, title, isBorrowed, isAdmin }: homeScrollProps) {
  const booksdata = isBorrowed ? BorrowedBooks : books;
  return (
    <View className="mb-4">
      <View className="flex flex-row justify-between px-6 ">
        <Text className="text-xl font-semibold">{title}</Text>
        <Link href={goto} className="pl-4 text-neutral-600">
          view all
        </Link>
      </View>
      <FlashList
        data={booksdata}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={5}
        renderItem={({ item }) => (
          <BookCard
            days={item.returnDays}
            isReturn={isBorrowed}
            imgUrl={item.imgUrl}
            height="56"
            width="40"
            isadmin={isAdmin}
          />
        )}
      />
    </View>
  );
}

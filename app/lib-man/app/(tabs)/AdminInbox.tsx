import { View, Text, Image, Pressable } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { FlashList } from '@shopify/flash-list';
type ButtonId = 'Accept' | 'Decline';
type GradientbuttonProps = {
  id: ButtonId;
};
function Gradientbutton({ id }: GradientbuttonProps) {
  const buttonData = [
    {
      id: 'Decline',
      colours: ['#f87171', '#ef4444', '#dc2626'],
      text: 'Decline',
    },
    {
      id: 'Accept',
      colours: ['#4ade80', '#22c55e', '#16a34a'],
      text: 'Accept',
    },
  ];
  const button = buttonData.find((item) => item.id == id);
  return (
    <View className="overflow-hidden rounded-md">
      <LinearGradient className=" p-4" colors={button?.colours}>
        <Text className="rounded-lg text-green-50">{button?.text}</Text>
      </LinearGradient>
    </View>
  );
}

const DetailsRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <View>
      <Text className="text-xs text-neutral-500">{label}</Text>
      <Text className="text-xl font-semibold text-black">{value}</Text>
    </View>
  );
};

const requestData = [
  {
    id: '1',
    imgUrl: 'https://www.vandegriftvoice.com/wp-content/uploads/2023/02/41057294-300x453.jpg',
    details: {
      isbn: '1788',
      title: 'Normal people',
      author: 'Sally Rooney',
      borrowdays: '10',
    },
  },
  {
    id: '2',
    imgUrl: 'https://www.vandegriftvoice.com/wp-content/uploads/2023/02/24044596-300x450.jpg',
    details: {
      isbn: '1234',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      borrowdays: '15',
    },
  },
];
const AdminInbox = ({ imgUrl, details }: { imgUrl: string; details: string[] }) => {
  return (
    <View className="mt-4 flex flex-1 px-2">
      <Text className="px-2 text-2xl font-bold">Inbox</Text>
      <FlashList
        estimatedItemSize={4}
        showsVerticalScrollIndicator={false}
        data={requestData}
        renderItem={({ item }) => (
          <View className="flex h-max flex-row gap-4 mt-4">
            <Image
              source={{ uri: item.imgUrl }}
              className="h-full w-48 rounded-lg"
              resizeMode="cover"
            />
            <View className="flex ">
              <DetailsRow label="ISBN" value={item.details.isbn} />
              <DetailsRow label="Title" value={item.details.title} />
              <DetailsRow label="Author" value={item.details.author} />
              <DetailsRow label="Borrow days" value={item.details.borrowdays} />

              <View className="flex flex-row gap-2">
                <Gradientbutton id="Accept" />
                <Gradientbutton id="Decline" />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default AdminInbox;

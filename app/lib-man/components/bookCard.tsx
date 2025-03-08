import { View, Text, Image } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
type ButtonId = 'penalty' | 'available' | 'holding';
type BookCardProps = {
  isReturn: boolean;
  days: string;
  imgUrl: string;
  height: string;
  width: string;
  isadmin: boolean;
  isAdminLibrary?: boolean;
  bookStatusId?:ButtonId
};
type GradientbuttonProps = {
  id: ButtonId;
};
function Gradientbutton({ id }: GradientbuttonProps) {
  const buttonData = [
    {
      id: 'penalty',
      colours: ['#f87171', '#ef4444', '#dc2626'],
      text: 'Penalty',
    },
    {
      id: 'available',
      colours: ['#4ade80', '#22c55e', '#16a34a'],
      text: 'Available',
    },
    {
      id: 'holding',
      colours: ['#facc15', '#eab308', '#ca8a04'],
      text: 'Holding',
    },
  ];
  const button = buttonData.find((item) => item.id == id);
  return (
    <View className="overflow-hidden rounded-md">
      <LinearGradient className=" p-3" colors={button?.colours}>
        <Text className="rounded-lg text-green-50">{button?.text}</Text>
      </LinearGradient>
    </View>
  );
}

const BookCard = ({
  isReturn,
  days,
  imgUrl,
  height,
  width,
  isadmin,
  isAdminLibrary = false,
  bookStatusId="available"
}: BookCardProps) => {
  return (
    <View className={`h-${height} w-${width} m-2 overflow-hidden rounded-lg `}>
      <Image source={{ uri: imgUrl }} className="h-full w-full" resizeMode="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        className="absolute flex h-full w-full justify-end p-4">
        {isadmin ? (
          isAdminLibrary ? (
            <View className=" absolute bottom-0 right-0 m-2 rounded-lg">
              <Gradientbutton id={bookStatusId} />
            </View>
          ) : isReturn ? (
            <Text className="text-xl text-white">returns in </Text>
          ) : (
            <Text className="text-xl text-white">available in</Text>
          )
        ) : isReturn ? (
          <Text className="text-xl text-white">return in </Text>
        ) : (
          <Text className="text-xl text-white">available in</Text>
        )}
{!isAdminLibrary &&         <Text className="text-2xl font-semibold text-white">{days}</Text>}

      </LinearGradient>
    </View>
  );
};

export default BookCard;

import { View, Text, Image } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from './GradientButtons';

type ButtonId = 'penalty' | 'available' | 'borrowed';

type BookCardProps = {
  isReturn: boolean;
  days: string;
  imgUrl: string;
  height: string;
  width: string;
  isadmin: boolean;
  isAdminLibrary?: boolean;
  bookStatusId?: ButtonId;
};

const BookCard = ({
  isReturn,
  days,
  imgUrl,
  height,
  width,
  isadmin,
  isAdminLibrary = false,
  bookStatusId = 'available', // Default value
}: BookCardProps) => {
  // Validate bookStatusId
  const validStatuses: ButtonId[] = ['penalty', 'available', 'borrowed'];
  const normalizedStatus: ButtonId = validStatuses.includes(bookStatusId)
    ? bookStatusId
    : 'available'; // Fallback to 'available' if invalid

  if (height === '56' && width === '40') {
    return (
      <View className="h-56 w-40 m-2 overflow-hidden rounded-lg">
        <Image source={{ uri: imgUrl }} className="h-full w-full" resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          className="absolute flex h-full w-full justify-end p-4"
        >
          {isadmin ? (
            isAdminLibrary ? (
              <View className="absolute bottom-0 right-0 m-2 rounded-lg">
                <GradientButton id={normalizedStatus} />
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
          {!isAdminLibrary && <Text className="text-2xl font-semibold text-white">{days}</Text>}
        </LinearGradient>
      </View>
    );
  } else if (height === '64' && width === '48') {
    return (
      <View className="h-64 w-48 m-2 overflow-hidden rounded-lg">
        <Image source={{ uri: imgUrl }} className="h-full w-full" resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          className="absolute flex h-full w-full justify-end p-4"
        >
          {isadmin ? (
            isAdminLibrary ? (
              <View className="absolute bottom-0 right-0 m-2 rounded-lg">
                <GradientButton id={normalizedStatus} />
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
          {!isAdminLibrary && <Text className="text-2xl font-semibold text-white">{days}</Text>}
        </LinearGradient>
      </View>
    );
  }
  return null; // Fallback if height/width don't match
};

export default BookCard;
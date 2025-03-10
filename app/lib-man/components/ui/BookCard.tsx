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
  onAvailablePress?: () => void;
};

const BookCard = ({
  isReturn,
  days,
  imgUrl,
  height,
  width,
  isadmin,
  isAdminLibrary = false,
  bookStatusId = 'available',
  onAvailablePress,
}: BookCardProps) => {
  const validStatuses: ButtonId[] = ['penalty', 'available', 'borrowed'];
  const normalizedStatus: ButtonId = validStatuses.includes(bookStatusId)
    ? bookStatusId
    : 'available';

  if (height === '56' && width === '40') {
    return (
      <View className="h-56 w-40 m-2 overflow-hidden rounded-lg">
        <Image source={{ uri: imgUrl }} className="h-full w-full" resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          className="absolute flex h-full w-full justify-end p-4"
        >
          {isadmin ? (
            isAdminLibrary || (!isReturn && normalizedStatus === 'available') ? (
              <View className="absolute bottom-0 right-0 m-2 rounded-lg">
                <GradientButton id={normalizedStatus} />
              </View>
            ) : isReturn ? (
              <View className="flex flex-col items-end">
                <Text className="text-xl text-white">returns in</Text>
                <Text className="text-2xl font-semibold text-white">{days} Days</Text>
              </View>
            ) : (
              <View className="flex flex-col items-end">
                <Text className="text-xl text-white">available in</Text>
                <Text className="text-2xl font-semibold text-white">{days} Days</Text>
              </View>
            )
          ) : days === '0' ? (
            <View className="absolute bottom-0 right-0 m-2 rounded-lg">
              <GradientButton id="available" onPress={onAvailablePress} />
            </View>
          ) : isReturn ? (
            <View className="flex flex-col items-end">
              <Text className="text-xl text-white">return in</Text>
              <Text className="text-2xl font-semibold text-white">{days} Days</Text>
            </View>
          ) : (
            <View className="flex flex-col items-end">
              <Text className="text-xl text-white">available in</Text>
              <Text className="text-2xl font-semibold text-white">{days} Days</Text>
            </View>
          )}
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
            isAdminLibrary || (!isReturn && normalizedStatus === 'available') ? (
              <View className="absolute bottom-0 right-0 m-2 rounded-lg">
                <GradientButton id={normalizedStatus} />
              </View>
            ) : isReturn ? (
              <View className="flex flex-col items-end">
                <Text className="text-xl text-white">returns in</Text>
                <Text className="text-2xl font-semibold text-white">{days} Days</Text>
              </View>
            ) : (
              <View className="flex flex-col items-end">
                <Text className="text-xl text-white">available in</Text>
                <Text className="text-2xl font-semibold text-white">{days} Days</Text>
              </View>
            )
          ) : days === '0' ? (
            <View className="absolute bottom-0 right-0 m-2 rounded-lg">
              <GradientButton id="available" onPress={onAvailablePress} />
            </View>
          ) : isReturn ? (
            <View className="flex flex-col items-end">
              <Text className="text-xl text-white">return in</Text>
              <Text className="text-2xl font-semibold text-white">{days} Days</Text>
            </View>
          ) : (
            <View className="flex flex-col items-end">
              <Text className="text-xl text-white">available in</Text>
              <Text className="text-2xl font-semibold text-white">{days} Days</Text>
            </View>
          )}
        </LinearGradient>
      </View>
    );
  }
  return null;
};

export default BookCard;
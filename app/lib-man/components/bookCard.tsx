import { View, Text, Image } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
type BookCardProps={
    isReturn: boolean,
    days: string
}
const BookCard = (props:BookCardProps) => {
  return (
<>
      <View className="  h-64 w-48 overflow-hidden rounded-lg">
        <Image
          source={require('../assets/normalpeople.png')}
          className="h-full w-full"
          resizeMode="cover"
        />
                <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          className="absolute flex h-full w-full justify-end p-4">
         {props.isReturn? (<Text className="text-xl text-white">return in </Text>)
         : (<Text className="text-xl text-white">available </Text>)}
          <Text className="text-2xl font-semibold text-white">{props.days}</Text>
        </LinearGradient>
      </View></>
  );
};

export default BookCard;

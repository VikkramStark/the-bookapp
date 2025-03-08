import { View, Text, Image } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
type BookCardProps={
    isReturn: boolean,
    days: string,
    imgUrl:string,
    height:string,
    width:string

}
const BookCard = ({isReturn,days,imgUrl, height,width}:BookCardProps) => {
  return (
      <View className={`h-${height} w-${width} overflow-hidden rounded-lg m-2`}>
        <Image
          source={{uri:imgUrl}}
          className="h-full w-full"
          resizeMode="cover"
        />
                <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          className="absolute flex h-full w-full justify-end p-4">
         {isReturn? (<Text className="text-xl text-white">return in </Text>)
         : (<Text className="text-xl text-white">available in</Text>)}
          <Text className="text-2xl font-semibold text-white">{days}</Text>
        </LinearGradient>
      </View>
  );
};

export default BookCard;

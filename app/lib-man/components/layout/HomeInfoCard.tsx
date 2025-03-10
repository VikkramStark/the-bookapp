import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { useTheme } from '../../ThemeContext';
type infoCardProps={
  name:string,
  card1text:string,
  card1no:string,
  card2text:string,
  card2no:string,
  isAdmin:boolean

}
const HomeInfoCard = ({name,card1text,card1no,card2text,card2no,isAdmin}:infoCardProps) => {
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';
  return (
    <View className="mt-4 flex  flex-1">
      <Text className="px-2 text-2xl font-bold" style={{ color: headingColor }}>
        Hello <Text className="text-amber-400" >{name}</Text>
      </Text>
      <View className="flex px-4 flex-row items-center justify-center my-4 gap-2">
        <View className=" h-48 w-52 rounded-lg bg-blue-400 p-4  ">
          <Text className="text-2xl font-semibold text-white">{card1no}</Text>
          <Text className="text-xl font-medium text-white">{card1text}</Text>
          <Pressable className="mt-2 flex items-center justify-center rounded-md bg-white p-4">
            {isAdmin?(<Link href="/(admin)/library" className="font-semibold">
              View all books
            </Link>):(<Link href="/(user)/books" className="font-semibold">
              View all books
            </Link>)}
          </Pressable>
        </View>
        <View className="h-48 w-52 rounded-lg bg-yellow-400 p-4">
          <Text className="text-2xl font-semibold text-white">{card2no}</Text>
          <Text className="text-xl font-medium text-white">{card2text}</Text>
          <Pressable className="mt-2 flex items-center justify-center rounded-md bg-white p-4">
            <Text className="font-semibold">View history</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default HomeInfoCard;

import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { useTheme } from '../../ThemeContext';
type infoCardProps = {
  name: string;
  card1text: string;
  card1no: string;
  card2text: string;
  card2no: string;
  isAdmin: boolean;
};
const HomeInfoCard = ({ name, card1text, card1no, card2text, card2no, isAdmin }: infoCardProps) => {
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';
  return (
    <View className="mt-4 flex  flex-1">
      <Text className="px-2 text-2xl font-bold" style={{ color: headingColor }}>
        Hello <Text className="text-[#1A9AAF]">{name}</Text>
      </Text>
      <View className="my-4 flex flex-row items-center justify-center gap-2 px-4">
        <View className=" h-48 w-52 rounded-lg bg-[#1A9AAF] p-4  ">
          <Text className="text-2xl font-semibold text-white">{card1no}</Text>
          <Text className="text-xl font-medium text-white">{card1text}</Text>

          {isAdmin ? (
            <Link href="/(admin)/library" asChild>
              <Pressable className="mt-2 flex items-center justify-center rounded-md bg-white p-4">
                
                <Text className="font-semibold"> View all books</Text>
              </Pressable>
            </Link>
          ) : (
            <Link href="/(user)/books" asChild>
              <Pressable className="mt-2 flex items-center justify-center rounded-md bg-white p-4">
                
                <Text className="font-semibold"> View all books</Text>
              </Pressable>
            </Link>
          )}
        </View>
        <View className={`h-48 w-52 rounded-lg  p-4 ${theme === 'dark' ? 'bg-white' : 'bg-[#0e0e0e]'}`}>
          <Text className={`text-2xl font-semibold ${theme === 'dark' ? 'text-black' : 'text-white'}`}>{card2no}</Text>
          <Text className={`text-xl font-medium  ${theme === 'dark' ? 'text-black' : 'text-white'}`}>{card2text}</Text>
          {isAdmin ? (
            <Link href="/(admin)/library" asChild>
              <Pressable className={`mt-2 flex items-center justify-center rounded-md  p-4 ${theme === 'dark' ? 'bg-[#0e0e0e]' : 'bg-white'}`} >
                <Text className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#0e0e0e]'}`}> View all books</Text>
              </Pressable>
            </Link>
          ) : (
            <Link href="/(user)/wishlist" asChild>
              <Pressable className={`mt-2 flex items-center justify-center rounded-md  p-4 ${theme === 'dark' ? 'bg-[#0e0e0e]' : 'bg-white'}`} >
                
                <Text               className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#0e0e0e]'}`} > View history</Text>
              </Pressable>
            </Link>
          )}
        </View>
      </View>
    </View>
  );
};

export default HomeInfoCard;

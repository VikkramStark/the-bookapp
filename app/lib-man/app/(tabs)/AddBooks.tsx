import { View, Text } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Pressable } from 'react-native';
import { TextInput } from 'react-native';
const AddBooks = () => {
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
    } else {
      alert('You did not select any image.');
    }
  };
  return (
    <View className="mt-4 flex flex-1 px-2">
      <View className="mb-3 flex flex-row  items-center ">
        <Ionicons name="chevron-back" size={24} color="black" />
        <Text className="px-2 text-xl font-semibold">back</Text>
      </View>
      <Text className="px-2 text-2xl font-bold">Add book</Text>
      <View className='flex flex-row gap-2 '>
      <Pressable onPress={pickImageAsync}>
        <View className="h-52 w-48 rounded-lg bg-gray-400 flex justify-center items-center">
        <Ionicons name="image" size={24} color="black" />
        </View>
      </Pressable>
      <View className='flex flex-col w-full '>
<TextInput className='w-auto h-10 border-2 border-black rounded-md'/>
      </View>
      </View>
    </View>
  );
};

export default AddBooks;

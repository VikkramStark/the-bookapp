import { View, Text, Image, Pressable, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../../utils/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../ThemeContext';
import app from '../../utils/firebase';
import { StatusBar } from 'expo-status-bar';

const AddBooks = () => {
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';
  const statusbarColor = theme === 'light' ? 'dark' : 'light';
  const [image, setImage] = useState<string | null>(null);
  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [edition, setEdition] = useState('');
  const [description, setDescription] = useState('');
  const [publisher, setPublisher] = useState('');
  const [language, setLanguage] = useState('');
  const [maxBorrowDays, setMaxBorrowDays] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  const handleAddBook = async () => {
    if (
      !isbn ||
      !title ||
      !author ||
      !category ||
      !edition ||
      !description ||
      !publisher ||
      !language ||
      !maxBorrowDays ||
      !image
    ) {
      alert('Please fill in all fields and select an image.');
      return;
    }

    const maxBorrowDaysNum = parseInt(maxBorrowDays, 10);
    if ( isNaN(maxBorrowDaysNum) || maxBorrowDaysNum <= 0) {
      alert('Max borrow days must be positive numbers.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'books'), {
        isbn,
        title,
        author,
        category,
        edition,
        description,
        publisher,
        language,
        maxBorrowDays: maxBorrowDaysNum,
        imgUrl: image, 
        status: 'available',
        borrowedBy: null,
        borrowedAt: null,
        returnDays: 0,
      });

      alert('Book added successfully!');
      setIsbn('');
      setTitle('');
      setAuthor('');
      setCategory('');
      setEdition('');
      setDescription('');
      setPublisher('');
      setLanguage('');
      setMaxBorrowDays('');
      setImage(null);
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <SafeAreaView className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
    <KeyboardAvoidingView className={`flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View className="flex h-16 w-full items-center justify-center py-2">
                {theme === 'dark' ? (
                  <Image
                    source={require('../../assets/logo-white-side.png')}
                    className="h-full w-auto"
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require('../../assets/logo-black-side.png')}
                    className="h-full w-auto"
                    resizeMode="contain"
                  />
                )}
              </View>
      
      <ScrollView className="flex-1 mx-2 " showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} className="mb-4 mt-2 flex flex-row items-center">
          <Ionicons name="chevron-back" size={24}  style={{ color: headingColor }} />
          <Text className="px-2 text-xl font-semibold" style={{ color: headingColor }}>Back</Text>
        </Pressable>
        <Text className="px-2 text-2xl font-bold" style={{ color: headingColor }}>Add Book</Text>
        <View className="flex flex-row gap-2 mt-4">
          <Pressable onPress={pickImageAsync} className="flex-1">
            <View className="h-64 w-48 rounded-lg bg-gray-400 flex justify-center items-center">
              {image ? (
                <Image source={{ uri: image }} className="h-full w-full rounded-lg" resizeMode="cover" />
              ) : (
                <Ionicons name="image" size={24} color="black" />
              )}
            </View>
          </Pressable>
          <View className="flex-1 flex-col gap-3">
            <TextInput
              className={`border-2  rounded-md p-2 ${theme === 'dark' ? 'border-white placeholder:text-gray-500 text-white' : 'border-black'}`}
              placeholder="ISBN"
              value={isbn}
              onChangeText={setIsbn}
            />
            <TextInput
              className={`border-2  rounded-md p-2 ${theme === 'dark' ? 'border-white placeholder:text-gray-500 text-white' : 'border-black'}`}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              className={`border-2  rounded-md p-2 ${theme === 'dark' ? 'border-white placeholder:text-gray-500 text-white' : 'border-black'}`}
              placeholder="Author"
              value={author}
              onChangeText={setAuthor}
            />
            <TextInput
              className={`border-2  rounded-md p-2 ${theme === 'dark' ? 'border-white placeholder:text-gray-500 text-white' : 'border-black'}`}
              placeholder="Category"
              value={category}
              onChangeText={setCategory}
            />
            <TextInput
              className={`border-2  rounded-md p-2 ${theme === 'dark' ? 'border-white placeholder:text-gray-500 text-white' : 'border-black'}`}
              placeholder="Edition"
              value={edition}
              onChangeText={setEdition}
            />
          </View>
        </View>
        <View className="mt-4 flex-col gap-3 ">
          <TextInput
className={`border-2 h-24 rounded-md p-2 ${theme === 'dark' ? 'border-white placeholder:text-gray-500 text-white' : 'border-black'}`}

            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
          />
          <TextInput
            className={`border-2  rounded-md p-2 ${theme === 'dark' ? 'border-white placeholder:text-gray-500 text-white' : 'border-black'}`}
            placeholder="Publisher"
            value={publisher}
            onChangeText={setPublisher}
          />
          <TextInput
            className={`border-2  rounded-md p-2 ${theme === 'dark' ? 'border-white placeholder:text-gray-500 text-white' : 'border-black'}`}
            placeholder="Language"
            value={language}
            onChangeText={setLanguage}
          />

          <TextInput
            className={`border-2  rounded-md p-2 ${theme === 'dark' ? 'border-white placeholder:text-gray-500 text-white' : 'border-black'}`}
            placeholder="Max borrow days"
            value={maxBorrowDays}
            onChangeText={setMaxBorrowDays}
            keyboardType="numeric"
          />
        </View>
        <Pressable
          className="mt-6  flex items-center rounded-full border-2 border-black bg-amber-400 p-4"
          onPress={handleAddBook}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#000000" /> : <Text className="font-bold">Add Book</Text>}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
        <StatusBar style={statusbarColor} />
    </SafeAreaView>
  );
};

export default AddBooks;
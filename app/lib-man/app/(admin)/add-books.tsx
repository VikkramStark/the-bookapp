import { View, Text, Image, Pressable, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../../utils/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';

const AddBooks = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [edition, setEdition] = useState('');
  const [description, setDescription] = useState('');
  const [publisher, setPublisher] = useState('');
  const [language, setLanguage] = useState('');
  const [quantity, setQuantity] = useState('');
  const [maxBorrowDays, setMaxBorrowDays] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    // Validate all required fields
    if (
      !isbn ||
      !title ||
      !author ||
      !category ||
      !edition ||
      !description ||
      !publisher ||
      !language ||
      !quantity ||
      !maxBorrowDays ||
      !image
    ) {
      alert('Please fill in all fields and select an image.');
      return;
    }

    // Validate quantity and maxBorrowDays as positive numbers
    const quantityNum = parseInt(quantity, 10);
    const maxBorrowDaysNum = parseInt(maxBorrowDays, 10);
    if (isNaN(quantityNum) || isNaN(maxBorrowDaysNum) || quantityNum <= 0 || maxBorrowDaysNum <= 0) {
      alert('Quantity and Max borrow days must be positive numbers.');
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
        quantity: quantityNum,
        maxBorrowDays: maxBorrowDaysNum,
        imgUrl: image, // TODO: Replace with Firebase Storage URL
        status: 'available',
        borrowedBy: null,
        borrowedAt: null,
        returnDays: 0,
      });

      alert('Book added successfully!');
      // Reset form
      setIsbn('');
      setTitle('');
      setAuthor('');
      setCategory('');
      setEdition('');
      setDescription('');
      setPublisher('');
      setLanguage('');
      setQuantity('');
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
    <KeyboardAvoidingView className="mx-2 flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} className="mb-4 mt-2 flex flex-row items-center">
          <Ionicons name="chevron-back" size={24} color="black" />
          <Text className="px-2 text-xl font-semibold">Back</Text>
        </Pressable>
        <Text className="px-2 text-2xl font-bold">Add Book</Text>
        <View className="flex flex-row gap-2 mt-4">
          <Pressable onPress={pickImageAsync} className="flex-1">
            <View className="h-60 w-48 rounded-lg bg-gray-400 flex justify-center items-center">
              {image ? (
                <Image source={{ uri: image }} className="h-full w-full rounded-lg" resizeMode="cover" />
              ) : (
                <Ionicons name="image" size={24} color="black" />
              )}
            </View>
          </Pressable>
          <View className="flex-1 flex-col gap-2">
            <TextInput
              className="border-2 border-black rounded-md p-2"
              placeholder="ISBN"
              value={isbn}
              onChangeText={setIsbn}
            />
            <TextInput
              className="border-2 border-black rounded-md p-2"
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              className="border-2 border-black rounded-md p-2"
              placeholder="Author"
              value={author}
              onChangeText={setAuthor}
            />
            <TextInput
              className="border-2 border-black rounded-md p-2"
              placeholder="Category"
              value={category}
              onChangeText={setCategory}
            />
            <TextInput
              className="border-2 border-black rounded-md p-2"
              placeholder="Edition"
              value={edition}
              onChangeText={setEdition}
            />
          </View>
        </View>
        <View className="mt-4 flex-col gap-2 ">
          <TextInput
            className="h-24 border-2 border-black rounded-md p-2"
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
          />
          <TextInput
            className="border-2 border-black rounded-md p-2"
            placeholder="Publisher"
            value={publisher}
            onChangeText={setPublisher}
          />
          <TextInput
            className="border-2 border-black rounded-md p-2"
            placeholder="Language"
            value={language}
            onChangeText={setLanguage}
          />
          <TextInput
            className="border-2 border-black rounded-md p-2"
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <TextInput
            className="border-2 border-black rounded-md p-2"
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
  );
};

export default AddBooks;
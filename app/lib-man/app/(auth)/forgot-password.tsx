import { View, Text, KeyboardAvoidingView, Image } from 'react-native';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, TextInput } from 'react-native';

const ForgotPasswordScreen = () => {
  return (
    <KeyboardAvoidingView className="mx-4 flex flex-1 justify-center gap-6">
      <Image
        source={require('../../assets/logo-black-updown.png')}
        className="flex h-64 w-52 self-center object-cover object-center"
      />
      <Text className="font-bold text-xl flex">Find your account</Text>
      <View className="gap-3">
        <TextInput
          className="rounded-md border-2 border-gray-500 bg-slate-100 p-3"
          placeholder="Email address"
        />
      </View>
      <View className="gap-3">
        <Pressable className="border- flex items-center rounded-full border-2 border-black bg-amber-400 p-4">
          <Text className="font-bold">Continue</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
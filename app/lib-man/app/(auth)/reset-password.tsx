import { View, Text, KeyboardAvoidingView, Image ,SafeAreaView} from 'react-native';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, TextInput } from 'react-native';

const ResetPasswordScreen = () => {
  return (
    <SafeAreaView>
    <KeyboardAvoidingView className="mx-4 flex flex-1 justify-center gap-6">
      <Image
        source={require('../../assets/logo-black-updown.png')}
        className="flex h-64 w-52 self-center object-cover object-center"
      />
      <Text>Find your account</Text>
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
        <Pressable className="border- flex items-center rounded-full border-2 border-400 p-4">
          <Text className="font-bold text-amber-500">Continue</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
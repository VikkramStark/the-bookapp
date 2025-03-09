import { View, Text, KeyboardAvoidingView, Image } from 'react-native';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, TextInput } from 'react-native';
const LoginScreen = () => {
  return (
    <KeyboardAvoidingView className="mx-4 flex flex-1 justify-center gap-6 ">
      <Image
        source={require('../assets/logo-black-updown.png')}
        className="flex h-64 w-52 self-center object-cover object-center "
      />
      <View className="gap-3">
        <TextInput
          className=" rounded-md border-2 border-gray-500 bg-slate-100 p-3"
          placeholder="Email"
        />
        <TextInput
          className=" rounded-md border-2 border-gray-500 bg-slate-100 p-3"
          placeholder="password"
          secureTextEntry
        />
      </View>
      <View className="gap-3">
        <Pressable className="border- flex items-center rounded-full  border-2 border-black bg-amber-400 p-4">
          <Text className="font-bold ">Login</Text>
        </Pressable>
        <Link href={'/signup'} asChild>
        <Pressable className="flex items-center rounded-full border-2 border-amber-500 p-4  ">
          <Text className="font-semibold text-amber-500">Create new account</Text>
        </Pressable>
         </Link>
         <Link href={'/forgotPassword'} asChild>
        <Pressable className="flex items-center p-4 underline">
          <Text className="font-bold text-amber-500 underline  ">Forgot password?</Text>
        </Pressable>
         </Link>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

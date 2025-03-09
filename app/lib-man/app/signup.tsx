import { View, Text, KeyboardAvoidingView, Image } from 'react-native';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, TextInput } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import firebase from '~/utils/firebase';
const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const auth = getAuth(firebase);
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log(user);
      
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
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
          value={email}
          onChange={(e )=>{
            setEmail(e.nativeEvent.text);
          }}
        />
        <TextInput
          className=" rounded-md border-2 border-gray-500 bg-slate-100 p-3"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setpassword(e.nativeEvent.text);
          }}
          secureTextEntry
        />
      </View>
      <View className="gap-3">
        <Pressable className="border- flex items-center rounded-full  border-2 border-black bg-amber-400 p-4">
          <Text className="font-bold ">Sign up</Text>
        </Pressable>

        <Link href={'/'} asChild>
          <Pressable className="flex items-center p-4 underline">
            <Text className="font-bold text-amber-500 underline ">
              Already have an account? Log in
            </Text>
          </Pressable>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

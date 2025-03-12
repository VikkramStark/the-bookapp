import { View, Text, KeyboardAvoidingView, Image ,SafeAreaView} from 'react-native';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, TextInput ,ActivityIndicator} from 'react-native';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
// ...
import { auth } from '~/utils/firebase';
export default  function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent!');
    } catch (error:any) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='flex-1'>
    <KeyboardAvoidingView className="mx-4 flex flex-1 justify-center gap-6">
      <Image source={require('../../assets/logo-black-updown.png')} className="flex h-64 w-52 self-center" />
      <Text className="font-bold text-xl">Find your account</Text>
      <View className="gap-3">
        <TextInput
          className="rounded-md border-2 border-gray-500 bg-slate-100 p-3"
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
        />
        {message ? <Text>{message}</Text> : null}
        <Pressable
          className="flex items-center rounded-full border-2 border-black bg-amber-400 p-4"
          onPress={handleReset}
          disabled={loading}
        >
          {loading ? <ActivityIndicator /> : <Text className="font-bold">Continue</Text>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
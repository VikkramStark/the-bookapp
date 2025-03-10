import { View, Text, KeyboardAvoidingView, Image, ActivityIndicator, Platform, Pressable, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../utils/firebase';
import { Ionicons } from '@expo/vector-icons';

const SignUpScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const isValidEmail = (email: string) => {
    setEmail(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!emailRegex.test(email));
  };

  const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordError(!isValidPassword(text));
  };

  const handleSignUp = async () => {
    setError(false);
    if (!email || !password) {
      setError(true);
      setErrorMessage("Please enter both your email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'user',
        borrowedBooks: [],
        wishlist: [],
        penaltyFee: 0,
      });

      // Navigation handled by (auth)/_layout.tsx
    } catch (error: any) {
      setError(true);
      let errorMessage = error.message;
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address or password.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak.';
          break;
        default:
          errorMessage = 'An error occurred. Please try again.';
      }
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="mx-4 flex flex-1 justify-center gap-6"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Image
        source={require('../../assets/logo-black-updown.png')}
        className="flex h-64 w-52 self-center object-cover object-center"
      />
      <View className="gap-3">
        <TextInput
          className={`rounded-md border-2 bg-slate-100 p-3 ${emailError ? 'border-red-500' : 'border-gray-500'}`}
          placeholder="Email"
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          onChange={(e) => {
            isValidEmail(e.nativeEvent.text);
          }}
        />
        <View className="relative">
          <TextInput
            className={`rounded-md border-2 bg-slate-100 p-3 ${passwordError ? 'border-red-500' : 'border-gray-500'}`}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            autoCapitalize="none"
            onChange={(e) => {
              handlePasswordChange(e.nativeEvent.text);
            }}
            onSubmitEditing={handleSignUp}
          />
          <Pressable
            className="absolute right-3 top-2"
            onPress={() => setShowPassword(!showPassword)}
            accessibilityLabel="Toggle password visibility"
          >
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
          </Pressable>
        </View>
      </View>
      {error && <Text className="text-red-500 px-2 font-semibold">{errorMessage}</Text>}
      <View className="gap-3">
        <Pressable
          className="border- flex items-center rounded-full border-2 border-black bg-amber-400 p-4"
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#000000" /> : <Text className="font-bold">Sign up</Text>}
        </Pressable>
        <Link href={'/login'} asChild>
          <Pressable className="flex items-center p-4 underline">
            <Text className="font-bold text-amber-500 underline">Already have an account? Log in</Text>
          </Pressable>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
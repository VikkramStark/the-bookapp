import { View, Text, KeyboardAvoidingView, Image, Pressable, TextInput, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../ThemeContext'; // Assuming ThemeContext exists
import { auth } from '../../utils/firebase';
import { useRouter } from 'expo-router'; // For navigation
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Email validation regex
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleReset = async () => {
    if (!email.trim()) {
      setMessage({ text: 'Please enter your email address.', isError: true });
      return;
    }
    if (!isValidEmail(email)) {
      setMessage({ text: 'Please enter a valid email address.', isError: true });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({ text: 'Password reset email sent! Check your inbox.', isError: false });
    } catch (error: any) {
      switch (error.code) {
        case 'auth/user-not-found':
          setMessage({ text: 'No account found with this email.', isError: true });
          break;
        case 'auth/invalid-email':
          setMessage({ text: 'Invalid email format.', isError: true });
          break;
        case 'auth/too-many-requests':
          setMessage({ text: 'Too many requests. Try again later.', isError: true });
          break;
        default:
          setMessage({ text: `Error: ${error.message}`, isError: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace('/(auth)/login'); // Adjust path based on your app's structure
  };

  const headingColor = theme === 'light' ? 'black' : 'white';
  const bgColor = theme === 'dark' ? 'bg-black' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-800' : 'bg-slate-100';
  const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-500';
  const textColor = theme === 'dark' ? 'text-white' : 'text-black';
  const messageColor = message?.isError ? 'text-red-500' : 'text-green-500';

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <KeyboardAvoidingView
        behavior="padding"
        className={`mx-4 flex flex-1 justify-center gap-6`}
      >
        {/* Logo */}
        <View className="flex items-center">
          <Image
            source={
              theme === 'dark'
                ? require('../../assets/logo-updown.png')
                : require('../../assets/logo-black-updown.png')
            }
            className="h-64 w-52"
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text className={`font-bold text-2xl ${textColor}`} style={{ color: headingColor }}>
          Reset Your Password
        </Text>

        {/* Form */}
        <View className="gap-4">
          <Text className={`text-base ${textColor}`}>
            Enter your email address to receive a password reset link.
          </Text>
          <TextInput
            className={`rounded-md border-2 ${borderColor} ${inputBg} p-3 ${textColor}`}
            placeholder="Email address"
            placeholderTextColor={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            accessibilityLabel="Email input"
          />

          {/* Message */}
          {message && (
            <Text className={`text-base ${messageColor}`}>
              {message.text}
            </Text>
          )}

          {/* Continue Button */}
          <Pressable
            className={`flex items-center rounded-full border-2 border-black bg-amber-400 p-4 ${loading ? 'opacity-50' : ''}`}
            onPress={handleReset}
            disabled={loading}
            accessibilityLabel="Send password reset email"
          >
            {loading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text className="font-bold text-black">Send Reset Link</Text>
            )}
          </Pressable>

          {/* Back to Login */}
          <Pressable
            className="flex flex-row items-center justify-center gap-2"
            onPress={handleBackToLogin}
            accessibilityLabel="Back to login"
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={theme === 'dark' ? 'white' : 'black'}
            />
            <Text className={`text-base font-semibold ${textColor}`}>
              Back to Login
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
    </SafeAreaView>
  );
}
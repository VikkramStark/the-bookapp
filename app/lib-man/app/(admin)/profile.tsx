import { View, Text, Switch, Image, Pressable, ActivityIndicator } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { useTheme } from '../../ThemeContext';

const ProfileScreen = () => {
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';
  const { toggleTheme } = useTheme();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {setIsEnabled(!isEnabled);toggleTheme()}
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    signOut(auth)
      .then(() => {
        // Navigation handled by (auth)/_layout.tsx
      })
      .catch((error) => {
        console.error('Logout error:', error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <View className="mt-4 flex flex-1 px-4">
      <Text className="px-2 text-2xl font-bold" style={{ color: headingColor }}>Profile</Text>
      <View className="mt-4 flex gap-3">
        <View className="flex flex-row items-center justify-between rounded-lg bg-amber-300 p-2">
          <View className="flex flex-row items-center gap-4">
            <View className="relative h-16 w-16 items-center justify-center rounded-full bg-gray-700">
              <Text className="absolute self-center text-2xl font-bold text-white">A</Text>
            </View>
            <View className="">
              <Text className="text-xl font-semibold">Admin</Text>
              <Text className="text-neutral-500">Show profile</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </View>
        <View className="flex flex-row items-center justify-between rounded-lg bg-white p-2">
          <View className="flex flex-row items-center gap-3">
            <Ionicons name="moon" size={24} color="black" />
            <Text className="text-xl font-semibold">Dark mode</Text>
          </View>
          <Switch onValueChange={toggleSwitch} value={isEnabled} ios_backgroundColor="#3e3e3e" />
        </View>
        <View className="flex flex-row items-center justify-between rounded-lg bg-white p-4">
          <View className="flex flex-row items-center gap-3">
            <Ionicons name="alert-circle" size={24} color="black" />
            <Text className="text-xl font-semibold">Report damaged book</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </View>
        <Pressable
          className="flex flex-row items-center justify-center gap-2 rounded-lg bg-neutral-400 p-4"
          onPress={handleLogout}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <Text className="font-bold">Logout</Text>
          )}
        </Pressable>
      </View>
    </View>
    </View>
    
  );
};

export default ProfileScreen;

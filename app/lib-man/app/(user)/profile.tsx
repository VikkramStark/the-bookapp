import { View, Text, Switch, Image, Pressable, ActivityIndicator, SafeAreaView, TextInput } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../hooks/useAuth'; // Assuming useAuth provides the user
import { signOut } from 'firebase/auth';
import { auth, db } from '../../utils/firebase';
import { useTheme } from '../../ThemeContext';
import { StatusBar } from 'expo-status-bar';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ProfileScreen = () => {
  const { theme } = useTheme();
  const headingColor = theme === 'light' ? 'black' : 'white';
  const statusbarColor = theme === 'light' ? 'dark' : 'light';
  const { toggleTheme } = useTheme();
  const { user } = useAuth(); // Get the authenticated user
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>(''); // Dynamic username
  const [editUsername, setEditUsername] = useState<string>(''); // For editing in bottom sheet
  const [isEditing, setIsEditing] = useState(false); // Loading state for saving username
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Fetch or set initial username from email or Firestore
  useEffect(() => {
    const fetchUsername = async () => {
      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().username) {
        setUsername(userDoc.data().username);
      } else {
        // Default to email prefix if no username exists
        const emailPrefix = user.email?.split('@')[0] || 'User';
        setUsername(emailPrefix);
        // Optionally initialize in Firestore
        await setDoc(userDocRef, { username: emailPrefix }, { merge: true });
      }
    };

    fetchUsername();
  }, [user]);

  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
    toggleTheme();
  };

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

  const handleProfilePress = () => {
    setEditUsername(username); // Pre-fill with current username
    bottomSheetRef.current?.expand();
  };

  const handleSaveUsername = async () => {
    if (!user || !editUsername.trim()) return;

    setIsEditing(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { username: editUsername.trim() }, { merge: true });
      setUsername(editUsername.trim());
      bottomSheetRef.current?.close();
    } catch (error) {
      console.error('Error updating username:', error);
      alert('Failed to update username.');
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <GestureHandlerRootView className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <View className="flex h-16 w-full items-center justify-center py-2 mt-4">
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

        <View className="mt-4 flex flex-1 px-4">
          <Text className="px-2 text-2xl font-bold" style={{ color: headingColor }}>
            Profile
          </Text>
          <View className="mt-4 flex gap-3">
            <Pressable
              className="flex flex-row items-center justify-between rounded-lg bg-amber-300 p-2"
              onPress={handleProfilePress}
            >
              <View className="flex flex-row items-center gap-4">
                <View className="relative h-16 w-16 items-center justify-center rounded-full bg-gray-700">
                  <Text className="absolute self-center text-2xl font-bold text-white">
                    {username[0]?.toUpperCase() || 'U'}
                  </Text>
                </View>
                <View>
                  <Text className="text-xl font-semibold">{username}</Text>
                  <Text className="text-neutral-500">Edit profile</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </Pressable>
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
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text className="font-bold">Logout</Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* Bottom Sheet for Editing Username */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={['30%']}
          enablePanDownToClose={true}
          backgroundStyle={{
            backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
          }}
        >
          <BottomSheetView style={{ padding: 16 }}>
            <Text className="text-xl font-bold" style={{ color: headingColor }}>
              Edit Username
            </Text>
            <TextInput
              className={`mt-4 p-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
              value={editUsername}
              onChangeText={setEditUsername}
              placeholder="Enter your username"
              placeholderTextColor={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            <Pressable
              className={`mt-4 p-2 rounded-lg ${isEditing ? 'bg-gray-400' : 'bg-green-500'}`}
              onPress={handleSaveUsername}
              disabled={isEditing}
            >
              {isEditing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-center font-semibold">Save</Text>
              )}
            </Pressable>
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
      <StatusBar style={statusbarColor} />
    </SafeAreaView>
  );
};

export default ProfileScreen;
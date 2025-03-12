import { View, Text, Switch, Image, Pressable, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../utils/firebase';
import { useTheme } from '../../ThemeContext';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { doc, getDoc, collection, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import { StatusBar } from 'expo-status-bar';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const ProfileScreen = () => {
  const { theme, toggleTheme } = useTheme();
    const statusbarColor = theme === 'light' ? 'dark' : 'light';
  const [isEnabled, setIsEnabled] = useState(theme === 'dark');
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [adminProfile, setAdminProfile] = useState<{ name: string; email: string; role: string } | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [activeSheet, setActiveSheet] = useState<'profile' | 'users' | 'edit' | null>(null);
  const [username, setUsername] = useState<string>(''); 
  const [editUsername, setEditUsername] = useState<string>(''); 
  const [isEditing, setIsEditing] = useState(false); 
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    setIsEnabled(theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!auth.currentUser) return;

      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().name) {
        setUsername(userDoc.data().name);
      } else {
        const emailPrefix = auth.currentUser.email?.split('@')[0] || 'Admin';
        setUsername(emailPrefix);
        await setDoc(userDocRef, { name: emailPrefix }, { merge: true });
      }
    };

    fetchUsername();
  }, []);

  const headingColor = theme === 'light' ? 'black' : 'white';

  const toggleSwitch = () => {
    setIsEnabled((prev) => !prev);
    toggleTheme();
  };

  const handleShowProfile = async () => {
    if (!auth.currentUser) return;

    setProfileLoading(true);
    setActiveSheet('profile');
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setAdminProfile({
          name: data.name || 'Admin',
          email: auth.currentUser.email || 'N/A',
          role: data.role || 'admin',
        });
      }
      bottomSheetRef.current?.expand();
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to load profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleEditProfile = () => {
    setEditUsername(username);
    setActiveSheet('edit');
    bottomSheetRef.current?.expand();
  };

  const handleSaveUsername = async () => {
    if (!auth.currentUser || !editUsername.trim()) return;

    setIsEditing(true);
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userDocRef, { name: editUsername.trim() }, { merge: true });
      setUsername(editUsername.trim());
      setAdminProfile((prev) => prev ? { ...prev, name: editUsername.trim() } : null);
      bottomSheetRef.current?.close();
    } catch (error) {
      console.error('Error updating username:', error);
      alert('Failed to update username.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleManageUsers = async () => {
    if (!auth.currentUser) return;

    setUsersLoading(true);
    setActiveSheet('users');
    try {
      const adminDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const adminData = adminDoc.data();
      if (!adminData || adminData.role !== 'admin') {
        alert('You do not have permission to manage users.');
        setUsersLoading(false);
        return;
      }

      const usersQuery = collection(db, 'users');
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().username || 'Unknown',
        email: doc.data().email || 'N/A',
        role: doc.data().role || 'user',
      }));

      setUsers(usersData);
      bottomSheetRef.current?.expand();
    } catch (error: any) {
      console.error('Error fetching users:', error);
      alert('Failed to load users: ' + error.message);
    } finally {
      setUsersLoading(false);
    }
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    setUpdating(userId);
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      alert(`User role updated to ${newRole}`);
    } catch (error: any) {
      console.error('Error updating user role:', error);
      alert('Failed to update role: ' + error.message);
    } finally {
      setUpdating(null);
    }
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

  return (
    <SafeAreaView className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <GestureHandlerRootView className={`flex flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <View className="flex h-16 w-full items-center justify-center py-2">
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
              onPress={handleEditProfile} 
              disabled={profileLoading}
            >
              <View className="flex flex-row items-center gap-4">
                <View className="relative h-16 w-16 items-center justify-center rounded-full bg-gray-700">
                  <Text className="absolute self-center text-2xl font-bold text-white">
                    {username[0]?.toUpperCase() || 'A'}
                  </Text>
                </View>
                <View>
                  <Text className="text-xl font-semibold">{username}</Text>
                  <Text className="text-neutral-500">Edit profile</Text>
                </View>
              </View>
              {profileLoading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Ionicons name="chevron-forward" size={24} color="black" />
              )}
            </Pressable>
            <View className="flex flex-row items-center justify-between rounded-lg bg-white p-2">
              <View className="flex flex-row items-center gap-3">
                <Ionicons name="moon" size={24} color="black" />
                <Text className="text-xl font-semibold">Dark mode</Text>
              </View>
              <Switch
                onValueChange={toggleSwitch}
                value={isEnabled}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
            <Pressable
              className="flex flex-row items-center justify-between rounded-lg bg-white p-4"
              onPress={handleManageUsers}
              disabled={usersLoading}
            >
              <View className="flex flex-row items-center gap-3">
                <Ionicons name="people" size={24} color="black" />
                <Text className="text-xl font-semibold">Manage Users</Text>
              </View>
              {usersLoading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Ionicons name="chevron-forward" size={24} color="black" />
              )}
            </Pressable>
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

        {/* Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={['50%', '90%']}
          enablePanDownToClose={true}
          backgroundStyle={{
            backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
          }}
        >
          <BottomSheetView style={{ flex: 1, padding: 16 }}>
            {activeSheet === 'profile' && adminProfile ? (
              <View>
                <Text className="text-2xl font-bold" style={{ color: headingColor }}>
                  Profile Details
                </Text>
                <View className="mt-4">
                  <Text className="text-lg" style={{ color: headingColor }}>
                    Name:
                    <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                      {adminProfile.name}
                    </Text>
                  </Text>
                  <Text className="text-lg mt-2" style={{ color: headingColor }}>
                    Email:
                    <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                      {adminProfile.email}
                    </Text>
                  </Text>
                  <Text className="text-lg mt-2" style={{ color: headingColor }}>
                    Role:
                    <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                      {adminProfile.role}
                    </Text>
                  </Text>
                </View>
              </View>
            ) : activeSheet === 'users' ? (
              usersLoading ? (
                <ActivityIndicator size="large" color={headingColor} />
              ) : users.length === 0 ? (
                <Text className="text-lg" style={{ color: headingColor }}>
                  No users found.
                </Text>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text className="text-2xl font-bold" style={{ color: headingColor }}>
                    Manage Users
                  </Text>
                  {users.map((user) => (
                    <View
                      key={user.id}
                      className={`m-2 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
                    >
                      <Text className="text-lg font-semibold" style={{ color: headingColor }}>
                        {user.name}
                      </Text>
                      <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                        Email: {user.email}
                      </Text>
                      <Text style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                        Role: {user.role}
                      </Text>
                      <Pressable
                        className="mt-2 flex flex-row items-center gap-2 p-2 bg-blue-500 rounded-lg"
                        onPress={() => toggleUserRole(user.id, user.role)}
                        disabled={updating === user.id}
                      >
                        {updating === user.id ? (
                          <ActivityIndicator color="#FFFFFF" />
                        ) : (
                          <>
                            <Ionicons name="swap-horizontal" size={20} color="white" />
                            <Text className="text-white font-semibold">
                              {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                            </Text>
                          </>
                        )}
                      </Pressable>
                    </View>
                  ))}
                </ScrollView>
              )
            ) : activeSheet === 'edit' ? (
              <View>
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
              </View>
            ) : (
              <Text style={{ color: headingColor }}>Loading...</Text>
            )}
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
            <StatusBar style={statusbarColor} />
    </SafeAreaView>
  );
};

export default ProfileScreen;
import '../global.css';
import { Tabs } from 'expo-router';
import { Stack } from 'expo-router';
import { useState } from 'react';
// export const unstable_settings = {
//   initialRouteName: 'LoginScreen',
// };

export default function RootLayout() {
	// const [isUser, setIsUser] = useState(false);
  return (
    <Stack screenOptions={{headerShown:false}}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="signup" options={{ headerShown: false }} />
              <Stack.Screen name="forgotPassword" options={{ headerShown: false }} />
              <Stack.Screen name="resetPasswordCode" options={{ headerShown: false }} />

      {/* {isUser ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
      )} */}
    </Stack>
    // <>
    //   <Tabs
    //     screenOptions={{
    //       tabBarActiveTintColor: 'black',
    //     }}>
    //     <Tabs.Screen name="(admin)" options={{ headerShown: false }} />
    //     <Tabs.Screen name="(tabs)" options={{ headerShown: false }} />
    //   </Tabs>
    // </>
  );
}

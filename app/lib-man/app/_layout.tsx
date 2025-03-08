import '../global.css';
import { Tabs } from 'expo-router';
import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    // <Stack>
    //   <Stack.Screen name="(admin)" options={{ headerShown: false }} />
    //   <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    // </Stack>
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'black',
        }}>
        <Tabs.Screen name="(admin)" options={{ headerShown: false }} />
        <Tabs.Screen name="(tabs)" options={{ headerShown: false }} />
      </Tabs>
    </>
  );
}

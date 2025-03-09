import { View, Text, KeyboardAvoidingView, Image } from 'react-native';
import { Link } from 'expo-router';
import { useState ,useEffect} from 'react';
import { Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { Platform } from 'react-native';
import app from '~/utils/firebase';
import { Ionicons } from '@expo/vector-icons';
const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const[emailError,setEmailError]=useState(false);
  const[passwordError,setPasswordError]=useState(false);
  const auth = getAuth(app);
  const isValidEmail = (email:string) => {
    setEmail(email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!emailRegex.test(email));
    
  };
  const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
  };
  const handlePasswordChange=(text:string)=>{
    setPassword(text)
    setPasswordError(!isValidPassword(text))
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/(tabs)');
      }
    });
    return () => unsubscribe();
  }, []);
  const handleLogin = () => {
    setError(false);
    if (!email || !password) {
      setError(true);
      setErrorMessage("Please enter both your email and password.")
    }
    setIsLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        
        const user = userCredential.user;
        router.push('/(tabs)');
      })
      .catch((error) => {
        setError(true);
        let errorMessage = error.message;
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address or password.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No account exists with this email.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Invalid email address or password.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many attempts. Please try again later.';
            break;
          default:
            errorMessage = 'An error occurred. Please try again.';
        }
        setErrorMessage(errorMessage)
      }).finally(()=>{
        setIsLoading(false);
      });
  };
  return (
    <KeyboardAvoidingView className="mx-4 flex flex-1 justify-center gap-6 " behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Image
        source={require('../assets/logo-black-updown.png')}
        className="flex h-64 w-52 self-center object-cover object-center "
      />
      <View className="gap-3 ">
        <TextInput
          className={`rounded-md border-2   bg-slate-100 p-3 ${emailError?"border-red-500":"border-gray-500"}`} 
          placeholder="Email"
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          onChange={(e) => {
            isValidEmail(e.nativeEvent.text);
          }}
        />
        <View className='relative'>
        <TextInput
          className={`rounded-md border-2   bg-slate-100 p-3 ${passwordError?"border-red-500":"border-gray-500"}`} 

          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          autoCapitalize="none"
          onSubmitEditing={handleLogin}
          onChange={(e) => {
            handlePasswordChange(e.nativeEvent.text);
          }}
        />
        <Pressable
            className="absolute right-3 top-2"
            onPress={() => setShowPassword(!showPassword)}
            accessibilityLabel="Toggle password visibility"
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="gray"
            />
            
            </Pressable>
        </View>
       
      </View>
      {error && <Text className='text-red-500 px-2 font-semibold'>{errorMessage}</Text>}
      <View className="gap-3">
        <Pressable
          className="border- flex items-center rounded-full  border-2 border-black bg-amber-400 p-4"
          onPress={handleLogin} disabled={loading}>
          
          {loading ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <Text className="font-bold ">Login</Text>
          )}
        </Pressable>

        <Link href={'/signup'} asChild>
          <Pressable className="flex items-center rounded-full border-2 border-amber-500 p-4  " >
            <Text className="font-semibold text-amber-500">Create new account</Text>
          </Pressable>
        </Link>
        <Link href={'/forgotPassword'} asChild>
          <Pressable className="flex items-center p-4 underline" >
            <Text className="font-bold text-amber-500 underline  ">Forgot password?</Text>
          </Pressable>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

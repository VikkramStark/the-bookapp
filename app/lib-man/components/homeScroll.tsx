import { StyleSheet, View ,Text, Image, ImageBackground} from 'react-native';
import { ScrollView } from 'react-native';
type homeScrollProps={
    title:string

}
export default function HomeScroll(props:homeScrollProps){
return(<View className='mb-4'>
 <View className='flex justify-between px-6 flex-row '>
    <Text className='text-xl font-semibold'>{props.title}</Text>
    <Text className='text-neutral-600'>view all</Text>
</View>
        <ScrollView horizontal={true}> 
          
      <View  className='gap-2 flex-row px-6 pt-2 flex-1'> 
          
        <View className='h-56 w-40 '>
          <Image className='h-full w-full rounded-lg' source={require("../assets/normalpeople.png")} resizeMode='cover'/>
        </View>
        <View className='h-56 w-40 '>
          <Image className='h-full w-full rounded-lg' source={require("../assets/normalpeople.png")} resizeMode='cover'/>
        </View>
        <View className='h-56 w-40 '>
          <Image className='h-full w-full rounded-lg' source={require("../assets/normalpeople.png")} resizeMode='cover'/>
        </View>
        <View className='h-56 w-40 '>
          <Image className='h-full w-full rounded-lg' source={require("../assets/normalpeople.png")} resizeMode='cover'/>
        </View>

      </View>
      
      </ScrollView>
</View>)
}
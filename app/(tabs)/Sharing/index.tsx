
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import ButtonCustom from '../../../components/Button';
import { Text, View } from '../../../components/Themed';

export default function TabOneScreen() {

  const router = useRouter()

  const handleButton = () => {
    // router.push('/(tabs)/home/three')
  }
  return (
    <View >
      <FontAwesome5 name="home" size={24} color="black" />
      <Text>Nguyen trong nghia</Text>

      <ButtonCustom icon='home' onPress={handleButton}></ButtonCustom>


    </View>
  );
}



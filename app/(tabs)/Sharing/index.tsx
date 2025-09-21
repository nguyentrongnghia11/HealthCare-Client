
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import ButtonCustom from '../../../components/Button';
import { Text, View } from '../../../components/Themed';
import Test from '../Overview/alldata'; 

export default function TabOneScreen() {

  const router = useRouter()

  const handleButton = () => {
    // router.push('/(tabs)/home/three')
  }
  return (
    <View >
      <Test />
    </View>
  );
}



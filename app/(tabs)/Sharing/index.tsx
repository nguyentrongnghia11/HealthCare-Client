
import { useRouter } from 'expo-router';
import { View } from '../../../components/Themed';
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



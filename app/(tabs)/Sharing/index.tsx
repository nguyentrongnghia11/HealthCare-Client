  
import { useRouter } from 'expo-router';
import { View } from '../../../components/Themed';
import SharingScreen from './SharingScreen';

export default function TabOneScreen() {

  const router = useRouter()

  const handleButton = () => {
    // router.push('/(tabs)/home/three')
  }
  return (
    <View >
      <SharingScreen />
    </View>
  );
}



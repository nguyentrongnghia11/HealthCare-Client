import * as React from 'react';
import { Button } from 'react-native-paper';


interface ButtonOutlineProps {
    icon: string,
    mode: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal',
    onPress: () => void
}
const ButtonOutline: React.FC<ButtonOutlineProps> = ({ icon, mode, onPress }) => (
    <Button icon={icon} mode={mode} onPress={onPress}>
        Press me
    </Button>
);

export default ButtonOutline;
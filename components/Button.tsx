import * as React from 'react';
import { Button } from 'react-native-paper';

interface ButtonCustomProps {
    icon?: string;
    mode?: 'text' | 'outlined' | 'contained';
    onPress: () => void;
}

const ButtonCustom: React.FC<ButtonCustomProps> = ({ icon, mode = 'contained', onPress }) => (
    <Button icon={icon} mode={mode} onPress={onPress}>
        Press me
    </Button>
);

export default ButtonCustom;

import * as React from 'react';
import { Button } from 'react-native-paper';

interface ButtonCustomProps {
    icon?: string;
    mode?: 'text' | 'outlined' | 'contained';
    onPress: () => void;
    children: React.ReactNode
}

const ButtonCustom: React.FC<ButtonCustomProps> = ({ icon, mode = 'contained', onPress, children }) => (
    <Button icon={icon} mode={mode} onPress={onPress}>
        {children}
    </Button>
);

export default ButtonCustom;

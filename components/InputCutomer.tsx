import * as React from 'react';
import { TextInput } from 'react-native-paper';

interface InputCustom {
    label: string,
    value: string,
    onChange: () => void

}

const InputCustom: React.FC<InputCustom> = ({ label, value, onChange }) => {
    const [text, setText] = React.useState("");

    return (
        <TextInput
            label={label}
            value={value}
            onChangeText={onChange}
        />
    );
};

export default InputCustom;
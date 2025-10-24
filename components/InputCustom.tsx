import React from "react";
import { TextInput, TextInputProps } from "react-native-paper";

interface InputCustomProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void; // 👈 sửa lại đúng tên và kiểu
  backgroundColor?: string;
}

const InputCustom: React.FC<InputCustomProps> = ({
  label,
  value,
  onChangeText,
  backgroundColor = "#fff",
  ...rest
}) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText} 
      mode="outlined"
      style={[{ backgroundColor }, rest.style]}
      {...rest}
    />
  );
};

export default InputCustom;

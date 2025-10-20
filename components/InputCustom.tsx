import React from "react";
import { TextInput } from "react-native-paper";

interface InputCustomProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  backgroundColor?: string; // 👈 thêm prop
}

const InputCustom: React.FC<InputCustomProps> = ({
  label,
  value,
  onChange,
  backgroundColor = "#fff",
}) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChange}
      mode="outlined"
      style={{
        backgroundColor, 
      }}
    />
  );
};

export default InputCustom;

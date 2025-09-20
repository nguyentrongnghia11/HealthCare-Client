import { IconButton, Text } from "react-native-paper";


interface DeatailHeaderProps {
    title: string;
}

export default function DeatailHeader({ title }: DeatailHeaderProps) {
    return (<>
        <IconButton icon="arrow-left" onPress={() => { }} ></IconButton>
        <Text>{title}</Text>
    </>)
}
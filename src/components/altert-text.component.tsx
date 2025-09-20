import {Text} from "@ant-design/react-native";
import {FC, ReactNode, useMemo} from "react";
import {Colors} from "../constants/colors.ts";
import {StyleSheet} from "react-native";

type Type = 'error' | 'success' | 'warning' | 'info';

type Props = {
    children: ReactNode;
    type?: Type;
    time?: string;
}

export const AlertText: FC<Props> = ({
    children,
    type = 'info',
    time
}) => {
    const style = useMemo(() => ({
        color: Colors.accent[type]
    }), [type])

    return (
        <Text style={[styles.text, style]}>
            {time ? <Text style={styles.time}>{time} : </Text> : null}
            <Text>{children}</Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 10,
        backgroundColor: 'transparent',
    },
    time: {
        fontWeight: 'bold',
    }
})
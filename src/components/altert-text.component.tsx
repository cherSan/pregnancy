import {FC, ReactNode, useMemo} from "react";
import {StyleSheet, Text} from "react-native";
import {Colors} from "../constants/colors.ts";

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
        <Text
            style={[styles.text, style]}
            numberOfLines={1}
            ellipsizeMode={'tail'}
        >
            {time ? <Text style={styles.time}>{time} : </Text> : null}
            <Text>{children}</Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 11,
    },
    time: {
        fontWeight: 'bold',
    }
})
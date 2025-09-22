import {StyleSheet, TextInput, View} from "react-native";
import {ComponentProps, FC} from "react";
import {Colors} from "../../constants/colors.ts";
import {Text} from "@ant-design/react-native";

type Props = ComponentProps<typeof TextInput> & {
    error?: string;
};

export const Input: FC<Props> = ({
    error,
    ...props
}) => {
    return (
        <View style={[styles.inputWrapper]}>
            <TextInput
                style={styles.input}
                placeholderTextColor={Colors.neutral[400]}
                {...props}
            />
            <View style={styles.errorContainer}>
                <Text style={styles.error}>{error || ''}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    inputWrapper: {
        position: "relative",
        paddingHorizontal: 4,
        display: "flex",
        flexDirection: 'column'
    },
    errorContainer: {
        position: "absolute",
        bottom: 0,
        right: 0,
        display: 'flex',
        height: 16,
        paddingBottom: 4,
        boxSizing: 'border-box',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexWrap: 'nowrap'
    },
    error: {
        color: Colors.accent.error,
        fontSize: 10,
        lineHeight: 10,
    },
    input: {
        paddingBottom: 18,
        fontWeight: "bold",
        color: Colors.secondary.default,
        backgroundColor: 'transparent',
    }
})
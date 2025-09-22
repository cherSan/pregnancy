import {StyleSheet, TextInput, View} from "react-native";
import {ComponentProps, FC} from "react";
import {Colors} from "../../constants/colors.ts";
import {Text} from "@ant-design/react-native";

type Props = ComponentProps<typeof TextInput> & {
    error?: string;
    inline?: boolean;
};

export const Input: FC<Props> = ({
    error,
    placeholder,
    inline = false,
    ...props
}) => {
    return (
        <View style={[styles.inputWrapper]}>
            {
                inline
                    ? (
                        <View style={styles.placeholder}>
                            <Text
                                style={styles.placeholderText}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {placeholder}
                            </Text>
                        </View>
                    )
                    : null
            }
            <TextInput
                style={[styles.input, inline ? styles.inlineInput: {}]}
                placeholderTextColor={Colors.neutral[400]}
                placeholder={!inline ? placeholder : ''}
                {...props}
            />
            <View style={styles.errorContainer}>
                <Text style={styles.error}>{error || ''}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    placeholderText: {
        textAlign: 'right',
        color: Colors.neutral[400],
        fontWeight: 'bold',
    },
    placeholder: {
        position: 'absolute',
        top: 10,
        width: '46%',
        overflow: 'hidden',
    },
    inlineInput: {
        paddingLeft: '50%',
        overflow: 'hidden',
        width: '100%',
    },
    inputWrapper: {
        gap: 10,
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
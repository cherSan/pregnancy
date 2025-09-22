import {StyleSheet, TextInput, View} from "react-native";
import {ComponentProps, FC, useMemo, useState} from "react";
import {Colors} from "../../constants/colors.ts";

type Props = ComponentProps<typeof TextInput> & {
    status?: 'error' | 'success' | 'info' | 'warning';
};

export const Input: FC<Props> = ({
    status,
    onChangeText,
    ...props
}) => {
    const [touched, setTouched] = useState(false);
    
    const color = useMemo(() => {
        if (!touched) return {}
        const tmp = {
            borderRightWidth: 4,
            boxSizing: 'border-box',
        }

        switch (status) {

            case "error":
                return {
                    ...tmp,
                    borderLeftColor: Colors.accent.error,
                };
            case "success":
                return {
                    ...tmp,
                    borderLeftColor: Colors.accent.success,
                };
            case "info":
                return {
                    ...tmp,
                    borderLeftColor: Colors.accent.info,
                };
            case "warning":
                return {
                    ...tmp,
                    borderLeftColor: Colors.accent.warning,
                };
            default:
                return {}
        }
    }, [status, touched]);

    return (
        <View style={[styles.inputWrapper]}>
            <TextInput
                style={[styles.input, color]}
                {...props}
                placeholderTextColor={Colors.neutral[400]}
                onBlur={(e) => {
                    setTouched(true);
                    props.onBlur?.(e);
                }}
                onChangeText={e => {
                    setTouched(false);
                    onChangeText?.(e);
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    inputWrapper: {
       paddingHorizontal: 4
    },
    input: {
        fontWeight: "bold",
        color: Colors.secondary.default,
        backgroundColor: 'transparent',
    }
})
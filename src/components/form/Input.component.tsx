import {StyleSheet, TextInput, View} from "react-native";
import {ComponentProps, FC} from "react";
import {Colors} from "../../constants/colors.ts";

type Props = ComponentProps<typeof TextInput>;

export const Input: FC<Props> = (props) => {
    return (
        <View style={styles.inputWrapper}>
            <TextInput
                style={styles.input}
                {...props}
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
import {ComponentProps, FC} from "react";
import {Button as B} from "@ant-design/react-native";
import {StyleSheet, View} from "react-native";

type Props = ComponentProps<typeof B>
export const Button: FC<Props> = ({
    children,
    ...props
}) => {
    return (
        <View style={styles.button}>
            <B {...props}>
                {children}
            </B>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12
    }
})
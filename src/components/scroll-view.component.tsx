import {ComponentProps, FC, ReactNode} from "react";
import {StyleSheet} from "react-native";
import Animated from "react-native-reanimated";

type Props = ComponentProps<typeof Animated.ScrollView> & {
    children: ReactNode;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        gap: 16,
        backgroundColor: '#cce0f8',
    }
});

export const ScrollView: FC<Props> = (
    {
        children,
        style,
        ...props
    }
) => {
    return (
        <Animated.ScrollView
            style={[styles.container, style]}
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={"always"}
            {...props}
        >
            {children}
        </Animated.ScrollView>
    )
}
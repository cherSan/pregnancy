import {ComponentProps, FC, ReactNode} from "react";
import {Dimensions, StyleSheet, View} from "react-native";
import Animated from "react-native-reanimated";

type Props = ComponentProps<typeof Animated.ScrollView> & {
    children: ReactNode;
}

const { height: viewportHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#cce0f8',
    },
    view: {
        flex: 1,
        minHeight: viewportHeight + 120,
        gap: 20,
        paddingHorizontal: 10,
        paddingBottom: 30,
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
            <View style={styles.view}>
                {children}
            </View>
        </Animated.ScrollView>
    )
}
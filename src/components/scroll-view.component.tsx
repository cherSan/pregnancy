import {ComponentProps, FC, ReactNode} from "react";
import {StyleSheet} from "react-native";
import Animated from "react-native-reanimated";

type Props = {
    children: ReactNode;
    onScroll?: ComponentProps<typeof Animated.ScrollView>["onScroll"];
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: '#cce0f8',
        zIndex: 99
    }
});

export const ScrollView: FC<Props> = (
    {
        children,
        onScroll,
    }
) => {
    return (
        <Animated.ScrollView
            onScroll={onScroll}
            style={style.container}
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={"always"}
        >
            {children}
        </Animated.ScrollView>
    )
}
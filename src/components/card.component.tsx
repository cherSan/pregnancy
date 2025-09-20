import {ComponentProps, FC, useEffect} from "react";
import Animated, {useAnimatedStyle, useSharedValue, withSequence, withSpring} from "react-native-reanimated";
import {StyleSheet} from "react-native";

type Props = ComponentProps<typeof Animated.View>

export const Card: FC<Props> = ({
    children,
    style,
    ...props
}) => {
    const scale = useSharedValue(0.5);

    useEffect(() => {
        scale.value = withSequence(
            withSpring(1, { damping: 20, stiffness: 180 })
        );
    }, [scale]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View {...props} style={[styles.card, style, animatedStyle]}>
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        display: "flex",
        flexDirection: "column",
        padding: 10,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,.6)",
        color: "#eee",
        shadowColor: '#000',
        overflow: 'hidden',
        elevation: 6,
    }
});

import {ComponentProps, FC, useEffect} from "react";
import Animated, {useAnimatedStyle, useSharedValue, withSequence, withSpring} from "react-native-reanimated";
import {StyleSheet} from "react-native";
import {Colors} from "../constants/colors.ts";

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
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    card: {
        display: "flex",
        flexDirection: "column",
        padding: 10,
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: Colors.secondary.contrastText,
        overflow: 'hidden',
        elevation: 6,
        borderWidth: 1,
        borderColor: Colors.neutral[100],
        borderStyle: 'solid',
    }
});

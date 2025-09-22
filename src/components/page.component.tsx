import React, {ComponentType, FC, ReactNode, useMemo} from "react";
import {View, TouchableOpacity, StyleSheet} from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    interpolateColor,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import {useNavigation} from "@react-navigation/core";
import {Icon} from "@ant-design/react-native";
import {IconNames} from "@ant-design/react-native/lib/icon";
import {useQuery} from "@realm/react";
import {HeaderActions} from "./header-action.tsx";
import { HeaderBackground } from "./header-background.tsx";
import {MotherSummary} from "./mother-summary.component.tsx";
import {HeaderNotification} from "./header-notification.component.tsx";
import { ScrollView } from "./scroll-view.component.tsx";
import {User} from "../realms/user.ts";
import {Colors} from "../constants/colors.ts";

type Actions = {
    action: Function;
    icon: IconNames
}

type Props = {
    children: ReactNode;
    title: string;
    actions?: Actions[];
    headerRight?: ComponentType<any>;
    weight?: boolean;
    temperature?: boolean;
    pressure?: boolean;
    mood?: boolean;
};

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 60;

export const Page: FC<Props> = ({
    children,
    actions = [],
    title,
    headerRight: Right,
    weight = false,
    temperature = false,
    pressure = false,
    mood = false,
}) => {
    const navigation = useNavigation();
    
    const hasBackButton = useMemo(
        () => {
            const state = navigation.getState();
            return state?.routes && state.routes.length > 1
        },
        [navigation]
    )

    const scrollY = useSharedValue(0);

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const headerStyle = useAnimatedStyle(() => {
        const height = interpolate(
            scrollY.value,
            [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            Extrapolation.CLAMP
        );
        return { height };
    });

    const titleAnimatedStyle = useAnimatedStyle(() => {
        const left = interpolate(
            scrollY.value,
            [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            [10, 70],
            Extrapolation.CLAMP
        );

        const top = interpolate(
            scrollY.value,
            [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            [HEADER_MAX_HEIGHT - 20, 20],
            Extrapolation.CLAMP
        )

        const color = interpolateColor(
            scrollY.value,
            [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            Colors.header,
        )

        const textShadowColor = interpolateColor(
            scrollY.value,
            [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            [Colors.primary.contrastText, Colors.secondary.contrastText],
        )

        return { left, top, color, textShadowColor };
    });

    const nameAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, HEADER_MAX_HEIGHT - 60],
            [1, 0],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    const user = useQuery(User);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.header, headerStyle]}>
                <HeaderBackground />
                {
                    hasBackButton
                        ? (
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                <Icon name={'arrow-left'} color={Colors.header[1]} />
                            </TouchableOpacity>
                        )
                        : null
                }
                <MotherSummary
                    scrollY={scrollY}
                    heightMax={HEADER_MAX_HEIGHT}
                    heightMin={HEADER_MIN_HEIGHT}
                    t={temperature}
                    m={mood}
                    w={weight}
                    p={pressure}
                />
                <Animated.Text style={[styles.title, nameAnimatedStyle]}>
                    { user[0]?.name ? user[0].name : 'Незнакомка' }
                </Animated.Text>
                <Animated.Text style={[styles.title, titleAnimatedStyle]}>
                    { title }
                </Animated.Text>
                <View style={styles.actions}>
                    {
                        Right
                            ? <Right />
                            : (
                                <HeaderActions>
                                    {
                                        actions?.map((action) => (
                                            <HeaderActions.Action
                                                key={action.icon}
                                                onClick={() => action.action(navigation)}
                                                icon={action.icon}
                                            />
                                        ))
                                    }
                                </HeaderActions>
                            )
                    }

                </View>
                <HeaderNotification
                    scrollY={scrollY}
                    heightMax={HEADER_MAX_HEIGHT}
                    heightMin={HEADER_MIN_HEIGHT}
                />
            </Animated.View>
            <ScrollView onScroll={onScroll}>
                <View style={{ height: HEADER_MAX_HEIGHT }} />
                {children}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f8ff",
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        overflow: "hidden",
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.header[1] + '30',
        zIndex: 9999,
        position: 'absolute',
        top: 10,
        left: 10,
        alignItems: 'center',
        justifyContent: 'center',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    title: {
        position: "absolute",
        top: 20,
        left: 70,
        fontSize: 16,
        lineHeight: 20,
        fontWeight: "700",
        color: Colors.primary.contrastText,
        elevation: 6,
        textShadowColor: Colors.secondary.contrastText,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    actions: {
        position: "absolute",
        right: 10,
        top: 10,
    },
});
import React, {FC, ReactNode, useMemo} from "react";
import {View, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { ScrollView } from "./scroll-view.component.tsx";
import Animated, {
    Extrapolation,
    interpolate, interpolateColor,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import { HeaderBackground } from "./header-background.tsx";
import {useNavigation} from "@react-navigation/core";
import {Icon, Text} from "@ant-design/react-native";
import {Colors} from "../constants/colors.ts";
import {HeaderActions} from "./header-action.tsx";
import {IconNames} from "@ant-design/react-native/lib/icon";
import {useQuery} from "@realm/react";
import {MotherWeight} from "../realms/mother-weight.ts";
import {MotherTemperature} from "../realms/mother-temperature.ts";
import {MotherPressure} from "../realms/mother-pressure.ts";
import {Medication} from "../realms/medication.ts";

type Actions = {
    action: Function;
    icon: IconNames
}

type Props = {
    children: ReactNode;
    title: string;
    actions: Actions[];
};

const { width } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 60;

export const Page: FC<Props> = ({
    children,
    actions = [],
    title,
}) => {
    const now = new Date();

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
            [HEADER_MAX_HEIGHT - 40, 20],
            Extrapolation.CLAMP
        )

        const color = interpolateColor(
            scrollY.value,
            [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            ['#aaa', '#FFF'],
        )

        return { left, top, color };
    });

    const cardsAnimationStyle =  useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - 60],
            [1, 0],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    const medAnimationStyle =  useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - 120],
            [1, 0],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    const weight = useQuery(MotherWeight)
        .filtered('value != 0 AND value != NULL')
        .sorted('datetime', true);

    const tempreture = useQuery(MotherTemperature)
        .filtered('value != 0 AND value != NULL')
        .sorted('datetime', true);

    const pressure = useQuery(MotherPressure)
        .filtered('valueTop != 0 AND valueTop != NULL AND valueBottom != 0 AND valueBottom != NULL')
        .sorted('datetime', true);

    const missed = useQuery(Medication)
        .filtered('planingTime < $0 AND realTime == null', now)
        .sorted('planingTime', false);

    const upcoming = useQuery(Medication)
        .filtered('planingTime >= $0', now)
        .sorted('planingTime', true);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.header, headerStyle]}>
                <HeaderBackground />
                <View style={styles.actions}>
                    <HeaderActions>
                        {
                            actions.map((action) => (
                                <HeaderActions.Action
                                    key={action.icon}
                                    onClick={() => action.action(navigation)}
                                    icon={action.icon}
                                />
                            ))
                        }
                    </HeaderActions>
                </View>
                <Animated.View style={[styles.cards]}>
                    {
                        weight?.[0]
                            ? (
                                <Animated.View style={[styles.card, cardsAnimationStyle]}>
                                    <Text>Вес</Text>
                                    <Text style={styles.value}>{weight[0].value} кг</Text>
                                    <Text style={styles.date}>{weight[0].datetime.toLocaleString()}</Text>
                                </Animated.View>
                            )
                            : null
                    }
                    {
                        tempreture?.[0]
                            ? (
                                <Animated.View style={[styles.card, cardsAnimationStyle]}>
                                    <Text>Температура</Text>
                                    <Text style={styles.value}>{tempreture[0].value}</Text>
                                    <Text style={styles.date}>{tempreture[0].datetime.toLocaleString()}</Text>
                                </Animated.View>
                            )
                            : null
                    }
                    {
                        pressure?.[0]
                            ? (
                                <Animated.View style={[styles.card, cardsAnimationStyle]}>
                                    <Text>Температура</Text>
                                    <Text style={styles.value}>{pressure[0].valueTop.toString()} / {pressure[0].valueBottom.toString()}</Text>
                                    <Text style={styles.date}>{pressure[0].datetime.toLocaleString()}</Text>
                                </Animated.View>
                            )
                            : null
                    }
                </Animated.View>
                {
                    hasBackButton
                        ? (
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                <Icon name={'arrow-left'} color={Colors.darkGray} />
                            </TouchableOpacity>
                        )
                        : null
                }
                <Animated.View style={[styles.med, medAnimationStyle]}>
                    {
                        upcoming[0]
                            ? (
                                <Text>
                                    Следующее {upcoming[0]?.name} в {missed[0]?.planingTime.toString()}
                                </Text>
                            )
                            : null
                    }
                    {
                        missed[0]
                            ? (
                                <Text>
                                    Пропущено {missed[0]?.name} в {missed[0]?.planingTime.toString()}
                                </Text>
                            )
                            : null
                    }

                </Animated.View>
                <Animated.Text style={[styles.title, titleAnimatedStyle]}>
                    { title }
                </Animated.Text>
            </Animated.View>
            <ScrollView onScroll={onScroll}>
                <View style={{ height: HEADER_MAX_HEIGHT }} />
                {children}
                <View style={{ height: 200 }} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f8ff", // мягкий пастельный фон для всей страницы
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        width,
        zIndex: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        overflow: "hidden",
    },
    title: {
        position: "absolute",
        fontSize: 20,
        lineHeight: 20,
        fontWeight: "700",
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.gray + '30',
        zIndex: 9999,
        position: 'absolute',
        top: 10,
        left: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actions: {
        position: "absolute",
        right: 10,
        top: 10,
    },
    cards: {
        position: "absolute",
        right: 10,
        left: 10,
        top: 70,
        height: 50,
        display: "flex",
        justifyContent: "center",
        gap: 10,
        flexDirection: "row",
        alignItems: "center",
        opacity: 1
    },
    card: {
        alignItems: "center",
        backgroundColor: "#f2f9ff",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        elevation: 2,
    },
    value: {
        fontSize: 14,
        fontWeight: "bold",
    },
    date: {
        fontSize: 7,
    },
    med: {
        position: "absolute",
        right: 10,
        left: 10,
        top: 170,
        height: 20,
        display: "flex",
        justifyContent: "center",
        gap: 10,
        flexDirection: "column",
        alignItems: "center",
        opacity: 1,
        color: '#fff',
    }
});
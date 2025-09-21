import {FC} from "react";
import {ScrollView, StyleSheet, Text} from "react-native"
import {useQuery} from "@realm/react";
import {Extrapolation, interpolate, SharedValue, useAnimatedStyle} from "react-native-reanimated";
import {MotherWeight} from "../realms/mother-weight.ts";
import {MotherTemperature} from "../realms/mother-temperature.ts";
import {MotherPressure} from "../realms/mother-pressure.ts";
import {Colors} from "../constants/colors.ts";
import {Card} from "./card.component.tsx";
import {MotherMood} from "../realms/mother-mood.ts";
import {useNavigation} from "@react-navigation/core";

type Prop = {
    scrollY: SharedValue<number>,
    heightMax: number,
    heightMin: number,
    w?: boolean;
    t?: boolean;
    p?: boolean;
    m?: boolean;
}

export const MotherSummary: FC<Prop> = ({
    scrollY,
    heightMax,
    heightMin,
    w = false,
    t = false,
    p = false,
    m = false,
}) => {
    const navigation = useNavigation<any>();

    const cardsAnimationStyle =  useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, heightMax - heightMin - 60],
            [1, 0],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    const weight = useQuery(MotherWeight)
        .filtered('value != 0 AND value != NULL')
        .sorted('datetime', true);

    const temperature = useQuery(MotherTemperature)
        .filtered('value != 0 AND value != NULL')
        .sorted('datetime', true);

    const pressure = useQuery(MotherPressure)
        .filtered('valueTop != 0 AND valueTop != NULL AND valueBottom != 0 AND valueBottom != NULL')
        .sorted('datetime', true);

    const moods = useQuery(MotherMood)
        .filtered('value != 0 AND value != NULL')
        .sorted('datetime', true);

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContent}
        >
            <Card style={[styles.card, cardsAnimationStyle, w ? { backgroundColor: Colors.secondary.default } : {}]} onPress={!w ? () => navigation.navigate('MotherWeight') : undefined}>
                <Text style={styles.title}>Вес</Text>
                <Text style={styles.value}>{weight[0]?.value || '-'} кг</Text>
                <Text style={styles.date}>{weight[0]?.datetime.toLocaleString() || '-'}</Text>
            </Card>
            <Card style={[styles.card, cardsAnimationStyle, t ? { backgroundColor: Colors.secondary.default } : {}]} onPress={!t ? () => navigation.navigate('MotherTemperature') : undefined}>
                <Text style={styles.title}>Температура</Text>
                <Text style={styles.value}>{temperature[0]?.value || '-'} C</Text>
                <Text style={styles.date}>{temperature[0]?.datetime.toLocaleString() || '-'}</Text>
            </Card>
            <Card style={[styles.card, cardsAnimationStyle, p ? { backgroundColor: Colors.secondary.default } : {}]} onPress={!p ? () => navigation.navigate('MotherPressure') : undefined}>
                <Text style={styles.title}>Давление / Пульс</Text>
                <Text style={styles.value}>{pressure[0]?.valueTop.toString() || '-'}-{pressure[0]?.valueBottom.toString() || '-'} / {pressure[0]?.pulse?.toString() || '-'}</Text>
                <Text style={styles.date}>{pressure[0]?.datetime.toLocaleString() || '-'}</Text>
            </Card>
            <Card style={[styles.card, cardsAnimationStyle, m ? { backgroundColor: Colors.secondary.default } : {}]} onPress={!m ? () => navigation.navigate('MotherMood') : undefined}>
                <Text style={styles.title}>Настроение</Text>
                <Text style={styles.value}>{moods[0]?.value.toString() || '-'}</Text>
                <Text style={styles.date}>{moods[0]?.datetime.toLocaleString() || '-'}</Text>
            </Card>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    card: {
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 14,
        color: Colors.secondary.contrastText
    },
    value: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.secondary.contrastText
    },
    date: {
        fontSize: 8,
        color: Colors.secondary.contrastText
    },
    cardsContent: {
        padding: 5,
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        flex: 1,
        gap: 10,
        flexDirection: "row",
        opacity: 1,
        flexWrap: 'nowrap',
        position: "absolute",
        top: 60,
        left: 0,
        minWidth: '100%'
    },
});
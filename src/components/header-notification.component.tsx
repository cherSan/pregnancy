import React, {FC} from "react";
import {Extrapolation, interpolate, SharedValue, useAnimatedStyle} from "react-native-reanimated";
import {useQuery} from "@realm/react";
import {StyleSheet} from "react-native";
import {AlertText} from "./altert-text.component.tsx";
import {Card} from "./card.component.tsx";
import {Medication} from "../realms/medication.ts";
import {Hospital} from "../realms/hospital.ts";
import {useDate} from "../hooks/useDate.ts";

type Props = {
    scrollY: SharedValue<number>,
    heightMax: number,
    heightMin: number,
};

export const HeaderNotification: FC<Props> = ({
  scrollY,
  heightMax,
  heightMin,
}) => {
    const {
       now,
       startOfTheDay,
       endOfTheDay,
    } = useDate();

    const animationStyle =  useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, heightMax - heightMin - 170],
            [1, 0],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    const missed = useQuery(Medication)
        .filtered('planingTime >= $0 AND planingTime <= $1 AND realTime == null', startOfTheDay, now)
        .sorted('planingTime', true);

    const upcoming = useQuery(Medication)
        .filtered('planingTime >= $0 AND planingTime <= $1 AND realTime == null', now, endOfTheDay)
        .sorted('planingTime', false);

    const nextHospitalVisit = useQuery(Hospital)
        .filtered('datetime >= $0 AND (isCompleted == false OR isCompleted == null)', now)
        .sorted('datetime', false)
        [0];

    if (
        !upcoming[0]
        && !missed[0]
        && !nextHospitalVisit
    ) return null;

    return (
        <Card style={[styles.container, animationStyle]}>
            {
                Array.from({ length: Math.min(missed.length, 2)}).map((_, i) => {
                    const item = missed[i];
                    return (
                        <AlertText
                            key={item._id.toString()}
                            time={item?.planingTime.toLocaleString()}
                            type={'error'}
                        >
                            Пропущен прием {item.name}
                        </AlertText>
                    )
                })
            }
            {
                upcoming[0]
                    ? (
                        <AlertText
                            type={'success'}
                            time={upcoming[0]?.planingTime.toLocaleString()}
                        >
                            Запланирован прием {upcoming[0]?.name}
                        </AlertText>
                    )
                    : null
            }
            {
                nextHospitalVisit
                    ? (
                        <AlertText
                            time={nextHospitalVisit.datetime.toLocaleString()}
                        >
                            Прием у доктора {nextHospitalVisit.doctor}
                        </AlertText>
                    )
                    : null
            }
        </Card>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        right: 10,
        left: 10,
        top: 160,
        display: "flex",
        justifyContent: "center",
        gap: 4,
        flexDirection: "column",
        opacity: 1,
        padding: 10,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        elevation: 2,
    },
    time: {
        fontWeight: "bold",
    }
});
import {StyleSheet, Text, View} from "react-native";
import {useQuery, useRealm} from "@realm/react";
import {Icon} from "@ant-design/react-native";
import {Pressable} from "react-native-gesture-handler";
import {BSON} from "realm";
import {useCallback, useMemo} from "react";
import {Card} from "./card.component.tsx";
import {useDate} from "../hooks/useDate.ts";
import {User} from "../realms/user.ts";
import {Colors} from "../constants/colors.ts";
import {MotherMood} from "../realms/mother-mood.ts";

export const PregnancyTime = () => {
    const realm = useRealm();
    const {
        startOfTheDay,
        endOfTheDay
    } = useDate();
    const users = useQuery(User);
    const user = users[0];
    const edd = useMemo(() => {
        const eddData = user?.eddate;
        if(!eddData) return null;
        const diffMs = eddData.getTime() - startOfTheDay.getTime();
        const daysUntilEDD = Math.round(diffMs / (1000 * 60 * 60 * 24));

        const totalPregnancyDays = 280;
        const daysElapsed = totalPregnancyDays - daysUntilEDD;
        const weeks = Math.floor(daysElapsed / 7);
        const days = daysElapsed % 7;

        return { weeks, days };
    }, [user?.eddate, startOfTheDay]);


    const moods = useQuery(MotherMood)
        .filtered('datetime >= $0 && datetime <= $1', startOfTheDay, endOfTheDay)
        .sorted('datetime', true);

    const onPress = useCallback((value: number) => {
        realm.write(() => {
            realm.create<MotherMood>(
                MotherMood,
                {
                    _id: new BSON.ObjectId(),
                    value,
                    datetime: new Date(),
                }
            );
        });
    }, [realm])

    const stars = useMemo(() => {
        return Array.from({ length: 5 }, (_, i) => {
            const index = i + 1;
            if (moods[0]?.value && index <= moods[0]?.value) {
                return (
                    <Pressable key={index} onPress={() => onPress(index)}>
                        <Icon name="star" size={40} color="gold" />
                    </Pressable>
                )
            }

            return (
                <Pressable key={index} onPress={() => onPress(index)}>
                    <Icon name="star" size={40} color="lightgray" />
                </Pressable>
            );
        });
    }, [moods, onPress]);

    if (!edd || !user) return null;

    return (
        <Card style={styles.card}>
            <View style={styles.ageContainer}>
                <View style={styles.ageBlock}>
                    <Text style={styles.number}>{edd.weeks}</Text>
                    <Text style={styles.label}>недель</Text>
                </View>
                <View style={styles.ageBlock}>
                    <Text style={styles.number}>{edd.days}</Text>
                    <Text style={styles.label}>дней</Text>
                </View>
            </View>
            <View style={styles.rate}>
                { stars }
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        color: Colors.secondary.contrastText,
    },
    ageContainer: {
        flexDirection: "row",
        gap: 20,
    },
    ageBlock: {
        alignItems: "center",
        backgroundColor: Colors.background.solidLight,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    number: {
        fontSize: 28,
        fontWeight: "700",
        color: "#007aff",
    },
    label: {
        fontSize: 14,
        color: "#555",
    },
    rate: {
        paddingTop: 10,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        fontSize: 20,
        alignItems: "center",
    },
    starBlock: {
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
    },
})
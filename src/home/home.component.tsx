import {useQuery} from "@realm/react";
import {useMemo} from "react";
import {StyleSheet} from "react-native";
import {Text, View, WhiteSpace, WingBlank} from "@ant-design/react-native";
import {KicksInformation} from "./kicks-information.component";
import {KickButton} from "./kick-button";
import {User} from "../realms/user.ts";
import {useDate} from "../hooks/useDate.ts";
import {Card} from "../components/card.component.tsx";
import {Colors} from "../constants/colors.ts";

export const Home = () => {
    const { now } = useDate();
    const users = useQuery(User);
    const user = users[0];
    const edd = useMemo(() => {
        const eddData = user?.eddate;
        if(!eddData) return null;
        const diffMs = eddData.getTime() - now.getTime();
        const daysUntilEDD = Math.round(diffMs / (1000 * 60 * 60 * 24));

        const totalPregnancyDays = 280;
        const daysElapsed = totalPregnancyDays - daysUntilEDD;
        const weeks = Math.floor(daysElapsed / 7);
        const days = daysElapsed % 7;

        return { weeks, days };
    }, [user?.eddate, now]);

    return (
        <View>
            <KicksInformation />
            <WhiteSpace />
            <KickButton />
            <WhiteSpace />
            {
                edd
                    ? (
                        <Card style={styles.card}>
                            <Text style={styles.title}>Срок беременности</Text>
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
                        </Card>
                    )
                    : null
            }
            <WhiteSpace />
        </View>
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
        backgroundColor: "#f2f9ff",
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
})
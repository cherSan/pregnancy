import {useQuery} from "@realm/react";
import {useMemo} from "react";
import {Input, Text, View, WhiteSpace, WingBlank} from "@ant-design/react-native";
import {KicksInformation} from "./kicks-information.component";
import {KickButton} from "./kick-button";
import {ScrollView} from "../components/scroll-view.component.tsx";
import {List} from "../components/list.component.tsx";
import {User} from "../realms/user.ts";
import {StyleSheet} from "react-native";

export const Home = () => {
    const users = useQuery(User);
    const user = users[0];
    const edd = useMemo(() => {
        const eddData = user?.eddate;
        if(!eddData) return null;
        const today = new Date();
        const diffMs = eddData.getTime() - today.getTime();
        const daysUntilEDD = Math.round(diffMs / (1000 * 60 * 60 * 24));

        const totalPregnancyDays = 280;
        const daysElapsed = totalPregnancyDays - daysUntilEDD;
        const weeks = Math.floor(daysElapsed / 7);
        const days = daysElapsed % 7;

        return { weeks, days };
    }, [user?.eddate]);
    return (
        <ScrollView>
            <KicksInformation />
            <WhiteSpace />
            <WingBlank size="lg">
                <KickButton />
            </WingBlank>
            {
                edd
                    ? (
                    <WingBlank size="lg">
                        <View style={styles.card}>
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
                        </View>
                    </WingBlank>
                    )
                    : null
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        alignItems: "center",
        marginVertical: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        color: "#333",
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
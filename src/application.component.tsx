import {RealmProvider} from "@realm/react";
import {Provider} from "@ant-design/react-native";
import {StatusBar, StyleSheet} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ruRu from "@ant-design/react-native/lib/locale-provider/ru_RU";
import {RootNavigation} from "./navigation.component.tsx";
import {Initialize} from "./initialize.component.tsx";
import {User} from "./realms/user.ts";
import {Kick} from "./realms/kick.ts";
import {MedicationConfiguration} from "./realms/medication-configuration.ts";
import {Medication} from "./realms/medication.ts";
import {Notes} from "./realms/notes.ts";
import {Hospital} from "./realms/hospital.ts";
import {MotherPressure} from "./realms/mother-pressure.ts";
import {MotherTemperature} from "./realms/mother-temperature.ts";
import {MotherWeight} from "./realms/mother-weight.ts";
import {MotherMood} from "./realms/mother-mood.ts";

const style = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: '#eee',
    },
    root: {
        flex: 1,
    }
});

export const Application = () => {
    return (
        <RealmProvider
            schemaVersion={8}
            onMigration={(oldRealm, newRealm) => {
                if (oldRealm.schemaVersion < 3) {
                    const oldUsers = oldRealm.objects('User');
                    const newUsers = newRealm.objects('User');
                    for (let i = 0; i < oldUsers.length; i++) {
                        newUsers[i].eddate = null;
                    }
                }
                if (oldRealm.schemaVersion < 4) {}
                if (oldRealm.schemaVersion < 5) {}
            }}
            schema={[
                User,
                Kick,
                MedicationConfiguration,
                Medication,
                Notes,
                Hospital,
                MotherPressure,
                MotherTemperature,
                MotherWeight,
                MotherMood,
            ]}
        >
            <Provider locale={ruRu}>
                <GestureHandlerRootView style={style.root}>
                    <SafeAreaProvider>
                        <StatusBar translucent backgroundColor={'transparent'} />
                        <SafeAreaView style={style.container}>
                            <Initialize>
                                <RootNavigation />
                            </Initialize>
                        </SafeAreaView>
                    </SafeAreaProvider>
                </GestureHandlerRootView>
            </Provider>
        </RealmProvider>
    )
}
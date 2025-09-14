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

const style = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
    },
    root: {
        flex: 1,
    }
});

export const Application = () => {
    return (
        <RealmProvider
            deleteRealmIfMigrationNeeded
            schema={[
                User,
                Kick,
                MedicationConfiguration,
                Medication
            ]}
        >
            <Provider locale={ruRu}>
                <GestureHandlerRootView style={style.root}>
                    <SafeAreaProvider>
                        <Initialize>
                            <StatusBar barStyle={'dark-content'} />
                            <SafeAreaView style={style.container}>
                                <RootNavigation />
                            </SafeAreaView>
                        </Initialize>
                    </SafeAreaProvider>
                </GestureHandlerRootView>
            </Provider>
        </RealmProvider>
    )
}
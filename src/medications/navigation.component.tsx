import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {StyleSheet, TouchableOpacity} from "react-native";
import {Icon, View} from "@ant-design/react-native";
import {MedicationConfiguration} from "./medications-configuration.component.tsx";
import {HeaderBackground} from "../components/header-background.tsx";
import {MedicationsHistory} from "./medications-history.component.tsx.tsx";
import {Medications} from "./medications.component.tsx";
import {AddMedication} from "./add.medication.component.tsx";

export type MedicationStackParamList = {
    MedicationsInformation: undefined;
    MedicationConfiguration: undefined;
    MedicationsHistory: undefined;
};

export const Navigator = createNativeStackNavigator<MedicationStackParamList>();

export const MedicationNavigation = () => {
    return (
        <Navigator.Navigator
            screenOptions={{
                headerBackground: HeaderBackground,
                headerTintColor: "#444",
                headerTitleStyle: { fontWeight: "600" },
            }}
        >
            <Navigator.Screen
                name={'MedicationsInformation'}
                component={Medications}
                options={({ navigation }) => ({
                    headerTitle: 'Медикаменты',
                    headerRight: () => (
                        <View style={styles.headerActions}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('MedicationsHistory')}
                            >
                                <Icon name="history" style={styles.button} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('MedicationConfiguration')}
                            >
                                <Icon name="setting" style={styles.button} />
                            </TouchableOpacity>
                        </View>
                    ),
                })}
            />
            <Navigator.Screen
                name={'MedicationConfiguration'}
                component={MedicationConfiguration}
                options={() => ({
                    headerTitle: 'Расписание',
                    headerRight: AddMedication,
                })}
            />
            <Navigator.Screen
                name={'MedicationsHistory'}
                component={MedicationsHistory}
                options={{
                    title: "История приема лекарств",
                }}
            />
        </Navigator.Navigator>
    )
}

const styles = StyleSheet.create({
    button: {
        color: '#E63946',
    },
    headerActions: {
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
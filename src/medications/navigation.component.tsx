import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {MedicationConfiguration} from "./medications-configuration.component.tsx";
import {HeaderBackground} from "../components/header-background.tsx";
import {MedicationsHistory} from "./medications-history.component.tsx.tsx";
import {Medications} from "./medications.component.tsx";
import {AddMedication} from "./add.medication.component.tsx";
import {HeaderActions} from "../components/header-action.tsx";

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
                        <HeaderActions>
                            <HeaderActions.Action
                                onClick={() => navigation.navigate('MedicationsHistory')}
                                icon={'history'}
                            />
                            <HeaderActions.Action
                                onClick={() => navigation.navigate('MedicationConfiguration')}
                                icon={'setting'}
                            />
                        </HeaderActions>
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
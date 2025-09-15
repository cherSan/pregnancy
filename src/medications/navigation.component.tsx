import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {MedicationConfiguration} from "./medications-configuration.component.tsx";
import {Medications} from "./medications.component.tsx.tsx";
import {MedicationsStatistic} from "./medications-statistic.component.tsx";

const Navigator = createNativeStackNavigator();

export const MedicationNavigation = () => {
    return (
        <Navigator.Navigator>
            <Navigator.Screen name={'Лекарства'} component={MedicationsStatistic} />
            <Navigator.Screen name={'Настройка'} component={MedicationConfiguration} />
            <Navigator.Screen name={'История'} component={Medications} />
        </Navigator.Navigator>
    )
}
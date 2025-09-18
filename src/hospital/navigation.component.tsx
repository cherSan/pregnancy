import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Index} from "./index.component.tsx";
import {History} from "./history.component.tsx";
import {HeaderBackground} from "../components/header-background.tsx";

export type StackParamList = {
    HospitalIndex: undefined;
    HospitalHistory: undefined;
};

const Navigator = createNativeStackNavigator<StackParamList>();

export const HospitalNavigation = () => {
    return (
        <Navigator.Navigator
            screenOptions={{
                headerBackground: HeaderBackground,
                headerTintColor: "#444",
                headerTitleStyle: { fontWeight: "600" },
            }}
        >
            <Navigator.Screen
                name={'HospitalIndex'}
                component={Index}
                options={{
                    headerTitle: 'Госпиталь',
                }}
            />
            <Navigator.Screen
                name={'HospitalHistory'}
                component={History}
                options={{
                    headerTitle: 'Записи',
                }}
            />
        </Navigator.Navigator>
    )
}
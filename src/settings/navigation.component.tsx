import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Settings} from "./settings.component.tsx";
import {HeaderBackground} from "../components/header-background.tsx";

export type NotesStackParamList = {
    SettingsIndex: undefined;
};

export const Navigator = createNativeStackNavigator<NotesStackParamList>();

export const SettingsNavigation = () => {
    return (
        <Navigator.Navigator
            screenOptions={{
                headerBackground: HeaderBackground,
                headerTintColor: "#444",
                headerTitleStyle: { fontWeight: "600" },
            }}
        >
            <Navigator.Screen
                name={'SettingsIndex'}
                component={Settings}
                options={{
                    title: "Настройки",
                }}
            />
        </Navigator.Navigator>
    )
}
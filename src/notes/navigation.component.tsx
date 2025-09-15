import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {HeaderBackground} from "../components/header-background.tsx";
import {NotesInformation} from "./notes-information.component.tsx";
import {NotesHistory} from "./notes-history.component.tsx";

export type NotesStackParamList = {
    NotesInformation: undefined;
    NotesHistory: undefined;
};

export const Navigator = createNativeStackNavigator<NotesStackParamList>();

export const NotesNavigation = () => {
    return (
        <Navigator.Navigator
            screenOptions={{
                headerBackground: HeaderBackground,
                headerTintColor: "#444",
                headerTitleStyle: { fontWeight: "600" },
            }}
        >
            <Navigator.Screen
                name={'NotesInformation'}
                component={NotesInformation}
                options={{
                    title: "Заметки",
                }}
            />
            <Navigator.Screen
                name={'NotesHistory'}
                component={NotesHistory}
                options={{
                    title: "История заметок",
                }}
            />
        </Navigator.Navigator>
    )
}
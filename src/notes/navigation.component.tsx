import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {HeaderBackground} from "../components/header-background.tsx";
import {NotesHistory} from "./notes-history.component.tsx";
import {AddNote} from "./add-note.component.tsx";

export type NotesStackParamList = {
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
                name={'NotesHistory'}
                component={NotesHistory}
                options={{
                    title: "Заметки",
                    headerRight: AddNote
                }}
            />
        </Navigator.Navigator>
    )
}
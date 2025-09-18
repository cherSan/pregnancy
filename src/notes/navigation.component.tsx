import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {HeaderBackground} from "../components/header-background.tsx";
import {NotesHistory} from "./notes-history.component.tsx";
import {AddNote} from "./add-note.component.tsx";
import {HeaderActions} from "../components/header-action.tsx";

export type NotesStackParamList = {
    NotesHistory: undefined;
    NotesAdd: undefined;
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
                options={({navigation}) => ({
                    title: "Заметки",
                    headerRight: () => (
                        <HeaderActions>
                            <HeaderActions.Action
                                onClick={() => navigation.navigate('NotesAdd')}
                                icon={'plus'}
                            />
                        </HeaderActions>
                    )
                })}
            />
            <Navigator.Screen
                name={'NotesAdd'}
                component={AddNote}
                options={() => ({
                    title: "Добавить Заметку",
                })}
            />
        </Navigator.Navigator>
    )
}
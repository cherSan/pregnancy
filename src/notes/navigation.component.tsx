import {NotesHistory} from "./notes-history.component.tsx";
import {AddNote} from "./add-note.component.tsx";
import {createAppStack} from "../components/create-stack-navigation.tsx";

export type NotesStackParamList = {
    NotesHistory: undefined;
    NotesAdd: undefined;
};

export const NotesNavigation = createAppStack<NotesStackParamList>([
    {
        name: 'NotesHistory',
        component: NotesHistory,
        title: 'Notes',
        actions: [
            {
                action: (navigation) => navigation.navigate('NotesAdd'),
                icon: 'plus'
            }
        ]
    },
    {
        name: 'NotesAdd',
        component: AddNote,
        title: 'Add Note',
    }
])
import {StyleSheet} from "react-native";
import {Icon, Text} from "@ant-design/react-native";
import {useQuery} from "@realm/react";
import {Notes} from "../realms/notes.ts";
import {List} from "../components/list.component.tsx";

export const NotesHistory = () => {
    const notes = useQuery(Notes)
        .sorted('datetime', true);

    if (!notes.length) return null;

    return (
        <List>
            {
                notes.map((note: Notes) => (
                    <List.Item
                        key={note._id.toString()}
                        icon={
                            note.important
                                ? <Icon name="alert" color={'red'} />
                                : null
                        }
                        title={note.title || 'No Title'}
                        extra={note?.datetime?.toLocaleString()}
                        description={note.important}
                    >
                        {
                            note.comment
                                ? (
                                    <Text style={styles.import}>
                                        {note.comment}
                                    </Text>
                                )
                                : null
                        }
                    </List.Item>
                ))
            }
        </List>
    )
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        elevation: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontWeight: '900'
    },
    import: {
        color: '#5d88d6'
    }
});
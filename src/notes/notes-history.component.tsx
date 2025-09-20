import {StyleSheet} from "react-native";
import {Icon, List, Text, View} from "@ant-design/react-native";
import {useQuery} from "@realm/react";
import {Notes} from "../realms/notes.ts";

export const NotesHistory = () => {
    const notes = useQuery(Notes)
        .sorted('datetime', true);

    return (
        <List>
            {
                notes.map((note: Notes) => (
                    <List.Item
                        multipleLine={true}
                        wrap={true}
                        key={
                            note._id.toString()
                        }
                    >
                        <View>
                            <View style={styles.header}>
                                {
                                    note.important
                                        ? <Icon name="alert" color={'red'} />
                                        : null
                                }
                                <Text style={styles.title}>
                                    { note?.datetime?.toLocaleString() }
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.title}>
                                    { note.title || 'No Title' }
                                </Text>
                            </View>
                        </View>
                        {
                            note.important
                                ? (
                                    <Text style={styles.import}>
                                        {note.important}
                                    </Text>
                                )
                                : null
                        }
                        <List.Item.Brief>
                            {note.comment}
                        </List.Item.Brief>
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
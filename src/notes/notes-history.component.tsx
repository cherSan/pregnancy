import {Icon, List, Text, View} from "@ant-design/react-native";
import {useQuery} from "@realm/react";
import {ScrollView} from "react-native";
import {Notes} from "../realms/notes.ts";

export const NotesHistory = () => {
    const notes = useQuery(Notes)
        .sorted('datetime', true);

    return (
        <ScrollView
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        >
            <List>
                {
                    notes.map((note: Notes) => (
                        <List.Item
                            multipleLine={true}
                            key={
                                note._id.toString()
                            }
                            thumb={
                                note.important
                                    ? <Icon name="alert" color={'red'} />
                                    : null
                            }
                        >
                            <View>
                                <View>
                                    <Text>
                                        { note?.datetime?.toLocaleString() }
                                    </Text>
                                </View>
                                <View>
                                    <Text style={{ fontWeight: '900' }}>
                                        { note.title || 'No Title' }
                                    </Text>
                                </View>
                            </View>
                            {
                                note.important
                                    ? (
                                        <List.Item.Brief>
                                            <Text style={{ color: 'red' }}>
                                                {note.important}
                                            </Text>
                                        </List.Item.Brief>
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
        </ScrollView>
    )
}
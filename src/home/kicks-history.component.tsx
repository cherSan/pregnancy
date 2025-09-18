import {useQuery} from "@realm/react";
import {List, Text} from "@ant-design/react-native";
import {Kick} from "../realms/kick.ts";
import {ScrollView} from "../components/scroll-view.component.tsx";

export const KicksHistory = () => {
    const kicks = useQuery(Kick).sorted('datetime', true);

    return (
        <ScrollView>
            <List>
                {
                    kicks.map((kick: Kick) => (
                        <List.Item
                            key={kick._id.toString()}>
                            <Text>{kick?.datetime?.toLocaleString()}</Text>
                            {
                                kick.comment
                                    ? <List.Item.Brief>{kick.comment}</List.Item.Brief>
                                    : null
                            }
                        </List.Item>
                    ))
                }
            </List>
        </ScrollView>
    )
}
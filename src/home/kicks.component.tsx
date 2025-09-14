import {useQuery} from "@realm/react";
import {List} from "@ant-design/react-native";
import {ScrollView} from "react-native";
import {Kick} from "../realms/kick.ts";

export const Kicks = () => {
    const kicks = useQuery(Kick).sorted('datetime', true);

    return (
        <ScrollView
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        >
            <List>
                {
                    kicks.map((kick: Kick) => (
                        <List.Item key={kick?.datetime?.getTime()}>
                            {kick?.datetime?.toLocaleString()}
                        </List.Item>
                    ))
                }
            </List>
        </ScrollView>
    )
}
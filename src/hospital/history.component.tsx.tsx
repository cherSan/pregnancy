import {useQuery} from "@realm/react";
import {List, Text, View} from "@ant-design/react-native";
import {Medication} from "../realms/medication.ts";
import {ScrollView} from "../components/scroll-view.component.tsx";

export const History = () => {
    const medications = useQuery(Medication)
        .filtered('realTime != NULL')
        .sorted('realTime', true);

    return (
        <ScrollView>
            <List>
                {
                    medications.map((medication: Medication) => (
                        <List.Item
                            wrap
                            key={
                                medication._id.toString()
                            }
                            extra={
                                <View>
                                    <Text>
                                        { medication?.realTime?.toLocaleString() }
                                    </Text>
                                </View>
                            }
                        >
                            <Text>
                                { medication.name }
                            </Text>
                            {
                                medication.comment
                                    ? (
                                        <List.Item.Brief>
                                            {medication.comment}
                                        </List.Item.Brief>
                                    )
                                    : null
                            }
                        </List.Item>
                    ))
                }
            </List>
        </ScrollView>
    )
}
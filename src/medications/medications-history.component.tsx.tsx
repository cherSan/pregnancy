import {useQuery} from "@realm/react";
import {List, Text, View, WhiteSpace, WingBlank} from "@ant-design/react-native";
import {ScrollView} from "react-native";
import {Medication} from "../realms/medication.ts";

export const MedicationsHistory = () => {
    const medications = useQuery(Medication)
        .filtered('realTime != NULL')
        .sorted('realTime', true);

    return (
        <ScrollView
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        >
            <WingBlank size="lg">
                <WhiteSpace />
                <List>
                    {
                        medications.map((medication: Medication) => (
                            <List.Item
                                multipleLine={medication.hasComment}
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
                                <List.Item.Brief>
                                    {medication.comment}
                                </List.Item.Brief>

                            </List.Item>
                        ))
                    }
                </List>
                <WhiteSpace />
            </WingBlank>
        </ScrollView>
    )
}
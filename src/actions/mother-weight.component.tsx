import {useQuery, useRealm} from "@realm/react";
import {useReactive} from "ahooks";
import {useCallback} from "react";
import {BSON} from "realm";
import {Button, Input, Text} from "@ant-design/react-native";
import { Page } from "../components/page.component"
import {MotherWeight as MW} from "../realms/mother-weight.ts";
import {List} from "../components/list.component.tsx";
import {View} from "react-native";

export const MotherWeight = ({ props }: any) => {
    const realm = useRealm();

    const newData = useReactive({
        weight: '',
    })

    const weights = useQuery(MW)
        .sorted('datetime', true);

    const saveWeight = useCallback(() => {
        const value = parseFloat(newData.weight);
        if (isNaN(value) || !value) return;

        realm.write(() => {
            realm.create<MW>(
                MW,
                {
                    _id: new BSON.ObjectId(),
                    value,
                    datetime: new Date(),
                }
            );

            newData.weight = '';
        });
    }, [newData, realm]);

    return (
        <Page
            title={'Вес мамы'}
            weight={true}
            {...props}
        >
            <List>
                <Input
                    placeholder={'Вес'}
                    keyboardType={'numeric'}
                    value={newData.weight}
                    onChangeText={v => {
                        newData.weight = v
                    }}
                />
                <Button onPress={saveWeight} type={'primary'}>
                    <Text>Сохранить</Text>
                </Button>
            </List>
            {
                weights.length
                    ? (
                        <List>
                            {
                                weights.map((w, i) => (
                                    <List.Item
                                        title={w.datetime.toLocaleString()}
                                        extra={
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text>
                                                    {w.value.toFixed(1)}
                                                </Text>
                                                <Text>
                                                    ({(w.value - (weights[i + 1]?.value || 0)).toFixed(1)})
                                                </Text>
                                            </View>
                                        }
                                    />
                                ))
                            }
                        </List>
                    )
                    : null
            }
        </Page>
    )
}
import {useQuery, useRealm} from "@realm/react";
import {useReactive} from "ahooks";
import {useCallback} from "react";
import {BSON} from "realm";
import {Button, Input, Text} from "@ant-design/react-native";
import { Page } from "../components/page.component"
import {MotherTemperature as MT} from "../realms/mother-temperature.ts";
import {List} from "../components/list.component.tsx";

export const MotherTemperature = ({ props }: any) => {
    const realm = useRealm();

    const newData = useReactive({
        value: '',
    })

    const data = useQuery(MT)
        .sorted('datetime', true);

    const saveData = useCallback(() => {
        const value = parseFloat(newData.value);
        if (isNaN(value) || !value) return;
        realm.write(() => {
            realm.create<MT>(
                MT,
                {
                    _id: new BSON.ObjectId(),
                    value,
                    datetime: new Date(),
                }
            );

            newData.value = '';
        });
    }, [newData, realm]);

    return (
        <Page
            title={'Температура мамы'}
            temperature={true}
            {...props}
        >
            <List>
                <Input
                    keyboardType={'numeric'}
                    placeholder={'Температура'}
                    value={newData.value}
                    onChangeText={v => {
                        newData.value = v
                    }}
                />
                <List.Item>
                    <Button onPress={saveData} type={'primary'}>
                        <Text>Сохранить</Text>
                    </Button>
                </List.Item>
            </List>
            {
                data.length
                    ? (
                        <List>
                            {
                                data.map((w) => (
                                    <List.Item
                                        title={w.datetime.toLocaleString()}
                                        extra={w.value.toFixed(1)}
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
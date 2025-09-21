import {useQuery, useRealm} from "@realm/react";
import { Page } from "../components/page.component"
import {MotherPressure as MP} from "../realms/mother-pressure.ts";
import {List} from "../components/list.component.tsx";
import {Button, Input, Text} from "@ant-design/react-native";
import {useReactive} from "ahooks";
import {useCallback} from "react";
import {BSON} from "realm";

export const MotherPressure = ({ props }: any) => {
    const realm = useRealm();

    const newData = useReactive({
        pressure: '',
        pulse: '',
    })

    const data = useQuery(MP)
        .sorted('datetime', true);

    const savePressure = useCallback(() => {
        const [valueTop, valueBottom] = newData.pressure.split(' ');
        const v1 = parseFloat(valueTop);
        const v2 = parseFloat(valueBottom);
        const v3 = parseFloat(newData.pulse);
        if (isNaN(v1) || isNaN(v2) || !v1 || !v2) return;
        realm.write(() => {
            realm.create<MP>(
                MP,
                {
                    _id: new BSON.ObjectId(),
                    valueTop: v1,
                    valueBottom: v2,
                    pulse: v3,
                    datetime: new Date(),
                }
            );
            newData.pressure = '';
        });
    }, [newData, realm]);

    return (
        <Page
            title={'Давление и пульс мамы'}
            pressure={true}
            {...props}
        >
            <List>
                <Input
                    placeholder={'Давление (Формат: 120 80)'}
                    value={newData.pressure}
                    onChangeText={v => {
                        newData.pressure = v
                    }}
                />
                <Input
                    placeholder={'Пульс'}
                    value={newData.pulse}
                    onChangeText={v => {
                        newData.pulse = v
                    }}
                />
                <Button onPress={savePressure} type={'primary'}>
                    <Text>Сохранить</Text>
                </Button>
            </List>
            {
                data.length
                    ? (
                        <List>
                            {
                                data.map((w) => (
                                    <List.Item
                                        title={w.datetime.toLocaleString()}
                                        extra={`${w.valueTop}-${w.valueBottom} / ${w.pulse || '-'}`}
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
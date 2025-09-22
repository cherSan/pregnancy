import {useQuery, useRealm} from "@realm/react";
import {Button, Text} from "@ant-design/react-native";
import {useReactive} from "ahooks";
import {useCallback} from "react";
import {BSON} from "realm";
import { Page } from "../components/page.component"
import {MotherPressure as MP} from "../realms/mother-pressure.ts";
import {List} from "../components/list.component.tsx";
import {Input} from "../components/form/Input.component.tsx";

export const MotherPressure = ({ props }: any) => {
    const realm = useRealm();

    const newData = useReactive({
        valueTop: '',
        valueBottom: '',
        pulse: '',
    })

    const data = useQuery(MP)
        .sorted('datetime', true);

    const savePressure = useCallback(() => {
        const v1 = parseFloat(newData.valueTop);
        const v2 = parseFloat(newData.valueBottom);
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
            newData.valueBottom = '';
            newData.valueTop = '';
            newData.pulse = '';
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
                    placeholder={'Систолическое давление'}
                    keyboardType={'numeric'}
                    value={newData.valueTop}
                    onChangeText={v => {
                        newData.valueTop = v
                    }}
                />
                <Input
                    placeholder={'Диастолическое давление'}
                    keyboardType={'numeric'}
                    value={newData.valueBottom}
                    onChangeText={v => {
                        newData.valueBottom = v
                    }}
                />
                <Input
                    keyboardType={'numeric'}
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
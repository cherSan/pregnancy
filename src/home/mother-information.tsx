import {Button, Input, Text} from "@ant-design/react-native";
import {useRealm} from "@realm/react";
import {useReactive} from "ahooks";
import {useCallback} from "react";
import {BSON} from "realm";
import {MotherTemperature} from "../realms/mother-temperature.ts";
import {MotherWeight} from "../realms/mother-weight.ts";
import {MotherPressure} from "../realms/mother-pressure.ts";
import {List} from "../components/list.component.tsx";

export const MotherInformation = () => {
    const realm = useRealm();

    const newData = useReactive({
        temperature: '',
        weight: '',
        pressure: '',
    })

    
    const saveWeight = useCallback(() => {
        const value = parseFloat(newData.weight);
        if (isNaN(value) || !value) return;
        realm.write(() => {
            realm.create<MotherWeight>(
                MotherWeight,
                {
                    _id: new BSON.ObjectId(),
                    value,
                    datetime: new Date(),
                }
            );

            newData.weight = '';
        });
    }, [newData, realm]);

    const saveTemperature = useCallback(() => {
        const value = parseFloat(newData.temperature);
        if (isNaN(value) || !value) return;
        realm.write(() => {
            realm.create<MotherTemperature>(
                MotherTemperature,
                {
                    _id: new BSON.ObjectId(),
                    value: value,
                    datetime: new Date(),
                }
            );
            newData.temperature = '';
        });
    }, [newData, realm]);

    const savePressure = useCallback(() => {
        const [valueTop, valueBottom] = newData.pressure.split(' ');
        const v1 = parseFloat(valueTop);
        const v2 = parseFloat(valueBottom);
        if (isNaN(v1) || isNaN(v2) || !v1 || !v2) return;
        realm.write(() => {
            realm.create<MotherPressure>(
                MotherPressure,
                {
                    _id: new BSON.ObjectId(),
                    valueTop: v1,
                    valueBottom: v2,
                    datetime: new Date(),
                }
            );
            newData.pressure = '';
        });
    }, [newData, realm]);
    return (
        <>
            <List>
                <Input
                    placeholder={'Вес'}
                    value={newData.weight}
                    onChangeText={v => {
                        newData.weight = v
                    }}
                />
                <List.Item>
                    <Button onPress={saveWeight}>
                        <Text>Сохранить</Text>
                    </Button>
                </List.Item>
            </List>
            <List>
                <Input
                    placeholder={'Температура'}
                    value={newData.temperature}
                    onChangeText={v => {
                        newData.temperature = v
                    }}
                />
                <Button onPress={saveTemperature}>
                    <Text>Сохранить</Text>
                </Button>
            </List>
            <List>
                <Input
                    placeholder={'Формат: 120 80'}
                    value={newData.pressure}
                    onChangeText={v => {
                        newData.pressure = v
                    }}
                />
                <Button onPress={savePressure}>
                    <Text>Сохранить</Text>
                </Button>
            </List>
        </>
    )
}
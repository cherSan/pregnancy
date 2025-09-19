import {Button, Input, Tabs, View} from "@ant-design/react-native";
import {ScrollView} from "../components/scroll-view.component.tsx";
import {useQuery, useRealm} from "@realm/react";
import {MotherTemperature} from "../realms/mother-temperature.ts";
import {MotherWeight} from "../realms/mother-weight.ts";
import {MotherPressure} from "../realms/mother-pressure.ts";
import {List} from "../components/list.component.tsx";
import {useReactive} from "ahooks";
import {useCallback} from "react";
import {Hospital} from "../realms/hospital.ts";
import {BSON} from "realm";

export const MotherInformation = () => {
    const realm = useRealm();
    
    const tabs = [
        { title: 'Вес' },
        { title: 'Температура' },
        { title: 'Давление' },
    ];

    const newData = useReactive({
        temprature: '',
        weight: '',
        pressure: '',
    })

    const temprature = useQuery(MotherTemperature)
        .filtered('value != 0')
        .sorted('datetime', true);
    const wight = useQuery(MotherWeight)
        .filtered('value != 0')
        .sorted('datetime', true);
    const presure = useQuery(MotherPressure)
        .filtered('valueTop != 0 && valueBottom != 0')
        .sorted('datetime', true);
    
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
        const value = parseFloat(newData.temprature);
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
            newData.temprature = '';
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
        <Tabs tabs={tabs}>
            <View style={{ flex: 1 }}>
                <List>
                    <List.Item>
                        <Input
                            placeholder={'Вес'}
                            value={newData.weight}
                            onChangeText={v => {
                                newData.weight = v
                            }}
                        />
                    </List.Item>
                    <Button onPress={saveWeight}>
                        Сохранить
                    </Button>
                </List>
                <ScrollView>
                    <List>
                        {
                            wight.map((item) => (
                                <List.Item
                                    key={item._id.toString()}
                                    extra={item.datetime.toLocaleString()}
                                >
                                    {item.value.toString()}
                                </List.Item>
                            ))
                        }
                    </List>
                </ScrollView>
            </View>
            <View style={{ flex: 1 }}>
                <List>
                    <List.Item>
                        <Input
                            placeholder={'Температура'}
                            value={newData.temprature}
                            onChangeText={v => {
                                newData.temprature = v
                            }}
                        />
                    </List.Item>
                    <Button onPress={saveTemperature}>
                        Сохранить
                    </Button>
                </List>
                <ScrollView>
                    <List>
                        {
                            temprature.map((item) => (
                                <List.Item
                                    key={item._id.toString()}
                                    extra={item.datetime.toLocaleString()}
                                >
                                    {item.value.toString()}
                                </List.Item>
                            ))
                        }
                    </List>
                </ScrollView>
            </View>
            <View style={{ flex: 1 }}>
                <List>
                    <List.Item>
                        <Input
                            placeholder={'Формат: 120 80'}
                            value={newData.pressure}
                            onChangeText={v => {
                                newData.pressure = v
                            }}
                        />
                    </List.Item>
                    <Button onPress={savePressure}>
                        Сохранить
                    </Button>
                </List>
                <ScrollView>
                    <List>
                        {
                            presure.map((item) => (
                                <List.Item
                                    key={item._id.toString()}
                                    extra={item.datetime.toLocaleString()}
                                >
                                    {item.valueTop.toString()} / {item.valueBottom.toString()}
                                </List.Item>
                            ))
                        }
                    </List>
                </ScrollView>
            </View>
        </Tabs>
    )
}
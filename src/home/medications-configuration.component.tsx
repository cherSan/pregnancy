import {Button, Card, Input, List, SwipeAction, Switch, WhiteSpace, WingBlank} from "@ant-design/react-native";
import {useQuery, useRealm} from "@realm/react";
import {MedicationConfiguration as MCC} from "../realms/medication-configuration.ts";
import {ScrollView} from "react-native";
import {useCallback} from "react";
import {useReactive} from "ahooks";
import {BSON} from "realm";

export const MedicationConfiguration = () => {
    const medicationConfiguration = useQuery(MCC).sorted([
        ["planingTimeHours", false],
        ["planingTimeMinutes", false],
    ]);

    const realm = useRealm();

    const structure = useReactive({
        name: '',
        planingTimeHours: 0,
        planingTimeMinutes: 0,
        hasComment: false,
    })

    const onCreate = useCallback(() => {
        realm.write(() => {
            realm.create<MCC>(
                MCC,
                {
                    _id: new BSON.ObjectId(),
                    ...structure
                }
            );
        });
        structure.name = '';
        structure.planingTimeHours = 0;
        structure.planingTimeMinutes = 0;
        structure.hasComment = false;
    }, [realm, structure]);

    const remove = useCallback((obj: MCC) => {
        realm.write(() => {
            realm.delete(obj)
        });
    }, [realm]);

    return (
        <WingBlank size="lg">
            <WhiteSpace />
            <Card>
                <Card.Header
                    title="Добавть лекарство"
                />
                <Card.Body>
                    <List>
                        <List.Item>
                            <Input
                                placeholder={'Лекарство'}
                                value={`${structure.name}`}
                                onChange={e => {
                                    structure.name = (e.target as any).value
                                }}
                            />
                        </List.Item>
                        <List.Item>
                            <Input
                                type={'number'}
                                placeholder={'Часы'}
                                aria-valuemin={0}
                                aria-valuemax={24}
                                value={`${structure.planingTimeHours}`}
                                onChange={e => {
                                    structure.planingTimeHours = parseInt((e.target as any).value, 10)
                                }}
                            />
                        </List.Item>
                        <List.Item>
                            <Input
                                type={'number'}
                                placeholder={'Минуты'}
                                aria-valuemin={0}
                                aria-valuemax={60}
                                value={`${structure.planingTimeMinutes}`}
                                onChange={e => {
                                    structure.planingTimeMinutes = parseInt((e.target as any).value, 10)
                                }}
                            />
                        </List.Item>
                        <List.Item
                            extra={
                                <Switch
                                    onChange={e => {structure.hasComment = e}}
                                    checked={structure.hasComment}
                                />
                            }
                        >
                            Доступны комментарии
                        </List.Item>
                        <List.Item>
                            <Button
                                onPress={onCreate}
                            >
                                Принять
                            </Button>
                        </List.Item>
                    </List>
                </Card.Body>
            </Card>
            <WhiteSpace />
            <ScrollView>
                <Card>
                    <Card.Header title={'Препараты'} />
                    <Card.Body>
                        <List>
                            {
                                !medicationConfiguration?.length
                                    ? <List.Item>No Data</List.Item>
                                    :  medicationConfiguration.map((mconfig) => (
                                        <SwipeAction
                                            key={`${mconfig.name}_${mconfig.planingTimeHours}:${mconfig.planingTimeMinutes}`}
                                            right={[
                                                {
                                                    text: 'Remove',
                                                    onPress: () => remove(mconfig),
                                                    backgroundColor: 'red',
                                                    color: 'white',
                                                },
                                            ]}
                                            closeOnAction
                                            closeOnTouchOutside
                                        >
                                            <List.Item
                                                extra={`${mconfig.planingTimeHours}:${mconfig.planingTimeMinutes}`}
                                            >
                                                {mconfig.name}
                                            </List.Item>
                                        </SwipeAction>
                                    ))
                            }
                        </List>
                    </Card.Body>
                </Card>
            </ScrollView>
            <WhiteSpace />
        </WingBlank>
    )
}
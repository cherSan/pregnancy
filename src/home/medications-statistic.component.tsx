import {Button, Card, Input, List, Modal, SwipeAction, Text} from "@ant-design/react-native";
import {useNavigation} from "@react-navigation/native";
import {useCallback, useMemo} from "react";
import {useQuery, useRealm} from "@realm/react";
import {Medication} from "../realms/medication.ts";
import {useReactive} from "ahooks";
import {MedicationConfiguration as MCC} from "../realms/medication-configuration.ts";
import {BSON} from "realm";

export const MedicationsStatistic = () => {
    const navigation = useNavigation();
    const [fromDate, toDate] = useMemo(() => {
        const now = new Date();
        const from = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
        );

        const to = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
        );

        return [from, to];
    }, []);

    const extraMedications = useReactive({
        name: '',
        comment: '',
    });

    const realm = useRealm();
    
    const done = useCallback((m: Medication) => {
        realm.write(() => {
            m.realTime = new Date();
        });
        if (m.hasComment) {
            Modal.prompt(
                'Comment',
                'Please provide comment',
                (comment: string) => {
                    realm.write(() => {
                        m.comment = comment;
                    });
                },
                'default',
                '',
                ['comment'],
            )
        }
    }, [realm]);
    
    const medication = useQuery(Medication)
        .filtered("planingTime >= $0 AND planingTime < $1", fromDate, toDate)
        .sorted('planingTime', false);

    const now = useMemo(() => new Date(), []);

    const takeExtra = useCallback(() => {
        realm.write(() => {
            realm.create<Medication>(
                Medication,
                {
                    _id: new BSON.ObjectId(),
                    comment: extraMedications.comment,
                    name: extraMedications.name,
                    hasComment: true,
                    planingTime: new Date(),
                    realTime: new Date(),
                }
            );
        });
        extraMedications.name = '';
        extraMedications.comment = '';
    }, [extraMedications, realm]);

    return (
        <Card>
            <Card.Header
                title="Лекарства"
            />
            <Card.Body>
                <List>
                    {
                        medication?.length
                            ? medication.map((med) => (
                                <SwipeAction
                                    key={med._id.toString()}
                                    right={
                                    !med.realTime
                                        ? [
                                            {
                                                text: 'Done',
                                                onPress: () => done(med),
                                                backgroundColor: 'blue',
                                                color: 'white',
                                            },
                                        ]
                                        : undefined
                                }
                                    closeOnAction
                                    closeOnTouchOutside
                                >
                                    <List.Item
                                        extra={
                                            <Text
                                                style={{
                                                    color: med.realTime
                                                        ? 'green'
                                                        : (
                                                            !med.realTime && med.planingTime?.getTime() < now.getTime()
                                                                ? 'red'
                                                                : undefined
                                                        )
                                                }}
                                            >
                                                { med.realTime?.toLocaleTimeString() || med.planingTime?.toLocaleTimeString() }
                                            </Text>
                                        }
                                    >
                                        <Text>{ med?.name }</Text>
                                    </List.Item>
                                </SwipeAction>
                            ))
                            : (
                                <List.Item>
                                    <Text>Нет лекарств</Text>
                                </List.Item>
                            )
                    }
                    <List.Item>
                        <Input
                            placeholder={'Дополнительное лекарство'}
                            value={`${extraMedications.name}`}
                            onChange={e => {
                                extraMedications.name = (e.target as any).value
                            }}
                        />
                    </List.Item>
                    <List.Item>
                        <Input
                            placeholder={'Комментарий'}
                            value={`${extraMedications.comment}`}
                            onChange={e => {
                                extraMedications.comment = (e.target as any).value
                            }}
                        />
                    </List.Item>
                    <List.Item>
                        <Button
                            onPress={takeExtra}
                        >
                            Принять
                        </Button>
                    </List.Item>
                </List>
            </Card.Body>
            <Card.Footer
                content={[
                    <Button
                        onPress={() => {
                            navigation.navigate('MedicationConfiguration')
                        }}
                    >
                        Настройка
                    </Button>,
                    <Button
                        onPress={() => {
                            navigation.navigate('Medication')
                        }}
                    >
                        История
                    </Button>
                ]}
            />
        </Card>
    )
}
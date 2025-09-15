import {Button, Card, Icon, Input, List, Text} from "@ant-design/react-native";
import {useNavigation} from "@react-navigation/native";
import {useQuery, useRealm} from "@realm/react";
import {Kick} from "../realms/kick.ts";
import {useCallback, useMemo} from "react";
import {BSON} from "realm";
import {useReactive} from "ahooks";

export const KicksStatistic = () => {
    const navigation = useNavigation();
    const data = useReactive({
        comment: ''
    })
    const realm = useRealm();
    const kicks = useQuery(Kick);
    const lastKick = useMemo(
        () =>  kicks?.[kicks.length - 1],
        [kicks]
    );

    const recent1Kicks = useMemo(
        () => {
            const now = new Date();
            const last1Hours = new Date(now.getTime() - 60 * 60 * 1000);
            return kicks.filtered("datetime >= $0", last1Hours)
        },
        [kicks]
    );

    const recent2Kicks = useMemo(
        () => {
            const now = new Date();
            const last2Hours = new Date(now.getTime() - 2 * 60 * 60 * 1000);
            return kicks.filtered("datetime >= $0", last2Hours)
        },
        [kicks]
    );

    const recent12Kicks = useMemo(
        () => {
            const now = new Date();
            const last12Hours = new Date(now.getTime() - 12 * 60 * 60 * 1000);
            return kicks.filtered("datetime >= $0", last12Hours)
        },
        [kicks]
    );

    const recent24Kicks = useMemo(
        () => {
            const now = new Date();
            const last12Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            return kicks.filtered("datetime >= $0", last12Hours)
        },
        [kicks]
    );

    const registerKick = useCallback(() => {
        realm.write(() => {
            realm.create<Kick>(
                Kick,
                {
                    _id: new BSON.ObjectId(),
                    datetime: new Date(),
                    comment: data.comment,
                }
            );
        });
        data.comment = '';
    }, [data, realm])

    return (
        <Card>
            <Card.Header
                title="Movement and Pushing"
            />
            <Card.Body>
                <List>
                    <List.Item>
                        <Text>Всего толчков: {kicks.length || 0}</Text>
                    </List.Item>
                    <List.Item>
                        <Text>Последний толчок: {lastKick?.datetime?.toLocaleString() || 'Не известно'}</Text>
                    </List.Item>
                    <List.Item>
                        <Text>За последний час: {recent1Kicks?.length || 'Не известно'}</Text>
                    </List.Item>
                    <List.Item>
                        <Text>За последние 2 часа: {recent2Kicks?.length || 'Не известно'}</Text>
                    </List.Item>
                    <List.Item>
                        <Text>За последние 12 часов: {recent12Kicks?.length || 'Не известно'}</Text>
                    </List.Item>
                    <List.Item>
                        <Text>За последние 24 часа: {recent24Kicks?.length || 'Не известно'}</Text>
                    </List.Item>
                    <List.Item>
                        <Input
                            value={data.comment}
                            placeholder={'Комментарий'}
                            onChange={e => {
                                data.comment = (e.target as any).value
                            }}
                        />
                    </List.Item>
                    <List.Item>
                        <Button
                            onPress={registerKick}
                        >
                            Толчок 👣
                        </Button>
                    </List.Item>
                </List>
            </Card.Body>
            <Card.Footer
                content={[
                    <Button
                        onPress={() => {
                            navigation.navigate('Kicks')
                        }}
                    >
                        История
                    </Button>
                ]}
            />
        </Card>
    )
}
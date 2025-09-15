import {useMemo} from "react";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {Button, List, Text} from "@ant-design/react-native";
import {useQuery} from "@realm/react";
import {Kick} from "../realms/kick.ts";
import {HomeStackParamList} from "./navigation.component.tsx";
import {useNavigation} from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<
    HomeStackParamList,
    'HomeInformation'
>;

export const KicksInformation = () => {
    const navigation = useNavigation<NavigationProp>();

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

    return (
        <List
            renderFooter={
                <Button
                    type={'ghost'}
                    onPress={() => {
                        navigation.navigate('HomeKicks')
                    }}
                >
                    История толчков
                </Button>
            }
        >
            <List.Item
                extra={<Text>{kicks.length || 0}</Text>}
            >
                <Text>Всего толчков</Text>
            </List.Item>
            <List.Item
                extra={
                    <Text>{lastKick?.datetime?.toLocaleString() || 'Не известно'}</Text>
                }
            >
                <Text>Последний толчок</Text>
            </List.Item>
            <List.Item
                extra={
                    <Text>{recent1Kicks?.length || 'Не известно'}</Text>
                }
            >
                <Text>За последний час</Text>
            </List.Item>
            <List.Item
                extra={
                    <Text>{recent2Kicks?.length || 'Не известно'}</Text>
                }
            >
                <Text>За последние 2 часа</Text>
            </List.Item>
            <List.Item
                extra={
                    <Text>{recent12Kicks?.length || 'Не известно'}</Text>
                }
            >
                <Text>За последние 12 часов</Text>
            </List.Item>
            <List.Item
                extra={
                    <Text>{recent24Kicks?.length || 'Не известно'}</Text>
                }
            >
                <Text>За последние 24 часа</Text>
            </List.Item>
        </List>
    )
}
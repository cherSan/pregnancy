import {useMemo} from "react";
import {useQuery} from "@realm/react";
import {Kick} from "../realms/kick.ts";
import {useDate} from "../hooks/useDate.ts";
import {List} from "../components/list.component.tsx";

export const KicksInformation = () => {
    const { now } = useDate()
    const kicks = useQuery(Kick);
    const lastKick = useMemo(
        () =>  kicks?.[kicks.length - 1],
        [kicks]
    );

    const recent1Kicks = useMemo(
        () => {
            const last1Hours = new Date(now.getTime() - 60 * 60 * 1000);
            return kicks.filtered("datetime >= $0", last1Hours)
        },
        [kicks, now]
    );

    const recent2Kicks = useMemo(
        () => {
            const last2Hours = new Date(now.getTime() - 2 * 60 * 60 * 1000);
            return kicks.filtered("datetime >= $0", last2Hours)
        },
        [kicks, now]
    );

    const recent12Kicks = useMemo(
        () => {
            const last12Hours = new Date(now.getTime() - 12 * 60 * 60 * 1000);
            return kicks.filtered("datetime >= $0", last12Hours)
        },
        [kicks, now]
    );

    const recent24Kicks = useMemo(
        () => {
            const last12Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            return kicks.filtered("datetime >= $0", last12Hours)
        },
        [kicks, now]
    );

    return (
        <List>
            <List.Item
                title={'Всего толчков'}
                extra={kicks.length.toString()}
            />
            <List.Item
                title={'Последний толчок'}
                extra={lastKick?.datetime?.toLocaleString() || 'Не известно'}
            />
            <List.Item
                title={'За последний час'}
                extra={recent1Kicks?.length.toString() || 'Не известно'}
            />
            <List.Item
                title={'За последние 2 часа'}
                extra={recent2Kicks?.length.toString() || 'Не известно'}
            />
            <List.Item
                title={'За последние 12 часов'}
                extra={recent12Kicks?.length.toString() || 'Не известно'}
            />
            <List.Item
                title={'За последние 24 часа'}
                extra={recent24Kicks?.length.toString() || 'Не известно'}
            />
        </List>
    )
}
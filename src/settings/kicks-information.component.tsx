import {useMemo} from "react";
import {useQuery} from "@realm/react";
import {Kick} from "../realms/kick.ts";
import {useDate} from "../hooks/useDate.ts";
import {List} from "../components/list.component.tsx";
import { useT } from "../i18n";

export const KicksInformation = () => {
    const t = useT();
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
                title={t('Total kicks')}
                extra={kicks.length.toString()}
            />
            <List.Item
                title={t('Last kick')}
                extra={lastKick?.datetime?.toLocaleString() || t('Unknown')}
            />
            <List.Item
                title={t('In the last hour')}
                extra={recent1Kicks?.length.toString() || t('Unknown')}
            />
            <List.Item
                title={t('In the last 2 hours')}
                extra={recent2Kicks?.length.toString() || t('Unknown')}
            />
            <List.Item
                title={t('In the last 12 hours')}
                extra={recent12Kicks?.length.toString() || t('Unknown')}
            />
            <List.Item
                title={t('In the last 24 hours')}
                extra={recent24Kicks?.length.toString() || t('Unknown')}
            />
        </List>
    )
}
import {useQuery} from "@realm/react";
import {useMemo} from "react";
import {Medication as MP} from "../realms/medication.ts";
import {List} from "../components/list.component.tsx";
import { useT } from "../i18n";

export const MedicationStatistic = () => {
    const t = useT();
    const medications = useQuery(MP)
        .sorted('realTime', true)
    const agregation = useMemo(() => {
        return Object.entries(medications.reduce((acc, med) => {
            if (!acc[med.name.toUpperCase().trim()]) acc[med.name.toUpperCase().trim()] = [];
            acc[med.name.toUpperCase().trim()].push(med)
            return acc;
        }, {} as Record<string, MP[]>));
    }, [medications]);

    return (
        <List
            title={t('Medication intake statistics')}
        >
            {
                agregation.map(([name, medication]) => (
                    <List.Item
                        key={name}
                        title={name}
                        extra={medication.length.toString()}
                        description={
                            t('Last intake: {0}', medication[0].realTime?.toLocaleString() || t('N/A'))
                        }
                    />
                ))
            }
        </List>
    );
}
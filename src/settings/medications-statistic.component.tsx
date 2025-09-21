import {useQuery} from "@realm/react";
import {useMemo} from "react";
import {Medication as MP} from "../realms/medication.ts";
import {List} from "../components/list.component.tsx";

export const MedicationStatistic = () => {
    const medications = useQuery(MP)
        .sorted('realTime', true)
    const agregation = useMemo(() => {
        return Object.entries(medications.reduce((acc, med) => {
            if (!acc[med.name]) acc[med.name] = [];
            acc[med.name].push(med)
            return acc;
        }, {} as Record<string, MP[]>));
    }, [medications]);

    return (
        <List
            title={'Статистика приема лекарств'}
        >
            {
                agregation.map(([name, medication]) => (
                    <List.Item
                        key={name}
                        title={name}
                        extra={medication.length.toString()}
                        description={
                            `Последний прием: ${medication[0].realTime?.toLocaleString() || 'N/A'}`
                        }
                    />
                ))
            }
        </List>
    );
}
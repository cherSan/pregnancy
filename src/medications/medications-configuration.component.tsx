import {useQuery, useRealm} from "@realm/react";
import {useCallback} from "react";
import {MedicationConfiguration as MCC} from "../realms/medication-configuration.ts";
import {List} from "../components/list.component.tsx";
import {AddMedication} from "./add.medication.component.tsx";
import {Colors} from "../constants/colors.ts";

function formatTime(hours: number, minutes: number) {
    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
    return `${hh}:${mm}`;
}

export const MedicationConfiguration = () => {
    const medicationConfiguration = useQuery(MCC).sorted([
        ["planingTimeHours", false],
        ["planingTimeMinutes", false],
    ]);

    const realm = useRealm();

    const remove = useCallback((obj: MCC) => {
        realm.write(() => {
            realm.delete(obj)
        });
    }, [realm]);

    return (
        <>
            <AddMedication />
            <List>
                {
                    !medicationConfiguration?.length
                        ? <List.Item>Нет лекарств</List.Item>
                        :  medicationConfiguration.map((mconfig) => (
                            <List.Item
                                key={mconfig._id.toString()}
                                actions={{
                                    right: [
                                        {
                                            text: 'Убрать',
                                            onPress: () => remove(mconfig),
                                            backgroundColor: Colors.accent.error,
                                        },
                                    ]
                                }}
                                title={mconfig.name}
                                extra={formatTime(mconfig.planingTimeHours, mconfig.planingTimeMinutes)}
                            />
                        ))
                }
            </List>
        </>

    )
}
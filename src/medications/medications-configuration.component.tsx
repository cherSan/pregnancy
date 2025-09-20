import {SwipeAction} from "@ant-design/react-native";
import {useQuery, useRealm} from "@realm/react";
import {useCallback} from "react";
import {MedicationConfiguration as MCC} from "../realms/medication-configuration.ts";
import {List} from "../components/list.component.tsx";
import {AddMedication} from "./add.medication.component.tsx";

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
                        ? <List.Item>Нема</List.Item>
                        :  medicationConfiguration.map((mconfig) => (
                            <SwipeAction
                                key={mconfig._id.toString()}
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
                                    title={mconfig.name}
                                    extra={formatTime(mconfig.planingTimeHours, mconfig.planingTimeMinutes)}
                                />
                            </SwipeAction>
                        ))
                }
            </List>
        </>

    )
}
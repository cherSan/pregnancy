import {StyleSheet} from "react-native";
import {Button, Input, Switch} from "@ant-design/react-native";
import {useReactive} from "ahooks";
import {useCallback} from "react";
import {BSON} from "realm";
import {useRealm} from "@realm/react";
import {MedicationConfiguration as MCC} from "../realms/medication-configuration.ts";
import {List} from "../components/list.component.tsx";

export const AddMedication = () => {
    const realm = useRealm();


    const structure = useReactive({
        name: '',
        time: '',
        hasComment: false,
    });

    const onCreate = useCallback(() => {
        const [planingTimeHours, planingTimeMinutes] = structure.time.split(':').map(Number);
        const isValidHours = Number.isInteger(planingTimeHours) && planingTimeHours >= 0 && planingTimeHours <= 23;
        const isValidMinutes = Number.isInteger(planingTimeMinutes) && planingTimeMinutes >= 0 && planingTimeMinutes <= 59;

        if (
            !structure.name
            || !isValidMinutes
            || !isValidHours
        ) return;

        realm.write(() => {
            realm.create<MCC>(
                MCC,
                {
                    _id: new BSON.ObjectId(),
                    name: structure.name,
                    planingTimeHours: planingTimeHours,
                    planingTimeMinutes: planingTimeMinutes,
                    hasComment: structure.hasComment,
                }
            );
        });

        structure.name = '';
        structure.time = '';
    }, [realm, structure]);

    return (
        <List>
            <Input
                placeholder={'Лекарство'}
                defaultValue={`${structure.name}`}
                onChange={e => {
                    structure.name = (e.target as any).value
                }}
            />
            <Input
                placeholder={'Время (12:01, 01:20, 17:30)'}
                defaultValue={`${structure.time}`}
                onChange={e => {
                    structure.time = (e.target as any).value
                }}
            />
            <List.Item
                title={'Доступны комментарии'}
                extra={
                    <Switch
                        onChange={e => {structure.hasComment = e}}
                        defaultChecked={structure.hasComment}
                    />
                }
            />
            <Button type={'primary'} onPress={onCreate} style={styles.aButton}>
                Запланировать
            </Button>
        </List>
    )
}

const styles = StyleSheet.create({
    aButton: {
        flex: 1,
    },
    button: {
        color: '#5d88d6',
    },
    headerActions: {
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerActionsB: {
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
});
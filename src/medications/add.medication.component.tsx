import {StyleSheet} from "react-native";
import {Button, Input, List, Modal, Switch} from "@ant-design/react-native";
import {useReactive} from "ahooks";
import {useCallback, useState} from "react";
import {BSON} from "realm";
import {useRealm} from "@realm/react";
import {MedicationConfiguration as MCC} from "../realms/medication-configuration.ts";
import {HeaderActions} from "../components/header-action.tsx";

export const AddMedication = () => {
    const realm = useRealm();

    const [createModelVisibility, setCreateModelVisibility] = useState(false);

    const structure = useReactive({
        name: '',
        time: '',
        hasComment: false,
    });

    const toggleModal = useCallback((isOpen: boolean) => {
        setCreateModelVisibility(isOpen);
        structure.name = '';
        structure.time = '';
        structure.hasComment = false;
    }, [structure]);

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

        toggleModal(false);
    }, [realm, structure, toggleModal]);

    return (
        <>
            <HeaderActions>
                <HeaderActions.Action
                    onClick={() => toggleModal(true)}
                    icon={'plus'}
                />
            </HeaderActions>
            <Modal
                popup
                modalType={'modal'}
                visible={createModelVisibility}
                animationType="slide-up"
                closable={true}
                maskClosable={true}
                onClose={() => toggleModal(false)}
            >
                <List>
                    <List.Item>
                        <Input
                            placeholder={'Лекарство'}
                            defaultValue={`${structure.name}`}
                            onChange={e => {
                                structure.name = (e.target as any).value
                            }}
                        />
                    </List.Item>
                    <List.Item>
                        <Input
                            placeholder={'Время (12:01, 01:20, 17:30)'}
                            defaultValue={`${structure.time}`}
                            onChange={e => {
                                structure.time = (e.target as any).value
                            }}
                        />
                    </List.Item>
                    <List.Item
                        extra={
                            <Switch
                                onChange={e => {structure.hasComment = e}}
                                defaultChecked={structure.hasComment}
                            />
                        }
                    >
                        Доступны комментарии
                    </List.Item>
                    <Button type={'primary'} onPress={onCreate} style={styles.aButton}>
                        Запланировать
                    </Button>
                    <Button type={'ghost'} style={styles.aButton} onPress={() => toggleModal(false)}>
                        Закрыть
                    </Button>
                </List>
            </Modal>
        </>
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
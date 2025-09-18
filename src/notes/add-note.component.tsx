import {useReactive} from "ahooks";
import {useCallback, useState} from "react";
import {BSON} from "realm";
import {useRealm} from "@realm/react";
import {Button, Input, List, Modal, TextareaItem} from "@ant-design/react-native";
import {StyleSheet} from "react-native";
import {Notes} from "../realms/notes.ts";
import {HeaderActions} from "../components/header-action.tsx";

export const AddNote = () => {
    const [createModelVisibility, setCreateModelVisibility] = useState(false);

    const realm = useRealm();

    const data = useReactive({
        title: '',
        comment: '',
        important: '',
    });

    const toggleModal = useCallback((isOpen: boolean) => {
        setCreateModelVisibility(isOpen);
        data.title = '';
        data.comment = '';
        data.important = '';
    }, [data]);


    const onCreate = useCallback(() => {
        if (
            !data.title
            || !data.comment
        ) return;
        realm.write(() => {
            realm.create<Notes>(
                Notes,
                {
                    _id: new BSON.ObjectId(),
                    datetime: new Date(),
                    ...data
                }
            );
        });
        toggleModal(false)
    }, [realm, data, toggleModal]);

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
                            placeholder={'Заголовок'}
                            value={`${data.title}`}
                            onChange={e => {
                                data.title = (e.target as any).value
                            }}
                        />
                    </List.Item>
                    <List.Item>
                        <TextareaItem
                            rows={4}
                            count={5000}
                            placeholder="Сообщение"
                            value={`${data.comment}`}
                            onChangeText={e => {
                                data.comment = e;
                            }}
                        />
                    </List.Item>
                    <List.Item>
                        <TextareaItem
                            rows={4}
                            count={5000}
                            placeholder="Важно"
                            value={`${data.important}`}
                            onChangeText={e => {
                                data.important = e;
                            }}
                        />
                    </List.Item>
                    <Button type={'primary'} onPress={onCreate} style={styles.aButton}>
                        Добавить
                    </Button>
                    <Button type={'ghost'} style={styles.aButton} onPress={() => toggleModal(false)}>
                        Закрыть
                    </Button>
                </List>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    aButton: {
        flex: 1,
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
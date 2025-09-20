import {useReactive} from "ahooks";
import {useCallback} from "react";
import {BSON} from "realm";
import {useRealm} from "@realm/react";
import {Button, Input, TextareaItem} from "@ant-design/react-native";
import {StyleSheet} from "react-native";
import {useNavigation} from "@react-navigation/core";
import {Notes} from "../realms/notes.ts";
import {List} from "../components/list.component.tsx";

export const AddNote = () => {
    const realm = useRealm();
    const navigation = useNavigation();

    const data = useReactive({
        title: '',
        comment: '',
        important: '',
    });


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
        navigation.goBack();
    }, [realm, data, navigation]);

    return (
        <List>
            <Input
                placeholder={'Заголовок'}
                value={`${data.title}`}
                onChange={e => {
                    data.title = (e.target as any).value
                }}
            />
            <TextareaItem
                rows={4}
                count={5000}
                placeholder="Сообщение"
                value={`${data.comment}`}
                onChangeText={e => {
                    data.comment = e;
                }}
            />
            <TextareaItem
                rows={4}
                count={5000}
                placeholder="Важно"
                value={`${data.important}`}
                onChangeText={e => {
                    data.important = e;
                }}
            />
            <Button type={'primary'} onPress={onCreate} style={styles.aButton}>
                Добавить
            </Button>
        </List>
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
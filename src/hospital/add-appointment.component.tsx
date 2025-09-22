import {StyleSheet} from "react-native";
import {Button, DatePicker} from "@ant-design/react-native";
import {useReactive} from "ahooks";
import {useCallback} from "react";
import {BSON} from "realm";
import {useRealm} from "@realm/react";
import {Hospital} from "../realms/hospital.ts";
import {useNavigation} from "@react-navigation/core";
import {List} from "../components/list.component.tsx";
import {Input} from "../components/form/Input.component.tsx";

export const AddAppointment = () => {
    const realm = useRealm();

    const navigation = useNavigation();

    const structure = useReactive({
        datetime: new Date(),
        doctor: '',
        hospital: '',
        visitType: '',
    });

    const onCreate = useCallback(() => {
        if (
            !structure.datetime
            || !structure.doctor
            || !structure.hospital
        ) return;

        realm.write(() => {
            realm.create<Hospital>(
                Hospital,
                {
                    _id: new BSON.ObjectId(),
                    datetime: structure.datetime,
                    doctor: structure.doctor,
                    hospital: structure.hospital,
                    visitType: structure.visitType,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    attachments: [],
                    tags: [],
                    questions: [],
                }
            );
        });
        navigation.goBack();
    }, [realm, structure, navigation]);

    return (
        <List>
            <DatePicker
                value={structure.datetime}
                precision="minute"
                minDate={new Date(2010, 11, 3)}
                maxDate={new Date(2100, 11, 3)}
                onChange={(e) => {
                    structure.datetime = e
                }}
            >
                <List.Item title="Дата" />
            </DatePicker>
            <Input
                placeholder={'Врач'}
                value={`${structure.doctor}`}
                onChangeText={e => {
                    structure.doctor = e;
                }}
            />
            <Input
                placeholder={'Больница'}
                value={`${structure.hospital}`}
                onChangeText={e => {
                    structure.hospital = e;
                }}
            />
            <Input
                placeholder={'Тип Визита'}
                value={`${structure.visitType}`}
                onChangeText={e => {
                    structure.visitType = e;
                }}
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
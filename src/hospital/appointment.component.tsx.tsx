import {FC, useCallback, useMemo} from "react";
import {useObject, useRealm} from "@realm/react";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {StyleSheet} from "react-native";
import {Button, List, Slider, Text, TextareaItem, Toast, View} from "@ant-design/react-native";
import {ScrollView} from "../components/scroll-view.component.tsx";
import {StackParamList} from "./navigation.component.tsx";
import {Hospital} from "../realms/hospital.ts";
import {BSON} from "realm";

type Props = NativeStackScreenProps<StackParamList, 'HospitalAppointment'>;

export const Appointment: FC<Props> = ({ route }) => {
    const realm = useRealm();
    const id = useMemo(() => route.params.id, [route]);
    const appointment = useObject(Hospital, new BSON.ObjectId(id));
    const finialise = useCallback(() => {
        if (!appointment) return;
        realm.write(() => {
            appointment.isCompleted = true;
        })
    }, [appointment, realm])
    const recommendation = useCallback((e: string) => {
        if (!appointment) return;
        realm.write(() => {
            appointment.recommendations = e;
        })
    }, [appointment, realm])

    const weightMotherToastValue = useCallback((value: number | [number, number]) => {
        let text = ''
        if (typeof value === 'number') {
            text = `${value}`
        } else {
            text = `[${value.join(',')}]`
        }
        Toast.show({ content: `Вес：${text}`, position: 'top' })
    }, []);
    const weightMother = useCallback((e: number) => {
        if (!appointment) return;
        realm.write(() => {
            appointment.weightMother = e;
        })
    }, [appointment, realm])

    if (!appointment) return null;

    return (
        <ScrollView>
            <List>
                <List.Item
                    extra={appointment.datetime.toLocaleString()}
                >
                    Время приема
                </List.Item>
                <List.Item
                    extra={appointment.doctor}
                >
                    Доктор
                </List.Item>
                <List.Item
                    extra={appointment.hospital}
                >
                    Клиника
                </List.Item>
                <List.Item
                    arrow={'horizontal'}
                >
                    Вопросы
                </List.Item>
                <List.Item>
                    <TextareaItem
                        rows={4}
                        count={5000}
                        placeholder="Рекомендация"
                        value={appointment.recommendations ?? ''}
                        onChangeText={recommendation}
                    />
                </List.Item>
                <List.Item>
                    <View>
                        <Text>{appointment.weightMother}</Text>
                    </View>
                    <Slider
                        min={50}
                        max={80}
                        step={.1}
                        onChange={weightMotherToastValue}
                        value={appointment.weightMother}
                        onAfterChange={weightMother}
                    />
                </List.Item>
                {
                    !appointment.isCompleted
                        ? (
                            <Button type={'primary'} onPress={finialise} style={styles.aButton}>
                                Завершить
                            </Button>
                        )
                        : <></>
                }
            </List>
        </ScrollView>
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
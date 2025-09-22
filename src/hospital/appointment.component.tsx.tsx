import {FC, useCallback, useMemo} from "react";
import {useObject, useRealm} from "@realm/react";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {StyleSheet} from "react-native";
import {Button, Text, TextareaItem} from "@ant-design/react-native";
import {StackParamList} from "./navigation.component.tsx";
import {Hospital} from "../realms/hospital.ts";
import {BSON} from "realm";
import {MotherWeight} from "../realms/mother-weight.ts";
import {MotherPressure} from "../realms/mother-pressure.ts";
import {MotherTemperature} from "../realms/mother-temperature.ts";
import {List} from "../components/list.component.tsx";
import {Input} from "../components/form/Input.component.tsx";

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
    const questions = useCallback((e: string) => {
        if (!appointment) return;
        realm.write(() => {
            appointment.questions = [
                e
            ];
        })
    }, [appointment, realm])

    const motherWeight = useCallback((e: string) => {
        if (!appointment) return;
        const value = parseFloat(e);
        realm.write(() => {
            if(!appointment.motherWeight) {
                appointment.motherWeight = realm.create<MotherWeight>(
                    MotherWeight,
                    {
                        _id: new BSON.ObjectId(),
                        value,
                        datetime: new Date()
                    }
                )
            } else {
                appointment.motherWeight.value = value;
                appointment.motherWeight.datetime = new Date();
            }
        })
    }, [appointment, realm])

    const motherPressureTop = useCallback((e: string) => {
        if (!appointment) return;
        const value = parseFloat(e);
        realm.write(() => {
            if(!appointment.motherPressure) {
                appointment.motherPressure = realm.create<MotherPressure>(
                    MotherPressure,
                    {
                        _id: new BSON.ObjectId(),
                        valueTop: value,
                        valueBottom: 0,
                        datetime: new Date()
                    }
                )
            } else {
                appointment.motherPressure.valueTop = value;
                appointment.motherPressure.datetime = new Date();
            }
        })
    }, [appointment, realm])

    const motherPressureBottom = useCallback((e: string) => {
        if (!appointment) return;
        const value = parseFloat(e);
        realm.write(() => {
            if(!appointment.motherPressure) {
                appointment.motherPressure = realm.create<MotherPressure>(
                    MotherPressure,
                    {
                        _id: new BSON.ObjectId(),
                        valueTop: 0,
                        valueBottom: value,
                        datetime: new Date()
                    }
                )
            } else {
                appointment.motherPressure.valueBottom = value;
                appointment.motherPressure.datetime = new Date();
            }
        })
    }, [appointment, realm])

    const motherTemperature = useCallback((e: string) => {
        if (!appointment) return;
        const value = parseFloat(e);
        realm.write(() => {
            if(!appointment.motherTemperature) {
                appointment.motherTemperature = realm.create<MotherTemperature>(
                    MotherTemperature,
                    {
                        _id: new BSON.ObjectId(),
                        value: value,
                        datetime: new Date()
                    }
                )
            } else {
                appointment.motherTemperature.value = value;
                appointment.motherTemperature.datetime = new Date();
            }
        })
    }, [appointment, realm])

    const babyWeight = useCallback((e: string) => {
        if (!appointment) return;
        const value = parseFloat(e);
        realm.write(() => {
            appointment.babyWeight = value;
        })
    }, [appointment, realm])

    const babySize = useCallback((e: string) => {
        if (!appointment) return;
        const value = parseFloat(e);
        realm.write(() => {
            appointment.babySize = value;
        })
    }, [appointment, realm])

    const babyHeadSize = useCallback((e: string) => {
        if (!appointment) return;
        const value = parseFloat(e);
        realm.write(() => {
            appointment.babyHeadSize = value;
        })
    }, [appointment, realm])

    const babyHeartBeat = useCallback((e: string) => {
        if (!appointment) return;
        const value = parseFloat(e);
        realm.write(() => {
            appointment.babyHeartBeat = value;
        })
    }, [appointment, realm])

    if (!appointment) return null;

    return (
        <>
            <List
                title={'Прием'}
            >
                <List.Item
                    title={'Время приема'}
                    extra={appointment.datetime.toLocaleString()}
                />
                <List.Item
                    title={'Доктор'}
                    extra={appointment.doctor}
                />
                <List.Item
                    title={'Клиника'}
                    extra={appointment.hospital}
                />
            </List>
            <List
                title={'Q&A'}
            >
                {
                    appointment.isCompleted
                        ? (
                            <List.Item><Text>Q: {appointment.questions?.[0]}</Text></List.Item>
                        )
                        : (
                            <TextareaItem
                                rows={4}
                                count={5000}
                                placeholder="Вопросы"
                                defaultValue={appointment.questions?.[0] ?? ''}
                                onChangeText={questions}
                            />
                        )
                }
                {
                    appointment.isCompleted
                        ? (
                            <List.Item><Text>A: {appointment.recommendations}</Text></List.Item>
                        )
                        : (
                            <TextareaItem
                                rows={4}
                                disabled={appointment.isCompleted}
                                count={5000}
                                placeholder="Рекомендация"
                                defaultValue={appointment.recommendations ?? ''}
                                onChangeText={recommendation}
                            />
                        )
                }
            </List>
            <List
                title={'Мама'}
            >
                    <Input
                        keyboardType={'numeric'}
                        editable={!appointment.isCompleted}
                        placeholder={'Вес мамы'}
                        defaultValue={`${appointment.motherWeight?.value || ''}`}
                        onChangeText={motherWeight}
                    />
                    <Input
                        keyboardType={'numeric'}
                        editable={!appointment.isCompleted}
                        placeholder={'Давление мамы верхнее'}
                        defaultValue={`${appointment.motherPressure?.valueTop || ''}`}
                        onChangeText={motherPressureTop}
                    />
                    <Input
                        keyboardType={'numeric'}
                        editable={!appointment.isCompleted}
                        placeholder={'Давление мамы нижнее'}
                        defaultValue={`${appointment.motherPressure?.valueBottom || ''}`}
                        onChangeText={motherPressureBottom}
                    />
                    <Input
                        keyboardType={'numeric'}
                        editable={!appointment.isCompleted}
                        placeholder={'Температура мамы'}
                        defaultValue={`${appointment.motherTemperature?.value || ''}`}
                        onChangeText={motherTemperature}
                    />
            </List>
            <List
                title={'Малыш'}
            >
                <Input
                    keyboardType={'numeric'}
                    editable={!appointment.isCompleted}
                    placeholder={'Вес ребенка'}
                    defaultValue={`${appointment.babyWeight || ''}`}
                    onChangeText={babyWeight}
                />
                <Input
                    keyboardType={'numeric'}
                    editable={!appointment.isCompleted}
                    placeholder={'Размер ребенка'}
                    defaultValue={`${appointment.babySize || ''}`}
                    onChangeText={babySize}
                />
                <Input
                    keyboardType={'numeric'}
                    editable={!appointment.isCompleted}
                    placeholder={'Размер головы'}
                    defaultValue={`${appointment.babyHeadSize || ''}`}
                    onChangeText={babyHeadSize}
                />
                <Input
                    keyboardType={'numeric'}
                    editable={!appointment.isCompleted}
                    placeholder={'Серцебиение'}
                    defaultValue={`${appointment.babyHeartBeat || ''}`}
                    onChangeText={babyHeartBeat}
                />
            </List>
            {
                !appointment.isCompleted
                    ? (
                        <List>
                            <Button type={'primary'} onPress={finialise} style={styles.aButton}>
                                Завершить
                            </Button>
                        </List>
                    )
                    : null
            }
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
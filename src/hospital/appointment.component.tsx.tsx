import {FC, useMemo, useCallback, useRef} from "react";
import { useObject, useRealm } from "@realm/react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BSON } from "realm";
import { useFormik } from "formik";
import * as Yup from "yup";
import { StackParamList } from "./navigation.component.tsx";
import { Hospital } from "../realms/hospital.ts";
import { MotherWeight } from "../realms/mother-weight.ts";
import { MotherPressure } from "../realms/mother-pressure.ts";
import { MotherTemperature } from "../realms/mother-temperature.ts";
import { List } from "../components/list.component.tsx";
import { Input } from "../components/form/Input.component.tsx";
import { Textarea } from "../components/form/Textarea.component.tsx";
import {Button} from "../components/form/Button.component.tsx";

const HospitalSchema = Yup.object().shape({
    doctor: Yup.string(),
    hospital: Yup.string(),
    visitType: Yup.string(),

    motherWeight: Yup.number()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable()
        .typeError("Введите число")
        .min(30, "Слишком маленький вес")
        .max(400, "Слишком большой вес"),

    motherPulse: Yup.number()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable()
        .max(300, 'Меньше 300')
        .min(40, 'Больше 40')
        .integer("Должно быть целое")
        .typeError("Должно быть число"),

    motherPressureTop: Yup.number()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable()
        .max(300, 'Меньше 300')
        .min(40, 'Больше 40')
        .integer("Должно быть целое")
        .typeError("Должно быть число"),

    motherPressureBottom: Yup.number()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable()
        .max(300, 'Меньше 300')
        .min(40, 'Больше 40')
        .integer("Должно быть целое")
        .typeError("Должно быть число"),

    motherTemperature: Yup.number()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable()
        .typeError("Введите число")
        .min(30, "Температура не может быть ниже 30°C")
        .max(50, "Температура не может быть выше 50°C"),

    babyWeight: Yup.number()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable()
        .typeError("Должно быть число"),

    babySize: Yup.number()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable()
        .typeError("Должно быть число"),

    babyHeadSize: Yup.number()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable()
        .typeError("Должно быть число"),

    babyHeartBeat: Yup.number()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable()
        .typeError("Должно быть число"),

    questions: Yup.string(),
    recommendations: Yup.string(),
});


type Props = NativeStackScreenProps<StackParamList, 'HospitalAppointment'>;

export const Appointment: FC<Props> = ({
    route,
    navigation,
}) => {
    const realm = useRealm();
    const id = useMemo(() => route.params.id, [route]);
    const appointment = useObject(Hospital, new BSON.ObjectId(id));

    const formik = useFormik({
        initialValues: {
            doctor: appointment?.doctor || '',
            hospital: appointment?.hospital || '',
            visitType: appointment?.visitType || '',

            motherWeight: appointment?.motherWeight?.value ? appointment?.motherWeight?.value?.toFixed(1) : '',
            motherPressureTop: appointment?.motherPressure?.valueTop ? appointment?.motherPressure?.valueTop?.toFixed(0) : '',
            motherPressureBottom: appointment?.motherPressure?.valueBottom ? appointment?.motherPressure?.valueBottom?.toFixed(0) : '',
            motherPulse: appointment?.motherPressure?.pulse ? appointment?.motherPressure?.pulse?.toFixed(0) : '',
            motherTemperature: appointment?.motherTemperature?.value ? appointment?.motherTemperature?.value?.toFixed(1) : '',

            babyWeight: appointment?.babyWeight ? appointment?.babyWeight?.toFixed(3) : '',
            babySize: appointment?.babySize ? appointment?.babySize?.toFixed(3) : '',
            babyHeadSize: appointment?.babyHeadSize ? appointment?.babyHeadSize?.toFixed(3) : '',
            babyHeartBeat: appointment?.babyHeartBeat ? appointment?.babyHeartBeat?.toFixed(0) : '',

            questions: appointment?.questions?.[0] || '',
            recommendations: appointment?.recommendations || '',
        },
        validationSchema: HospitalSchema,
        onSubmit: (values) => {
            if (!appointment) return;
            realm.write(() => {
                // Мама
                if (!appointment.motherWeight) {
                    appointment.motherWeight = realm.create(MotherWeight, {
                        _id: new BSON.ObjectId(),
                        value: 0,
                        datetime: new Date(),
                    });
                }
                appointment.motherWeight.value = values.motherWeight ? parseFloat(values.motherWeight) : 0;
                appointment.motherWeight.datetime = new Date();

                if (!appointment.motherPressure) {
                    appointment.motherPressure = realm.create(MotherPressure, {
                        _id: new BSON.ObjectId(),
                        valueTop: 0,
                        valueBottom: 0,
                        pulse: 0,
                        datetime: new Date(),
                    });
                }
                appointment.motherPressure.valueTop = values.motherPressureTop ? parseInt(values.motherPressureTop, 10) : 0;
                appointment.motherPressure.valueBottom = values.motherPressureBottom ? parseInt(values.motherPressureBottom, 10) : 0;
                appointment.motherPressure.pulse = values.motherPulse ? parseInt(values.motherPulse, 10) : 0;
                appointment.motherPressure.datetime = new Date();

                if (!appointment.motherTemperature) {
                    appointment.motherTemperature = realm.create(MotherTemperature, {
                        _id: new BSON.ObjectId(),
                        value: 0,
                        datetime: new Date(),
                    });
                }
                appointment.motherTemperature.value = values.motherTemperature ? parseFloat(values.motherTemperature) : 0;
                appointment.motherTemperature.datetime = new Date();

                // Малыш
                appointment.babyWeight = values.babyWeight ? parseFloat(values.babyWeight) : 0;
                appointment.babySize = values.babySize ? parseFloat(values.babySize) : 0;
                appointment.babyHeadSize = values.babyHeadSize ? parseFloat(values.babyHeadSize) : 0;
                appointment.babyHeartBeat = values.babyHeartBeat ? parseFloat(values.babyHeartBeat) : 0;

                // Q&A
                appointment.questions = [values.questions];
                appointment.recommendations = values.recommendations;
            });
        }
    });
    const timeout = useRef<any>(null);
    const handleChange = useCallback((field: keyof typeof formik.values) => (ev: string) => {
        formik.handleChange(field)(ev);
        if (timeout.current !== null) clearTimeout(timeout.current)
        timeout.current = setTimeout(formik.submitForm, 300);
    }, [formik]);

    const finialise = useCallback(() => {
        if (!appointment) return;
        realm.write(() => {
            appointment.isCompleted = true;
        });
    }, [appointment, realm]);
    
    if (!appointment) return null;

    return (
        <>
            <List title="Прием">
                <List.Item title="Время приема" extra={appointment.datetime.toLocaleString()} />
                <List.Item title="Доктор" extra={formik.values.doctor} />
                <List.Item title="Клиника" extra={formik.values.hospital} />
                <List.Item title="Тип визита" extra={formik.values.visitType} />
            </List>

            <List title="Вопросы и Рекомендации">
                <Textarea
                    placeholder="Вопросы"
                    minRows={4}
                    maxLength={5000}
                    showCount
                    value={formik.values.questions}
                    onChangeText={handleChange('questions')}
                    onBlur={formik.handleBlur('questions')}
                    editable={!appointment.isCompleted}
                />
                <Textarea
                    placeholder="Рекомендации"
                    minRows={4}
                    maxLength={5000}
                    showCount
                    value={formik.values.recommendations}
                    onChangeText={handleChange('recommendations')}
                    onBlur={formik.handleBlur('recommendations')}
                    editable={!appointment.isCompleted}
                />
            </List>

            <List title="Мама">
                <Input
                    inline={true}
                    placeholder="Вес мамы"
                    keyboardType="numeric"
                    value={`${formik.values.motherWeight}`}
                    onChangeText={handleChange('motherWeight')}
                    onBlur={formik.handleBlur('motherWeight')}
                    error={formik.touched.motherWeight ? formik.errors.motherWeight : undefined}
                    editable={!appointment.isCompleted}
                />
                <Input
                    inline={true}
                    placeholder="Давление верхнее"
                    keyboardType="numeric"
                    value={`${formik.values.motherPressureTop}`}
                    onChangeText={handleChange('motherPressureTop')}
                    onBlur={formik.handleBlur('motherPressureTop')}
                    error={formik.touched.motherPressureTop ? formik.errors.motherPressureTop : undefined}
                    editable={!appointment.isCompleted}
                />
                <Input
                    inline={true}
                    placeholder="Давление нижнее"
                    keyboardType="numeric"
                    value={`${formik.values.motherPressureBottom}`}
                    onChangeText={handleChange('motherPressureBottom')}
                    onBlur={formik.handleBlur('motherPressureBottom')}
                    error={formik.touched.motherPressureBottom ? formik.errors.motherPressureBottom : undefined}
                    editable={!appointment.isCompleted}
                />
                <Input
                    inline={true}
                    placeholder="Пульс"
                    keyboardType="numeric"
                    value={`${formik.values.motherPulse}`}
                    onChangeText={handleChange('motherPulse')}
                    onBlur={formik.handleBlur('motherPulse')}
                    error={formik.touched.motherPulse ? formik.errors.motherPulse : undefined}
                    editable={!appointment.isCompleted}
                />
                <Input
                    inline={true}
                    placeholder="Температура"
                    keyboardType="numeric"
                    value={`${formik.values.motherTemperature}`}
                    onChangeText={handleChange('motherTemperature')}
                    onBlur={formik.handleBlur('motherTemperature')}
                    error={formik.touched.motherTemperature ? formik.errors.motherTemperature : undefined}
                    editable={!appointment.isCompleted}
                />
            </List>

            <List title="Малыш">
                <Input
                    inline={true}
                    placeholder="Вес ребенка"
                    keyboardType="numeric"
                    value={`${formik.values.babyWeight}`}
                    onChangeText={handleChange('babyWeight')}
                    onBlur={formik.handleBlur('babyWeight')}
                    error={formik.touched.babyWeight ? formik.errors.babyWeight : undefined}
                    editable={!appointment.isCompleted}
                />
                <Input
                    inline={true}
                    placeholder="Размер ребенка"
                    keyboardType="numeric"
                    value={`${formik.values.babySize}`}
                    onChangeText={handleChange('babySize')}
                    onBlur={formik.handleBlur('babySize')}
                    error={formik.touched.babySize ? formik.errors.babySize : undefined}
                    editable={!appointment.isCompleted}
                />
                <Input
                    inline={true}
                    placeholder="Размер головы"
                    keyboardType="numeric"
                    value={`${formik.values.babyHeadSize}`}
                    onChangeText={handleChange('babyHeadSize')}
                    onBlur={formik.handleBlur('babyHeadSize')}
                    error={formik.touched.babyHeadSize ? formik.errors.babyHeadSize : undefined}
                    editable={!appointment.isCompleted}
                />
                <Input
                    inline={true}
                    placeholder="Сердцебиение"
                    keyboardType="numeric"
                    value={`${formik.values.babyHeartBeat}`}
                    onChangeText={handleChange('babyHeartBeat')}
                    onBlur={formik.handleBlur('babyHeartBeat')}
                    error={formik.touched.babyHeartBeat ? formik.errors.babyHeartBeat : undefined}
                    editable={!appointment.isCompleted}
                />
            </List>
            <List>
                <List.Item
                    onPress={() => navigation.navigate(
                        {
                            name: 'HospitalAppointmentPhotos',
                            params: { id }
                        }
                    )}
                    title={'Вложения'}
                    arrow={true}
                />
            </List>
            {!appointment.isCompleted && (
                <List>
                    <Button type="primary" onPress={finialise}>
                        Завершить
                    </Button>
                </List>
            )}
        </>
    );
};
